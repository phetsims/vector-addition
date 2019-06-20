// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const Explore2DGraphControlPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DGraphControlPanel' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  class Explore2DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {

      super( explore2DModel, tandem );

      const graphControlPanel = new Explore2DGraphControlPanel(
        explore2DModel.sumVisibleProperty,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty,
        explore2DModel.vectorType, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( graphControlPanel );

      const vectorCreatorPanel = new Explore2DVectorCreatorPanel(
        explore2DModel.scene.graph.modelViewTransformProperty,
        explore2DModel.scene.vectorSet );

      this.addChild( vectorCreatorPanel );
    }

  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );