// Copyright 2019, University of Colorado Boulder

/**
 * The view for the 'Explore2D' screen.
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
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );

  // constants
  const VECTOR_CREATOR_LABELS = VectorAdditionConstants.LABEL_GROUP_1;

  class Explore2DScreenView extends VectorAdditionScreenView {
    /**
     * @constructor
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {

      assert && assert( explore2DModel instanceof Explore2DModel, `invalid explore2DModel: ${explore2DModel}` );

      //----------------------------------------------------------------------------------------
      // Create the scenes

      const polarSceneNode = new SceneNode( explore2DModel.polarGraph,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty, {
          isExpandedInitially: true
        } );
      const cartesianSceneNode = new SceneNode( explore2DModel.cartesianGraph,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty, {
          isExpandedInitially: true
        } );

      super( explore2DModel, [ polarSceneNode, cartesianSceneNode ], tandem );

      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      polarSceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( explore2DModel,
        explore2DModel.polarGraph,
        explore2DModel.polarGraph.vectorSet,
        polarSceneNode.vectorContainer,
        this,
        VECTOR_CREATOR_LABELS ) );

      cartesianSceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( explore2DModel,
        explore2DModel.cartesianGraph,
        explore2DModel.cartesianGraph.vectorSet,
        cartesianSceneNode.vectorContainer,
        this,
        VECTOR_CREATOR_LABELS ) );


      //----------------------------------------------------------------------------------------
      // Toggle visibility of scenes

      explore2DModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
          polarSceneNode.visible = false;
          cartesianSceneNode.visible = true;
        }

        if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
          polarSceneNode.visible = true;
          cartesianSceneNode.visible = false;
        }
      } );

      //----------------------------------------------------------------------------------------
      // Coordinate snapping radio buttons

      this.addChild( new CoordinateSnapRadioButtonGroup(explore2DModel.coordinateSnapModeProperty ) );

      //----------------------------------------------------------------------------------------

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