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


  class Explore2DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {

      super( explore2DModel, tandem, {
        isExpandedInitially: true
      } );

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
        explore2DModel.polarGraph.modelViewTransformProperty,
        explore2DModel.polarGraph.vectorSet );

      this.addChild( polarVectorCreatorPanel );


      const cartesianVectorCreatorPanel = new Explore2DVectorCreatorPanel(
        explore2DModel.cartesianGraph.modelViewTransformProperty,
        explore2DModel.cartesianGraph.vectorSet );

      this.addChild( cartesianVectorCreatorPanel );


      // toggle visible
      explore2DModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
          polarVectorCreatorPanel.visible = false;
          cartesianVectorCreatorPanel.visible = true;
          explore2DModel.polarGraph.sceneNode.visible = false;
          explore2DModel.cartesianGraph.sceneNode.visible = true;
        }


        if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
          polarVectorCreatorPanel.visible = true;
          cartesianVectorCreatorPanel.visible = false;
          explore2DModel.polarGraph.sceneNode.visible = true;
          explore2DModel.cartesianGraph.sceneNode.visible = false;
        }
      } );


      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        explore2DModel.coordinateSnapModeProperty );
      this.addChild( coordinateSnapRadioButtonGroup );
    }

  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );