// Copyright 2024-2025, University of Colorado Boulder

/**
 * Strings for mathematical symbols.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../axon/js/StringProperty.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';

const VectorAdditionSymbols = {

  // Axis labels
  xStringProperty: VectorAdditionStrings.symbol.xStringProperty,
  yStringProperty: VectorAdditionStrings.symbol.yStringProperty,

  // Vector symbols are currently not localized. See https://github.com/phetsims/vector-addition/issues/10.
  // If they need to be localized in the future, dynamic layout was already handled as part of
  // https://github.com/phetsims/vector-addition/issues/280. So localization should be a matter of
  // adding these symbols to vector-addition-strings_en.json, then using the LocalizedStringProperty
  // instances in VectorAdditionStrings.ts.

  // Vectors in the Explore 1D, Explore 2D, and Equations screens.
  aStringProperty: new StringProperty( 'a' ),
  bStringProperty: new StringProperty( 'b' ),
  cStringProperty: new StringProperty( 'c' ),
  dStringProperty: new StringProperty( 'd' ),
  eStringProperty: new StringProperty( 'e' ),
  fStringProperty: new StringProperty( 'f' ),

  // Vector sets in the Lab screen.
  vStringProperty: new StringProperty( 'v' ),
  uStringProperty: new StringProperty( 'u' ),
  pStringProperty: new StringProperty( 'p' ),
  qStringProperty: new StringProperty( 'q' ),

  // Sum vectors in the Explore 1D, Explore 2D, and Lab screens.
  sStringProperty: new StringProperty( 's' )
};

vectorAddition.register( 'VectorAdditionSymbols', VectorAdditionSymbols );
export default VectorAdditionSymbols;