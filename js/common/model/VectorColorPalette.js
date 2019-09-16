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

        // colors used for component vectors. They are of type DashedArrowNode, which cannot be stroked.
        componentFill: Color.GRAY,

        // colors used for sum vectors
        sumFill: null, // defaults to options.fill
        sumStroke: Color.BLACK,

        // color used for sum component vectors
        sumComponentFill: null, // defaults to options.componentFill

        // colors used for the background behind the label on a non-active vector
        labelBackgroundFill: 'rgb( 235, 235, 235 )',
        labelBackgroundStroke: null,

        // colors used for base vectors
        baseVectorFill: Color.WHITE,
        baseVectorStroke: null // defaults to options.fill

      }, options );

      // Components cannot be stroked, so flag attempts to specify a stroke
      assert && assert( options.componentStroke === undefined, 'componentStroke is not supported' );
      assert && assert( options.sumComponentStroke === undefined, 'sumComponentStroke is not supported' );

      // @public (read-only)
      this.fill = options.fill;
      this.stroke = options.stroke;
      this.componentFill = options.componentFill;
      this.sumFill = options.sumFill || options.fill;
      this.sumStroke = options.sumStroke;
      this.sumComponentFill = options.sumComponentFill || options.componentFill;
      this.labelBackgroundFill = options.labelBackgroundFill;
      this.labelBackgroundStroke = options.labelBackgroundStroke;
      this.baseVectorFill = options.baseVectorFill;
      this.baseVectorStroke = options.baseVectorStroke || options.fill;
    }
  }

  return vectorAddition.register( 'VectorColorPalette', VectorColorPalette );
} );