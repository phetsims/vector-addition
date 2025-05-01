// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DScreenView is the view for the 'Explore 2D' screen.
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
import Explore2DModel from '../model/Explore2DModel.js';
import Explore2DGraphControlPanel from './Explore2DGraphControlPanel.js';
import Explore2DVectorCreatorPanel from './Explore2DVectorCreatorPanel.js';
import Explore2DGraph from '../model/Explore2DGraph.js';
import Explore2DViewProperties from './Explore2DViewProperties.js';

export default class Explore2DScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: Explore2DViewProperties;

  public constructor( model: Explore2DModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new Explore2DViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Control for the graph, at upper right
    const graphControlPanel = new Explore2DGraphControlPanel(
      model.cartesianGraph.vectorSet,
      model.polarGraph.vectorSet,
      model.componentVectorStyleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // CoordinateSnapMode radio buttons, at lower right
    const coordinateSnapModeRadioButtonGroup = new CoordinateSnapModeRadioButtonGroup(
      this.viewProperties.coordinateSnapModeProperty,
      model.cartesianVectorColorPalette,
      model.polarVectorColorPalette, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'coordinateSnapModeRadioButtonGroup' )
      } );

    // Create and add the Scene Nodes and Vector Creator Panels for each graph
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );
    const createSceneNode = ( graph: Explore2DGraph, tandem: Tandem ): SceneNode => {

      // Create the scene node
      const sceneNode = new SceneNode( graph, this.viewProperties, model.componentVectorStyleProperty, {
        tandem: tandem
      } );

      // Vector symbols depend on whether snap mode is Cartesian or Polar
      const vectorSymbolProperties = ( graph.coordinateSnapMode === 'cartesian' ) ?
                                     VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_1 :
                                     VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_2;

      // Add the vector creator panel
      sceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel(
        graph,
        sceneNode,
        vectorSymbolProperties, {
          left: coordinateSnapModeRadioButtonGroup.left,
          bottom: coordinateSnapModeRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
          tandem: tandem.createTandem( 'vectorCreatorPanel' )
        } )
      );

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
    assert && assert( cartesianSceneNode.eraserButton );
    assert && assert( polarSceneNode.eraserButton );
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

vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );