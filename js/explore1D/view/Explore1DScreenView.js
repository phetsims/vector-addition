// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const HSlider = require( 'SUN/HSlider' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // images
  const mockupImage = require( 'image!VECTOR_ADDITION/explore1D_screenshot.png' );

  class Explore1DScreenView extends ScreenView {

    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Tandem} tandem
     */
    constructor( explore1DModel, tandem ) {

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
          explore1DModel.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

    // @public
    step( dt ) {
      //TODO Handle view animation here.
    }
  }

  return vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );
} );