// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsScreenView is the view for the 'Equations' screen.
 *
 * @author Martin Veillette
 */

import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CoordinateSnapModeRadioButtonGroup from '../../common/view/CoordinateSnapModeRadioButtonGroup.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsModel from '../model/EquationsModel.js';
import EquationsGraphControlPanel from './EquationsGraphControlPanel.js';
import EquationsSceneNode from './EquationsSceneNode.js';
import EquationsViewProperties from './EquationsViewProperties.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import EquationsScene from '../model/EquationsScene.js';

export default class EquationsScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: EquationsViewProperties;

  public constructor( model: EquationsModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new EquationsViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Controls for the graph, at upper right
    const graphControlPanel = new EquationsGraphControlPanel(
      model.cartesianScene.vectorSet,
      model.polarScene.vectorSet,
      model.componentVectorStyleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // Radio buttons for selecting a scene, at lower right
    const sceneRadioButtonGroup = new CoordinateSnapModeRadioButtonGroup<EquationsScene>(
      model.sceneProperty,
      [ model.cartesianScene, model.polarScene ],
      [
        VectorAdditionIconFactory.createCartesianSceneIcon( model.cartesianScene.vectorSet.vectorColorPalette ),
        VectorAdditionIconFactory.createPolarSceneIcon( model.polarScene.vectorSet.vectorColorPalette )
      ],
      {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'sceneRadioButtonGroup' )
      } );

    // Used to make all radio buttons in the Equation accordion box the same effective size.
    const equationButtonsAlignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: true
    } );

    // Used to make all interactive equations in the Equation accordion box the same effective size.
    const equationsAlignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: true
    } );

    // Node for each scene.
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );

    const cartesianSceneNode = new EquationsSceneNode(
      model.cartesianScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      graphControlPanel.bottom,
      equationButtonsAlignGroup,
      equationsAlignGroup,
      sceneNodesTandem.createTandem( 'cartesianSceneNode' ) );

    const polarSceneNode = new EquationsSceneNode(
      model.polarScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      graphControlPanel.bottom,
      equationButtonsAlignGroup,
      equationsAlignGroup,
      sceneNodesTandem.createTandem( 'polarSceneNode' ) );

    // Cancel interactions when switching scenes.
    this.viewProperties.coordinateSnapModeProperty.link( () => this.interruptSubtreeInput() );

    const screenViewRootNode = new Node( {
      children: [
        graphControlPanel,
        sceneRadioButtonGroup,
        cartesianSceneNode,
        polarSceneNode,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [

      // Cartesian scene
      cartesianSceneNode.equationAccordionBox,
      cartesianSceneNode.vectorSetNodesParent,
      cartesianSceneNode.graphNode.originManipulator,
      cartesianSceneNode.vectorValuesAccordionBox,

      // polar scene
      polarSceneNode.equationAccordionBox,
      polarSceneNode.vectorSetNodesParent,
      polarSceneNode.graphNode.originManipulator,
      polarSceneNode.vectorValuesAccordionBox
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      graphControlPanel,
      cartesianSceneNode.baseVectorsAccordionBox,
      polarSceneNode.baseVectorsAccordionBox,
      sceneRadioButtonGroup,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

vectorAddition.register( 'EquationsScreenView', EquationsScreenView );