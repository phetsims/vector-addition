// Copyright 2019, University of Colorado Boulder

/**
 * Color palette used for rendering vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorColorPalette {

    constructor( options ) {

      // all colors are {Color|string|null}, where {string} is a CSS color string, and null is 'no color'
      options = _.extend( {

        // colors used for non-sum and non-component vectors
        fill: Color.BLACK,
        stroke: null,

        // colors used for component vectors
        componentFill: Color.GRAY,
        componentStroke: null,

        // colors used for sum vectors
        sumFill: null, // defaults to options.fill
        sumStroke: Color.BLACK,

        // defaults to componentFill and componentStroke
        sumComponentFill: null, // defaults to options.componentFill
        sumComponentStroke: null,

        // colors used for the background behind the label on a non-active vector
        labelBackgroundFill: 'rgb( 235, 235, 235 )',
        labelBackgroundStroke: null,

        // colors used for base vectors
        baseVectorFill: Color.WHITE,
        baseVectorStroke: null // defaults to options.fill

      }, options );

      // @public (read-only)
      this.fill = options.fill;
      this.stroke = options.stroke;
      this.componentFill = options.componentFill;
      this.componentStroke = options.componentStroke;
      this.sumFill = options.sumFill || options.fill;
      this.sumStroke = options.sumStroke;
      this.sumComponentFill = options.sumComponentFill || options.componentFill;
      this.sumComponentStroke = options.sumComponentStroke;
      this.labelBackgroundFill = options.labelBackgroundFill;
      this.labelBackgroundStroke = options.labelBackgroundStroke;
      this.baseVectorFill = options.baseVectorFill;
      this.baseVectorStroke = options.baseVectorStroke || options.fill;
    }
  }

  return vectorAddition.register( 'VectorColorPalette', VectorColorPalette );
} );