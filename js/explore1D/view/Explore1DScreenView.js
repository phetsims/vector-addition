// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Explore1DGraphControlPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DGraphControlPanel' );
  const Explore1DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore1D/view/Explore1DVectorCreatorPanel' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const Explore1DModel = require( 'VECTOR_ADDITION/explore1D/model/Explore1DModel' );

  // constants
  const RADIO_BUTTON_OPTIONS = VectorAdditionConstants.RADIO_BUTTON_OPTIONS;
  
  const VECTOR_CREATOR_LABELS_HORIZONTAL = VectorAdditionConstants.VECTOR_TAGS_GROUP_1;
  const VECTOR_CREATOR_LABELS_VERTICAL = VectorAdditionConstants.VECTOR_TAGS_GROUP_2;

  class Explore1DScreenView extends VectorAdditionScreenView {
    /**
     * @constructor
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

      assert && assert( explore1DModel instanceof Explore1DModel, `invalid explore1DModel: ${explore1DModel}` );

      //----------------------------------------------------------------------------------------
      // Create the scenes

      const verticalSceneNode = new SceneNode( explore1DModel.verticalGraph,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.angleVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.componentStyleProperty );
      const horizontalSceneNode = new SceneNode( explore1DModel.horizontalGraph,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.angleVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.componentStyleProperty );


      super( explore1DModel, [ verticalSceneNode, horizontalSceneNode ], tandem );


      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      verticalSceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( explore1DModel,
        explore1DModel.verticalGraph,
        explore1DModel.verticalGraph.vectorSet,
        verticalSceneNode.vectorContainer,
        this,
        VECTOR_CREATOR_LABELS_VERTICAL ) );
      
      horizontalSceneNode.addVectorCreatorPanel( new Explore1DVectorCreatorPanel( explore1DModel,
        explore1DModel.horizontalGraph,
        explore1DModel.horizontalGraph.vectorSet,
        horizontalSceneNode.vectorContainer,
        this,
        VECTOR_CREATOR_LABELS_HORIZONTAL ) );


      //----------------------------------------------------------------------------------------
      explore1DModel.graphOrientationProperty.link( ( graphOrientation ) => {
        switch( graphOrientation ) {
          case GraphOrientations.HORIZONTAL:
            verticalSceneNode.visible = false;
            horizontalSceneNode.visible = true;
            break;
          case GraphOrientations.VERTICAL:
            verticalSceneNode.visible = true;
            horizontalSceneNode.visible = false;
            break;
          case GraphOrientations.TWO_DIMENSIONAL:
            throw new Error( `Explore1D does not support vector orientation: ${graphOrientation}` );
          default:
            throw new Error( `Vector orientation not handled: ${graphOrientation}` );
        }
      } );

      //----------------------------------------------------------------------------------------

      const explore1DGraphControlPanel = new Explore1DGraphControlPanel(
        explore1DModel.sumVisibleProperty,
        explore1DModel.valuesVisibleProperty,
        explore1DModel.gridVisibleProperty,
        explore1DModel.vectorGroup, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );


      this.addChild( explore1DGraphControlPanel );

      
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


      this.addChild( graphOrientationRadioButtonGroup );
    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );