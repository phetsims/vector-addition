// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Explore1D' screen.
 *
 * Explore1D has a horizontal and a vertical graph. Scene nodes are created to represent these graphs respectively.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const Explore1DGraphControlPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DGraphControlPanel' );
  const Explore1DModel = require( 'VECTOR_ADDITION/explore1D/model/Explore1DModel' );
  const Explore1DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorCreatorPanel' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );

  // constants
  const RADIO_BUTTON_OPTIONS = VectorAdditionConstants.RADIO_BUTTON_OPTIONS;
  const HORIZONTAL_VECTOR_SYMBOLS = VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1;
  const VERTICAL_VECTOR_SYMBOLS = VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;
  const GRAPH_ORIENTATION_RADIO_BUTTON_MARGIN = 10;
  const EXPLORE_1D_SCENE_OPTIONS = {
    inspectVectorPanelOptions: {
      isExpandedInitially: false
    }
  };

  class Explore1DScreenView extends VectorAdditionScreenView {
    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      assert && assert( explore1DModel instanceof Explore1DModel, `invalid explore1DModel: ${explore1DModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      //----------------------------------------------------------------------------------------
      // Create the scenes for the horizontal and vertical scenes

      const verticalSceneNode = new SceneNode( explore1DModel.verticalGraph,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.angleVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.componentStyleProperty,
        EXPLORE_1D_SCENE_OPTIONS );

      const horizontalSceneNode = new SceneNode( explore1DModel.horizontalGraph,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.angleVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.componentStyleProperty,
        EXPLORE_1D_SCENE_OPTIONS );

      super( explore1DModel, tandem );

      this.addChild( verticalSceneNode );
      this.addChild( horizontalSceneNode );

      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      verticalSceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( explore1DModel,
        explore1DModel.verticalGraph,
        explore1DModel.verticalGraph.vectorSet,
        verticalSceneNode.vectorContainer,
        this,
        VERTICAL_VECTOR_SYMBOLS ) );

      horizontalSceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( explore1DModel,
        explore1DModel.horizontalGraph,
        explore1DModel.horizontalGraph.vectorSet,
        horizontalSceneNode.vectorContainer,
        this,
        HORIZONTAL_VECTOR_SYMBOLS ) );

      //----------------------------------------------------------------------------------------
      // Observe when the graph orientation changes and update the visibility of the scenes.
      explore1DModel.graphOrientationProperty.link( ( graphOrientation ) => {

        verticalSceneNode.visible = graphOrientation === GraphOrientations.VERTICAL;
        horizontalSceneNode.visible = graphOrientation === GraphOrientations.HORIZONTAL;
      } );

      //----------------------------------------------------------------------------------------
      // Create the Graph Control panel

      const explore1DGraphControlPanel = new Explore1DGraphControlPanel( explore1DModel.sumVisibleProperty,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.vectorGroup, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( explore1DGraphControlPanel );

      //----------------------------------------------------------------------------------------

      // Create content for the radio buttons to switch between graphs
      const graphOrientationRadioButtonContent = [ {
        value: GraphOrientations.HORIZONTAL,
        node: VectorAdditionIconFactory.createGraphOrientationIcon( GraphOrientations.HORIZONTAL )
      }, {
        value: GraphOrientations.VERTICAL,
        node: VectorAdditionIconFactory.createGraphOrientationIcon( GraphOrientations.VERTICAL )
      } ];

      // Create the radio buttons to switch between graphs
      const graphOrientationRadioButtonGroup = new RadioButtonGroup( explore1DModel.graphOrientationProperty,
        graphOrientationRadioButtonContent, _.extend( {}, RADIO_BUTTON_OPTIONS, {
          centerX: explore1DGraphControlPanel.centerX,
          top: explore1DGraphControlPanel.bottom + GRAPH_ORIENTATION_RADIO_BUTTON_MARGIN,
          orientation: 'horizontal'
        } ) );

      this.addChild( graphOrientationRadioButtonGroup );
    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );