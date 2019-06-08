// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CommonScreenView = require( 'VECTOR_ADDITION/common/view/CommonScreenView' );
  const Explore2DVectorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorPanel' );
  const GridPanel = require( 'VECTOR_ADDITION/common/view/GridPanel' );
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // images
  const mockupImage = require( 'image!VECTOR_ADDITION/explore2D_screenshot.png' );

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

      // Show the mock-up and a slider to change its transparency
      const mockupOpacityProperty = new NumberProperty( 0 );
      const image = new Image( mockupImage, { pickable: false, scale: 0.67, top: 0, left: 0 } );

      const screenshotHSlider = new HSlider( mockupOpacityProperty, new Range( 0, 1 ), { top: 0, left: 0 } );
      mockupOpacityProperty.linkAttribute( image, 'opacity' );

      this.addChild( gridPanel );
      this.addChild( image );
      this.addChild( screenshotHSlider );

      const vectorPanel = new Explore2DVectorPanel( explore2DModel.vectors, explore2DModel.modelViewTransformProperty );

      this.addChild( vectorPanel );
    }

  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );