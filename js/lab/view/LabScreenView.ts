// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScreenView is the view for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CoordinateSnapModeRadioButtonGroup from '../../common/view/CoordinateSnapModeRadioButtonGroup.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import LabModel from '../model/LabModel.js';
import LabGraphControlPanel from './LabGraphControlPanel.js';
import LabVectorCreatorPanel from './LabVectorCreatorPanel.js';
import LabGraph from '../model/LabGraph.js';
import LabViewProperties from './LabViewProperties.js';


export default class LabScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: LabViewProperties;

  public constructor( model: LabModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new LabViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Controls for the graph, at upper right
    const graphControlPanel = new LabGraphControlPanel(
      model.cartesianGraph,
      model.polarGraph,
      model.componentVectorStyleProperty,
      model.sum1VisibleProperty,
      model.sum2VisibleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // CoordinateSnapMode radio buttons, at lower right
    const coordinateSnapModeRadioButtonGroup = new CoordinateSnapModeRadioButtonGroup(
      this.viewProperties.coordinateSnapModeProperty,
      model.cartesianVectorColorPalette1,
      model.polarVectorColorPalette1, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'coordinateSnapModeRadioButtonGroup' )
      } );

    // Create and add the Scene Nodes and Vector Creator Panels for each graph
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );
    const createSceneNode = ( graph: LabGraph, tandem: Tandem ): SceneNode => {

      const sceneNode = new SceneNode( graph, this.viewProperties, model.componentVectorStyleProperty, {
        tandem: tandem
      } );

      // Add the vector creator panel
      sceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( graph, sceneNode, {
        left: coordinateSnapModeRadioButtonGroup.left,
        bottom: coordinateSnapModeRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
        tandem: tandem.createTandem( 'vectorCreatorPanel' )
      } ) );

      // Switch between scenes to match coordinate snap mode.
      // unlink is unnecessary, exists for the lifetime of the sim.
      this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        this.interruptSubtreeInput(); // cancel interactions when switching scenes
        sceneNode.visible = ( coordinateSnapMode === graph.coordinateSnapMode );
      } );

      return sceneNode;
    };
    const cartesianSceneNode = createSceneNode( model.cartesianGraph, sceneNodesTandem.createTandem( 'cartesianSceneNode' ) );
    const polarSceneNode = createSceneNode( model.polarGraph, sceneNodesTandem.createTandem( 'polarSceneNode' ) );

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
    const pdomOrderPlayArea = [
      cartesianSceneNode.vectorCreatorPanel,
      cartesianSceneNode.graphNode,
      cartesianSceneNode.vectorValuesAccordionBox,
      polarSceneNode.vectorCreatorPanel,
      polarSceneNode.graphNode,
      polarSceneNode.vectorValuesAccordionBox
    ];
    if ( cartesianSceneNode.eraserButton ) {
      const index = pdomOrderPlayArea.indexOf( cartesianSceneNode.graphNode );
      pdomOrderPlayArea.splice( index + 1, 0, cartesianSceneNode.eraserButton );
    }
    if ( polarSceneNode.eraserButton ) {
      const index = pdomOrderPlayArea.indexOf( polarSceneNode.graphNode );
      pdomOrderPlayArea.splice( index + 1, 0, polarSceneNode.eraserButton );
    }
    this.pdomPlayAreaNode.pdomOrder = pdomOrderPlayArea;

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