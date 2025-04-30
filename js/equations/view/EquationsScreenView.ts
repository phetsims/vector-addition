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

export default class EquationsScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: EquationsViewProperties;

  public constructor( model: EquationsModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new EquationsViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Controls for the graph, at upper right
    const graphControlPanel = new EquationsGraphControlPanel(
      model.cartesianGraph.vectorSet,
      model.polarGraph.vectorSet,
      model.componentVectorStyleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // Coordinate Snap radio buttons, at lower right
    const coordinateSnapModeRadioButtonGroup = new CoordinateSnapModeRadioButtonGroup(
      this.viewProperties.coordinateSnapModeProperty,
      model.cartesianVectorColorPalette,
      model.polarVectorColorPalette, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'coordinateSnapModeRadioButtonGroup' )
      } );

    // Used to make all of the radio button in the Equation accordion box the same effective size.
    const equationButtonsAlignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: true
    } );

    // Used to make all interactive equations in the Equation accordion box the same effective size.
    const equationsAlignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: true
    } );

    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );

    const cartesianSceneNode = new EquationsSceneNode(
      model.cartesianGraph,
      this.viewProperties,
      model.componentVectorStyleProperty,
      graphControlPanel.bottom,
      equationButtonsAlignGroup,
      equationsAlignGroup, {
        tandem: sceneNodesTandem.createTandem( 'cartesianSceneNode' )
      } );

    const polarSceneNode = new EquationsSceneNode(
      model.polarGraph,
      this.viewProperties,
      model.componentVectorStyleProperty,
      graphControlPanel.bottom,
      equationButtonsAlignGroup,
      equationsAlignGroup, {
        tandem: sceneNodesTandem.createTandem( 'polarSceneNode' )
      } );

    // Switch between scenes to match coordinate snap mode.
    // unlink is unnecessary, exists for the lifetime of the sim.
    this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
      this.interruptSubtreeInput(); // cancel interactions when switching scenes
      cartesianSceneNode.visible = ( coordinateSnapMode === 'cartesian' );
      polarSceneNode.visible = ( coordinateSnapMode === 'polar' );
    } );

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
      cartesianSceneNode.vectorSetNodesParent,
      cartesianSceneNode.graphNode.originManipulator,

      // polar scene
      polarSceneNode.vectorSetNodesParent,
      polarSceneNode.graphNode.originManipulator
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      cartesianSceneNode.vectorValuesAccordionBox,
      polarSceneNode.vectorValuesAccordionBox,
      cartesianSceneNode.equationAccordionBox,
      polarSceneNode.equationAccordionBox,
      graphControlPanel,
      cartesianSceneNode.baseVectorsAccordionBox,
      polarSceneNode.baseVectorsAccordionBox,
      coordinateSnapModeRadioButtonGroup,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

vectorAddition.register( 'EquationsScreenView', EquationsScreenView );