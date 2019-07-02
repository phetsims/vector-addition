// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Explore2D' screen.
 *
 * Explore2D has a polar and a cartesian graph. Scene nodes are created to represent these graphs respectively.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const Explore2DGraphControlPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DGraphControlPanel' );
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );

  // constants
  const EXPLORE_2D_VECTOR_TAGS = VectorAdditionConstants.VECTOR_TAGS_GROUP_1;

  class Explore2DScreenView extends VectorAdditionScreenView {
    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( explore2DModel, tandem ) {

      assert && assert( explore2DModel instanceof Explore2DModel, `invalid explore2DModel: ${explore2DModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      //----------------------------------------------------------------------------------------
      // Create the scenes for the polar and cartesian scenes.

      const polarSceneNode = new SceneNode( explore2DModel.polarGraph,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty );

      const cartesianSceneNode = new SceneNode( explore2DModel.cartesianGraph,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty );

      super( explore2DModel, [ polarSceneNode, cartesianSceneNode ], tandem );

      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      polarSceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( explore2DModel,
        explore2DModel.polarGraph,
        explore2DModel.polarGraph.vectorSet,
        polarSceneNode.vectorContainer,
        this,
        EXPLORE_2D_VECTOR_TAGS ) );

      cartesianSceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( explore2DModel,
        explore2DModel.cartesianGraph,
        explore2DModel.cartesianGraph.vectorSet,
        cartesianSceneNode.vectorContainer,
        this,
        EXPLORE_2D_VECTOR_TAGS ) );

      //----------------------------------------------------------------------------------------
      // Toggle visibility of scenes based on which coordinate snap mode it is

      // Doesn't need to be unlinked since the scenes and explore2D scene is never disposed.
      explore2DModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianSceneNode.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );

      //----------------------------------------------------------------------------------------
      // Create the Coordinate snapping radio buttons

      this.addChild( new CoordinateSnapRadioButtonGroup( explore2DModel.coordinateSnapModeProperty ) );

      //----------------------------------------------------------------------------------------
      // Create the Graph Control panel

      const explore2DGraphControlPanel = new Explore2DGraphControlPanel( explore2DModel,
        explore2DModel.cartesianGraph.vectorSet,
        explore2DModel.polarGraph.vectorSet, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( explore2DGraphControlPanel );
    }
  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );