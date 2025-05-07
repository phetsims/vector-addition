// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScreenView is the view for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import SceneRadioButtonGroup from '../../common/view/SceneRadioButtonGroup.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import LabModel from '../model/LabModel.js';
import LabGraphControlPanel from './LabGraphControlPanel.js';
import LabViewProperties from './LabViewProperties.js';
import LabSceneNode from './LabSceneNode.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';

export default class LabScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: LabViewProperties;

  public constructor( model: LabModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new LabViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Controls for the graph, at upper right
    const graphControlPanel = new LabGraphControlPanel(
      model.sceneProperty,
      model.cartesianScene,
      model.polarScene,
      model.componentVectorStyleProperty,
      model.sum1VisibleProperty,
      model.sum2VisibleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // CoordinateSnapMode radio buttons, at lower right
    const coordinateSnapModeRadioButtonGroup = new SceneRadioButtonGroup(
      model.sceneProperty,
      [ model.cartesianScene, model.polarScene ],
      [
        VectorAdditionIconFactory.createCartesianSceneIcon( model.cartesianScene.vectorSet1.vectorColorPalette ),
        VectorAdditionIconFactory.createPolarSceneIcon( model.polarScene.vectorSet1.vectorColorPalette )
      ],
      {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'coordinateSnapModeRadioButtonGroup' )
      } );

    // Node for each scene.
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );
    const cartesianSceneNode = new LabSceneNode(
      model.cartesianScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      coordinateSnapModeRadioButtonGroup,
      sceneNodesTandem.createTandem( 'cartesianSceneNode' ) );

    const polarSceneNode = new LabSceneNode(
      model.polarScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      coordinateSnapModeRadioButtonGroup,
      sceneNodesTandem.createTandem( 'polarSceneNode' ) );

    // Cancel interactions when switching scenes.
    model.sceneProperty.link( () => this.interruptSubtreeInput() );

    const screenViewRootNode = new Node( {
      children: [
        graphControlPanel,
        coordinateSnapModeRadioButtonGroup,
        cartesianSceneNode,
        polarSceneNode,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [

      // Cartesian scene
      cartesianSceneNode.vectorCreatorPanel,
      cartesianSceneNode.vectorSetNodesParent,
      cartesianSceneNode.graphNode.originManipulator,
      cartesianSceneNode.eraserButton,
      cartesianSceneNode.vectorValuesAccordionBox,

      // polar scene
      polarSceneNode.vectorCreatorPanel,
      polarSceneNode.vectorSetNodesParent,
      polarSceneNode.graphNode.originManipulator,
      polarSceneNode.eraserButton,
      polarSceneNode.vectorValuesAccordionBox
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      graphControlPanel,
      coordinateSnapModeRadioButtonGroup,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    this.viewProperties.reset();
    super.reset();
  }
}

vectorAddition.register( 'LabScreenView', LabScreenView );