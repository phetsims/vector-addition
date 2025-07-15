// Copyright 2019-2025, University of Colorado Boulder

/**
 * Color palette used for rendering vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';

// All colors are {Color|string|null}, where {string} is a CSS color string, and null is 'no color'.
type PaletteColor = Color | string | null;

type SelfOptions = {

  // Colors for main vectors (aka parent vectors)
  mainFill: PaletteColor;
  mainStroke?: PaletteColor;

  // Colors for component vectors. They are of type DashedArrowNode, which cannot be stroked.
  // Defaults to options.mainFill
  componentFill?: PaletteColor; // null defaults to options.mainFill

  // Colors for sum vectors
  sumFill: PaletteColor;
  sumStroke?: PaletteColor;

  // Color for sum component vectors. They are of type DashedArrowNode, which cannot be stroked.
  sumComponentFill?: PaletteColor; // null defaults to options.sumFill

  // Colors for base vectors
  baseVectorFill?: PaletteColor;
  baseVectorStroke?: PaletteColor; // null defaults to options.mainFill
};

type VectorColorPaletteOptions = SelfOptions;

export default class VectorColorPalette {

  public readonly mainFill: PaletteColor;
  public readonly mainStroke: PaletteColor;
  public readonly componentFill: PaletteColor;
  public readonly sumFill: PaletteColor;
  public readonly sumStroke: PaletteColor;
  public readonly sumComponentFill: PaletteColor;
  public readonly baseVectorFill: PaletteColor;
  public readonly baseVectorStroke: PaletteColor;

  public constructor( providedOptions?: VectorColorPaletteOptions ) {

    const options = optionize<VectorColorPaletteOptions, SelfOptions>()( {

      // SelfOptions
      mainStroke: null,
      componentFill: null,
      sumStroke: null,
      sumComponentFill: null,
      baseVectorFill: Color.WHITE,
      baseVectorStroke: null
    }, providedOptions );

    this.mainFill = options.mainFill;
    this.mainStroke = options.mainStroke;
    this.componentFill = ( options.componentFill || options.mainFill );
    this.sumFill = options.sumFill;
    this.sumStroke = options.sumStroke;
    this.sumComponentFill = ( options.sumComponentFill || options.sumFill );
    this.baseVectorFill = options.baseVectorFill;
    this.baseVectorStroke = ( options.baseVectorStroke || options.mainFill );
  }
}

vectorAddition.register( 'VectorColorPalette', VectorColorPalette );