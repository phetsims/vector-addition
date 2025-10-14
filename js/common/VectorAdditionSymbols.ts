// Copyright 2024-2025, University of Colorado Boulder

/**
 * VectorAdditionSymbols is the set of strings for mathematical symbols.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../axon/js/StringProperty.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';
import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';

export default class VectorAdditionSymbols {

  private constructor() {
    // Not intended for instantiation.
  }

  // Axis labels
  public static readonly xStringProperty = MathSymbolFont.createDerivedProperty( VectorAdditionStrings.symbol.xStringProperty );
  public static readonly yStringProperty = MathSymbolFont.createDerivedProperty( VectorAdditionStrings.symbol.yStringProperty );

  // Vector symbols are not localized. See https://github.com/phetsims/vector-addition/issues/10.
  public static readonly aStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'a' ) );
  public static readonly bStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'b' ) );
  public static readonly cStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'c' ) );
  public static readonly dStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'd' ) );
  public static readonly eStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'e' ) );
  public static readonly fStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'f' ) );
  public static readonly pStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'p' ) );
  public static readonly qStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'q' ) );
  public static readonly sStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 's' ) );
  public static readonly uStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'u' ) );
  public static readonly vStringProperty = MathSymbolFont.createDerivedProperty( new StringProperty( 'v' ) );

  // Other symbols
  public static readonly THETA = MathSymbolFont.getRichTextMarkup( MathSymbols.THETA );
}

vectorAddition.register( 'VectorAdditionSymbols', VectorAdditionSymbols );