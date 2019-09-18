// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Explore 1D' screen.
 *
 * Extends VectorAdditionScreenView but adds:
 *  - Explore 1D Graph Control Panel
 *  - Graph Orientation Radio Button Group
 *  - Scene nodes for each graph (horizontal/vertical)
 *  - Vector Creator Panels for each graph
 *
 * ScreenViews are never disposed.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const Explore1DGraphControlPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DGraphControlPanel' );
  const Explore1DModel = require( 'VECTOR_ADDITION/explore1D/model/Explore1DModel' );
  const Explore1DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorCreatorPanel' );
  const Explore1DViewProperties = require( 'VECTOR_ADDITION/explore1D/view/Explore1DViewProperties' );
  const GraphOrientationRadioButtonGroup = require( 'VECTOR_ADDITION/explore1D/view/GraphOrientationRadioButtonGroup' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );

  class Explore1DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore1DModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      assert && assert( model instanceof Explore1DModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( model, tandem );

      // @private view-specific Properties
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
        const sceneNode = new SceneNode( graph, this.viewProperties, model.componentStyleProperty, {
          vectorValuesAccordionBoxOptions: {
            isExpandedInitially: false
          }
        } );

        // Vector symbols depend on graph orientation
        const vectorSymbols = ( graph.orientation === GraphOrientations.HORIZONTAL ) ?
                              VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                              VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

        // Add the vector creator panel
        sceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( graph, sceneNode, vectorSymbols, {
            left: graphOrientationRadioButtonGroup.left,
            bottom: graphOrientationRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING
          } ) );

        // Toggle visibility of the SceneNode. Should only be visible if the graph orientation matches the
        // graph's graph orientation. Is never unlinked since the screen view is never disposed.
        this.viewProperties.graphOrientationProperty.link( graphOrientation => {
          sceneNode.visible = ( graphOrientation === graph.orientation );
        } );

        // Add the scene node
        this.addChild( sceneNode );
      } );
    }

    /**
     * @public
     * @override
     */
    reset() {
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );