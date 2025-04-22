// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DScreenView is the view for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DModel from '../model/Explore1DModel.js';
import Explore1DGraphControlPanel from './Explore1DGraphControlPanel.js';
import Explore1DVectorCreatorPanel from './Explore1DVectorCreatorPanel.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';
import GraphOrientationRadioButtonGroup from './GraphOrientationRadioButtonGroup.js';
import Explore1DGraph from '../model/Explore1DGraph.js';

export default class Explore1DScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: Explore1DViewProperties;

  public constructor( model: Explore1DModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new Explore1DViewProperties( tandem.createTandem( 'viewProperties' ) );

    const graphViewBounds = model.verticalGraph.graphViewBounds;

    // Controls for the graph, at upper right
    const graphControlPanel = new Explore1DGraphControlPanel(
      model.horizontalGraph.vectorSet,
      model.verticalGraph.vectorSet,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: graphViewBounds.top,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // Graph Orientation radio buttons, at lower right
    const graphOrientationRadioButtonGroup = new GraphOrientationRadioButtonGroup(
      this.viewProperties.graphOrientationProperty, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'graphOrientationRadioButtonGroup' )
      } );

    // Create and add the Scene Nodes and Vector Creator Panels for each graph
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );
    const sceneNodes: Node[] = [];
    const addSceneNode = ( graph: Explore1DGraph, tandem: Tandem ) => {

      // Create the scene node
      const sceneNode = new SceneNode( graph, this.viewProperties, model.componentVectorStyleProperty, {
        tandem: tandem
      } );

      // Vector symbols depend on graph orientation
      const vectorSymbolProperties = ( graph.orientation === 'horizontal' ) ?
                                     VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_1 :
                                     VectorAdditionConstants.VECTOR_SYMBOL_PROPERTIES_GROUP_2;

      // Add the vector creator panel
      sceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( graph, sceneNode, vectorSymbolProperties, {
        left: graphOrientationRadioButtonGroup.left,
        bottom: graphOrientationRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING
        //TODO https://github.com/phetsims/vector-addition/issues/258 tandem
      } ) );

      // Switch between scenes to match graph orientation.
      // unlink is unnecessary, exists for the lifetime of the sim.
      this.viewProperties.graphOrientationProperty.link( graphOrientation => {
        this.interruptSubtreeInput(); // cancel interactions when switching scenes
        sceneNode.visible = ( graphOrientation === graph.orientation );
      } );

      // Add the scene node
      sceneNodes.push( sceneNode );
    };
    addSceneNode( model.verticalGraph, sceneNodesTandem.createTandem( 'verticalSceneNode' ) );
    addSceneNode( model.horizontalGraph, sceneNodesTandem.createTandem( 'horizonalSceneNode' ) );

    const screenViewRootNode = new Node( {
      children: [
        graphControlPanel,
        graphOrientationRadioButtonGroup,
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
      graphOrientationRadioButtonGroup,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );