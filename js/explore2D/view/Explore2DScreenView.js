// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // images
  const mockupImage = require( 'image!VECTOR_ADDITION/explore2D_screenshot.png' );

  class Explore2DScreenView extends ScreenView {

    /**
     * @param {Explore2DModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      super();

      // Show the mock-up and a slider to change its transparency
      const mockupOpacityProperty = new NumberProperty( 0.1 );
      const image = new Image( mockupImage, { pickable: false, scale: 0.67, top: 0, left: 0 } );

      const screenshotHSlider = new HSlider( mockupOpacityProperty, new Range( 0, 1 ), { top: 0, left: 0 } );
      mockupOpacityProperty.linkAttribute( image, 'opacity' );

      this.addChild( image );
      this.addChild( screenshotHSlider );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

  }

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );