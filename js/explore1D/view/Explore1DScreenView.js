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
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      assert && assert( explore1DModel instanceof Explore1DModel, `invalid explore1DModel: ${explore1DModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( explore1DModel, tandem );

      // @private {VectorAdditionViewProperties} viewProperties - viewProperties for the 'Explore 1D' screen
      this.viewProperties = new Explore1DViewProperties();

      // Create and add the Graph Control Panel
      const explore1DGraphControlPanel = new Explore1DGraphControlPanel(
        explore1DModel.sumVisibleProperty,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        explore1DModel.vectorColorGroup, {
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( explore1DGraphControlPanel );

      // Create and add the graph orientation radio buttons
      const graphOrientationRadioButtonGroup = new GraphOrientationRadioButtonGroup(
        this.viewProperties.graphOrientationProperty, {
          right: this.layoutBounds.maxX - VectorAdditionConstants.RADIO_BUTTONS_X_MARGIN,
          bottom: this.resetAllButton.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING
        } );
      this.addChild( graphOrientationRadioButtonGroup );

      // Create and add the Scene Nodes and Vector Creator Panels for each graph
      [ explore1DModel.verticalGraph, explore1DModel.horizontalGraph ].forEach( explore1DGraph => {

        // Create the scene node
        const sceneNode = new SceneNode(
          explore1DGraph,
          this.viewProperties.valuesVisibleProperty,
          this.viewProperties.angleVisibleProperty,
          this.viewProperties.gridVisibleProperty,
          explore1DModel.componentStyleProperty, {
            vectorValuesAccordionBoxOptions: {
              isExpandedInitially: false
            }
          } );

        // Vector symbols depend on graph orientation
        const vectorSymbols = ( explore1DGraph.orientation === GraphOrientations.HORIZONTAL ) ?
                              VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                              VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

        // Add the vector creator panel
        sceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( explore1DGraph, sceneNode, vectorSymbols, {
            left: graphOrientationRadioButtonGroup.left,
            bottom: graphOrientationRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING
          } ) );

        // Toggle visibility of the SceneNode. Should only be visible if the graph orientation matches the
        // explore1DGraph's graph orientation. Is never unlinked since the screen view is never disposed.
        this.viewProperties.graphOrientationProperty.link( graphOrientation => {
          sceneNode.visible = ( graphOrientation === explore1DGraph.orientation );
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