// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Explore 2D' screen.
 *
 * Extends VectorAdditionScreenView but adds:
 *  - Coordinate Snap Radio Button Group
 *  - Explore 2D Graph Control Panel
 *  - Scene nodes for each graph
 *  - Vector Creator Panels for each graph
 *
 * Screen Views are never disposed.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const Explore2DGraphControlPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DGraphControlPanel' );
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  // constants

  // Shared symbol array for both graphs in Explore 2D ('a', 'b', 'c')
  const EXPLORE_2D_VECTOR_SYMBOLS = VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1;


  class Explore2DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {

      assert && assert( explore2DModel instanceof Explore2DModel, `invalid explore2DModel: ${explore2DModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( explore2DModel, tandem );

      // @private {VectorAdditionViewProperties} viewProperties - viewProperties for the 'Explore 2D' screen
      this.viewProperties = new VectorAdditionViewProperties();

      //========================================================================================
      // Add the children of the screen view
      //========================================================================================

      // Create and add the coordinate snap mode radio buttons
      this.addChild( new CoordinateSnapRadioButtonGroup( this.viewProperties.coordinateSnapModeProperty ) );

      // Create and add the Graph Control Panel
      this.addChild( new Explore2DGraphControlPanel( this.viewProperties,
        explore2DModel.cartesianGraph.vectorSet,
        explore2DModel.polarGraph.vectorSet,
        explore2DModel.componentStyleProperty ) );

      //----------------------------------------------------------------------------------------
      // Create and add the Scene Nodes and Vector Creator Panels for each graph
      [ explore2DModel.polarGraph, explore2DModel.cartesianGraph ].forEach( explore2DGraph => {

        // Create the scene node
        const sceneNode = new SceneNode( explore2DGraph,
          this.viewProperties.valuesVisibleProperty,
          this.viewProperties.angleVisibleProperty,
          this.viewProperties.gridVisibleProperty,
          explore2DModel.componentStyleProperty );

        // Add the vector creator panel
        sceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel( explore2DGraph,
          sceneNode,
          EXPLORE_2D_VECTOR_SYMBOLS ) );

        // Toggle visibility of the SceneNode. Should only be visible if the coordinateSnapMode matches the
        // explore2DGraph's coordinateSnapMode. Is never unlinked since the screen view is never disposed.
        this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
          sceneNode.visible = coordinateSnapMode === explore2DGraph.coordinateSnapMode;
        } );

        // Add the scene node
        this.addChild( sceneNode );

      } );
    }

    /**
     * Resets the VectorAdditionScreenView
     * @public
     *
     * @override
     */
    reset() {
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );