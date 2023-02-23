// Copyright 2019-2023, University of Colorado Boulder

/**
 * Color palette used for rendering vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Color } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';

export default class VectorColorPalette {

  constructor( options ) {

    // all colors are {Color|string|null}, where {string} is a CSS color string, and null is 'no color'
    options = merge( {

      // colors used for main vectors (aka parent vectors)
      mainFill: Color.BLACK,
      mainStroke: null,

      // colors used for component vectors. They are of type DashedArrowNode, which cannot be stroked.
      componentFill: null, // defaults to options.mainFill

      // colors used for sum vectors
      sumFill: Color.BLACK,
      sumStroke: null,

      // color used for sum component vectors. They are of type DashedArrowNode, which cannot be stroked.
      sumComponentFill: null, // defaults to options.sumFill

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
    this.componentFill = ( options.componentFill || options.mainFill );
    this.sumFill = options.sumFill;
    this.sumStroke = options.sumStroke;
    this.sumComponentFill = ( options.sumComponentFill || options.sumFill );
    this.baseVectorFill = options.baseVectorFill;
    this.baseVectorStroke = ( options.baseVectorStroke || options.mainFill );
  }

  /**
   * Catches attempts to use stroke fields that do not exist for component vectors.
   * Component vectors are rendered using DashedArrowNode, which does not support stroke.
   * @public
   */
  get componentStroke() {
    assert && assert( false, 'VectorColorPalette does not have componentStroke' );
    return null;
  }

  get sumComponentStroke() {
    assert && assert( false, 'VectorColorPalette does not have sumComponentStroke' );
    return null;
  }
}

vectorAddition.register( 'VectorColorPalette', VectorColorPalette );