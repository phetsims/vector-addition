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

        // colors used for main vectors
        mainFill: Color.BLACK,
        mainStroke: null,

        // colors used for component vectors. They are of type DashedArrowNode, which cannot be stroked.
        componentFill: null, // defaults to options.mainFill

        // colors used for sum vectors
        sumFill: Color.BLACK,
        sumStroke: null,

        // color used for sum component vectors. They are of type DashedArrowNode, which cannot be stroked.
        sumComponentFill: null, // defaults to options.sumFill

        // colors used for the background behind the label on a non-active (unselected) vector
        labelBackgroundFill: 'rgb( 235, 235, 235 )',
        labelBackgroundStroke: null,

        // colors used for base vectors
        baseVectorFill: Color.WHITE,
        baseVectorStroke: null // defaults to options.mainFill

      }, options );

      // Component vectors cannot be stroked, so flag attempts to specify a stroke.
      assert && assert( options.componentStroke === undefined, 'componentStroke is not supported' );
      assert && assert( options.sumComponentStroke === undefined, 'sumComponentStroke is not supported' );

      // @public (read-only)
      this.mainFill = options.mainFill;
      this.mainStroke = options.mainStroke;
      this.componentFill = options.componentFill || options.mainFill;
      this.sumFill = options.sumFill;
      this.sumStroke = options.sumStroke;
      this.sumComponentFill = options.sumComponentFill || options.sumFill;
      this.labelBackgroundFill = options.labelBackgroundFill;
      this.labelBackgroundStroke = options.labelBackgroundStroke;
      this.baseVectorFill = options.baseVectorFill;
      this.baseVectorStroke = options.baseVectorStroke || options.mainFill;
    }

    /**
     * Prevent attempts to use stroke fields that do not exist for component vectors.
     * Component vectors are rendered using DashedArrowNode, which does not support stroke.
     * @public
     */
    get componentStroke() { throw new Error( 'VectorColorPalette does not have componentStroke' ); }

    get sumComponentStroke() { throw new Error( 'VectorColorPalette does not have sumComponentStroke' ); }
  }

  return vectorAddition.register( 'VectorColorPalette', VectorColorPalette );
} );