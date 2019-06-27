// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Explore1DGraphControlPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DGraphControlPanel' );
  const Explore1DVectorCreatorPanels = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorCreatorPanels' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // constants
  const RADIO_BUTTON_OPTIONS = VectorAdditionConstants.RADIO_BUTTON_OPTIONS;

  class Explore1DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      super( explore1DModel, tandem );

      // convenience variables for the scenes and the scene nodes
      const horizontalGraph = explore1DModel.horizontalGraph;
      const verticalGraph = explore1DModel.verticalGraph;

      const horizontalSceneNode = horizontalGraph.sceneNode;
      const verticalSceneNode = verticalGraph.sceneNode;

      // create the creator panel for each scene
      const explore1DVectorCreatorPanels = new Explore1DVectorCreatorPanels(
        horizontalGraph.vectorSet,
        horizontalGraph.modelViewTransformProperty,
        verticalGraph.vectorSet,
        verticalGraph.modelViewTransformProperty );

      // create the vector panels
      const horizontalVectorCreatorPanel = explore1DVectorCreatorPanels.horizontalVectorCreatorPanel;
      const verticalVectorCreatorPanel = explore1DVectorCreatorPanels.verticalVectorCreatorPanel;

      explore1DModel.graphOrientationProperty.link( ( graphOrientation ) => {
        switch( graphOrientation ) {
          case GraphOrientations.HORIZONTAL:
            verticalSceneNode.visible = false;
            verticalVectorCreatorPanel.visible = false;
            horizontalSceneNode.visible = true;
            horizontalVectorCreatorPanel.visible = true;
            break;
          case GraphOrientations.VERTICAL:
            verticalSceneNode.visible = true;
            verticalVectorCreatorPanel.visible = true;
            horizontalVectorCreatorPanel.visible = false;
            horizontalSceneNode.visible = false;
            break;
          case GraphOrientations.TWO_DIMENSIONAL:
            throw new Error( `Explore1D does not support vector orientation: ${graphOrientation}` );
          default:
            throw new Error( `Vector orientation not handled: ${graphOrientation}` );
        }
      } );

      const explore1DGraphControlPanel = new Explore1DGraphControlPanel(
        explore1DModel.sumVisibleProperty,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.vectorGroup, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // create content for graphOrientation radio buttons
      const graphOrientationRadioButtonContent = [ {
        value: GraphOrientations.HORIZONTAL,
        node: VectorAdditionIconFactory.createGraphOrientationIcon(GraphOrientations.HORIZONTAL )
      }, {
        value: GraphOrientations.VERTICAL,
        node: VectorAdditionIconFactory.createGraphOrientationIcon(GraphOrientations.VERTICAL )
      } ];

      // create the graph orientation radio buttons
      const graphOrientationRadioButtonGroup = new RadioButtonGroup( explore1DModel.graphOrientationProperty,
        graphOrientationRadioButtonContent, _.extend( RADIO_BUTTON_OPTIONS, {
          centerX: explore1DGraphControlPanel.centerX,
          top: explore1DGraphControlPanel.bottom + 10,
          orientation: 'horizontal'
        } ) );

      this.addChild( horizontalVectorCreatorPanel );
      this.addChild( verticalVectorCreatorPanel );
      this.addChild( explore1DGraphControlPanel );
      this.addChild( graphOrientationRadioButtonGroup );

    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );