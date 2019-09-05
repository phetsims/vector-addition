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

        // colors used for non-sum and non-component vectors
        fill: 'black',
        stroke: null,

        // colors used for component vectors
        componentFill: 'gray',
        componentStroke: null,

        // colors used for sum vectors
        sumFill: 'white',
        sumStroke: 'black',

        // defaults to componentFill and componentStroke
        sumComponentFill: null,
        sumComponentStroke: null,

        // colors used for the background behind the label on a non-active vector
        labelBackgroundFill: 'rgb( 235, 235, 235 )',
        labelBackgroundStroke: null

      }, options );

      // @public (read-only)
      this.fill = options.fill;
      this.stroke = options.stroke;
      this.componentFill = options.componentFill;
      this.componentStroke = options.componentStroke;
      this.sumFill = options.sumFill;
      this.sumStroke = options.sumStroke;
      this.sumComponentFill = options.sumComponentFill || options.componentFill;
      this.sumComponentStroke = options.componentStroke || options.componentStroke;
      this.labelBackgroundFill = options.labelBackgroundFill;
      this.labelBackgroundStroke = options.labelBackgroundStroke;
    }
  }

  return vectorAddition.register( 'VectorColorPalette', VectorColorPalette );
} );