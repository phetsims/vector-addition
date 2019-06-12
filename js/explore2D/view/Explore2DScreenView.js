// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const GridPanel = require( 'VECTOR_ADDITION/common/view/GridPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );


  class Explore2DScreenView extends CommonScreenView {

    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Tandem} tandem
     */
    constructor( explore2DModel, tandem ) {

      super( explore2DModel, tandem );

      const gridPanel = new GridPanel( explore2DModel.sumVisibleProperty,
        explore2DModel.valuesVisibleProperty,
        explore2DModel.angleVisibleProperty,
        explore2DModel.gridVisibleProperty,
        explore2DModel.componentStyleProperty,
        {
          is1D: false,
          right: this.layoutBounds.maxX - 4,
          top: 10
        } );

      this.addChild( gridPanel );

      const vectorCreatorPanel = new Explore2DVectorCreatorPanel( explore2DModel.graph.vectors, explore2DModel.graph.modelViewTransformProperty );

      this.addChild( vectorCreatorPanel );
    }

  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );