// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScreenView is the view for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CoordinateSnapRadioButtonGroup from '../../common/view/CoordinateSnapRadioButtonGroup.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import LabModel from '../model/LabModel.js';
import LabGraphControlPanel from './LabGraphControlPanel.js';
import LabVectorCreatorPanel from './LabVectorCreatorPanel.js';


export default class LabScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: VectorAdditionViewProperties;

  public constructor( model: LabModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new VectorAdditionViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Controls for the graph, at upper right
    const graphControlPanel = new LabGraphControlPanel(
      model.cartesianGraph,
      model.polarGraph,
      model.componentStyleProperty,
      model.sum1VisibleProperty,
      model.sum2VisibleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
      } );

    // Coordinate Snap radio buttons, at lower right
    const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
      this.viewProperties.coordinateSnapModeProperty,
      model.cartesianVectorColorPalette1,
      model.polarVectorColorPalette1, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom
      } );

    // Create and add the Scene Nodes and Vector Creator Panels for each graph
    const sceneNodes: Node[] = [];
    [ model.polarGraph, model.cartesianGraph ].forEach( graph => {

      const sceneNode = new SceneNode( graph, this.viewProperties, model.componentStyleProperty );

      // Add the vector creator panel
      sceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( graph, sceneNode, {
        left: coordinateSnapRadioButtonGroup.left,
        bottom: coordinateSnapRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING
      } ) );

      // Switch between scenes to match coordinate snap mode.
      // unlink is unnecessary, exists for the lifetime of the sim.
      this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        this.interruptSubtreeInput(); // cancel interactions when switching scenes
        sceneNode.visible = ( coordinateSnapMode === graph.coordinateSnapMode );
      } );

      // Add the scene node
      sceneNodes.push( sceneNode );
    } );

    const screenViewRootNode = new Node( {
      children: [
        graphControlPanel,
        coordinateSnapRadioButtonGroup,
        ...sceneNodes,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [
      ...sceneNodes
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      graphControlPanel,
      coordinateSnapRadioButtonGroup,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

vectorAddition.register( 'LabScreenView', LabScreenView );