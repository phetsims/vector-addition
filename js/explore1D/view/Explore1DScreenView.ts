// Copyright 2019-2023, University of Colorado Boulder

/**
 * Explore1DScreenView is the view for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DModel from '../model/Explore1DModel.js';
import Explore1DGraphControlPanel from './Explore1DGraphControlPanel.js';
import Explore1DVectorCreatorPanel from './Explore1DVectorCreatorPanel.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';
import GraphOrientationRadioButtonGroup from './GraphOrientationRadioButtonGroup.js';

export default class Explore1DScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: Explore1DViewProperties;

  public constructor( model: Explore1DModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new Explore1DViewProperties();

    const graphViewBounds = model.verticalGraph.graphViewBounds;

    // Controls for the graph, at upper right
    const graphControlPanel = new Explore1DGraphControlPanel(
      model.horizontalGraph.vectorSet,
      model.verticalGraph.vectorSet,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: graphViewBounds.top
      } );
    this.addChild( graphControlPanel );

    // Graph Orientation radio buttons, at lower right
    const graphOrientationRadioButtonGroup = new GraphOrientationRadioButtonGroup(
      this.viewProperties.graphOrientationProperty, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom
      } );
    this.addChild( graphOrientationRadioButtonGroup );

    // Create and add the Scene Nodes and Vector Creator Panels for each graph
    [ model.verticalGraph, model.horizontalGraph ].forEach( graph => {

      // Create the scene node
      const sceneNode = new SceneNode( graph, this.viewProperties, model.componentStyleProperty );

      // Vector symbols depend on graph orientation
      const vectorSymbols = ( graph.orientation === GraphOrientations.HORIZONTAL ) ?
                            VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                            VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

      // Add the vector creator panel
      sceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( graph, sceneNode, vectorSymbols, {
        left: graphOrientationRadioButtonGroup.left,
        bottom: graphOrientationRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING
      } ) );

      // Switch between scenes to match graph orientation.
      // unlink is unnecessary, exists for the lifetime of the sim.
      this.viewProperties.graphOrientationProperty.link( graphOrientation => {
        this.interruptSubtreeInput(); // cancel interactions when switching scenes
        sceneNode.visible = ( graphOrientation === graph.orientation );
      } );

      // Add the scene node
      this.addChild( sceneNode );
    } );
  }

  public override reset(): void {
    super.reset();
    this.viewProperties.reset();
  }
}

vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );