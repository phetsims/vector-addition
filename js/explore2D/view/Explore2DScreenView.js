// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const Explore2DGraphControlPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DGraphControlPanel' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );

  class Explore2DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {
      
      const polarSceneNode = new SceneNode( explore2DModel.polarGraph,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.valuesVisibleProperty, {
          isExpandedInitially: true
        } );
      const cartesianSceneNode = new SceneNode( explore2DModel.cartesianGraph,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.valuesVisibleProperty, {
          isExpandedInitially: true
        } );

      super( explore2DModel, [ polarSceneNode, cartesianSceneNode ], tandem );

      const graphControlPanel = new Explore2DGraphControlPanel(
        explore2DModel.sumVisibleProperty,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty,
        explore2DModel.vectorGroup, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( graphControlPanel );

      const polarVectorCreatorPanel = new Explore2DVectorCreatorPanel(
        explore2DModel,
        explore2DModel.polarGraph,
        explore2DModel.polarGraph.vectorSet,
        polarSceneNode.vectorContainer );

      this.addChild( polarVectorCreatorPanel );
      polarVectorCreatorPanel.moveToBack();

      const cartesianVectorCreatorPanel = new Explore2DVectorCreatorPanel(
        explore2DModel,
        explore2DModel.cartesianGraph,
        explore2DModel.cartesianGraph.vectorSet,
        cartesianSceneNode.vectorContainer );

      this.addChild( cartesianVectorCreatorPanel );
      cartesianVectorCreatorPanel.moveToBack();

      // toggle visible
      explore2DModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
          polarVectorCreatorPanel.visible = false;
          cartesianVectorCreatorPanel.visible = true;
          polarSceneNode.visible = false;
          cartesianSceneNode.visible = true;
        }

        if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
          polarVectorCreatorPanel.visible = true;
          cartesianVectorCreatorPanel.visible = false;
          polarSceneNode.visible = true;
          cartesianSceneNode.visible = false;
        }
      } );

      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        explore2DModel.coordinateSnapModeProperty );
      this.addChild( coordinateSnapRadioButtonGroup );
    }
  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );