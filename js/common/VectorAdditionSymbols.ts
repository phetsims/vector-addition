// Copyright 2024-2025, University of Colorado Boulder

/**
 * VectorAdditionSymbols is the set of strings for mathematical symbols.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../axon/js/StringProperty.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';

export default class VectorAdditionSymbols {

  private constructor() {
    // Not intended for instantiation.
  }

  // Axis labels
  public static readonly xStringProperty = VectorAdditionStrings.symbol.xStringProperty;
  public static readonly yStringProperty = VectorAdditionStrings.symbol.yStringProperty;

  // Vector symbols are currently not localized. See https://github.com/phetsims/vector-addition/issues/10.
  // If they need to be localized in the future, dynamic layout was already handled as part of
  // https://github.com/phetsims/vector-addition/issues/280. So localization should be a matter of:
  // add these symbols to vector-addition-strings_en.json, run 'grunt modulify', then use the
  // LocalizedStringProperty instances from VectorAdditionStrings.

  // Vectors in the Explore 1D, Explore 2D, and Equations screens.
  public static readonly aStringProperty = new StringProperty( 'a' );
  public static readonly bStringProperty = new StringProperty( 'b' );
  public static readonly cStringProperty = new StringProperty( 'c' );
  public static readonly dStringProperty = new StringProperty( 'd' );
  public static readonly eStringProperty = new StringProperty( 'e' );
  public static readonly fStringProperty = new StringProperty( 'f' );

  // Vector sets in the Lab screen.
  public static readonly vStringProperty = new StringProperty( 'v' );
  public static readonly uStringProperty = new StringProperty( 'u' );
  public static readonly pStringProperty = new StringProperty( 'p' );
  public static readonly qStringProperty = new StringProperty( 'q' );

  // Sum vectors in the Explore 1D, Explore 2D, and Lab screens.
  public static readonly sStringProperty = new StringProperty( 's' );
}

vectorAddition.register( 'VectorAdditionSymbols', VectorAdditionSymbols );