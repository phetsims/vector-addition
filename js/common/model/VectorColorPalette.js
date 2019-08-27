// Copyright 2019, University of Colorado Boulder

/**
 * Color palette used for rendering vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorColorPalette {

    constructor( options ) {

      // all colors are {Color|string}, where {string} is a CSS color string
      options = _.extend( {
        fill: 'black',
        sum: 'black',
        component: 'gray',
        labelBackground: 'white'
      }, options );

      // @public (read-only) color use to fill a non-sum or non-component vector
      this.fill = options.fill;

      // @public (read-only) color used to fill a sum vector
      this.sum = options.sum;

      // @public (read-only) color used to fill a component vector
      this.component = options.component;

      // @public (read-only) color used for the background behind the label on a non-active vector
      this.labelBackground = options.labelBackground;
    }
  }

  return vectorAddition.register( 'VectorColorPalette', VectorColorPalette );
} );