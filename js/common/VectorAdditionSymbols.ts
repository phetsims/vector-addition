// Copyright 2024, University of Colorado Boulder

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
  // https://github.com/phetsims/vector-addition/issues/280.  So localization should be a simple matter of
  // adding these under "symbol" in vector-addition-strings_en.json.
  aStringProperty: new StringProperty( 'a' ),
  bStringProperty: new StringProperty( 'b' ),
  cStringProperty: new StringProperty( 'c' ),
  dStringProperty: new StringProperty( 'd' ),
  eStringProperty: new StringProperty( 'e' ),
  fStringProperty: new StringProperty( 'f' ),
  sStringProperty: new StringProperty( 's' ), // label for sum vectors
  vStringProperty: new StringProperty( 'v' ) // default label for vectors
};

vectorAddition.register( 'VectorAdditionSymbols', VectorAdditionSymbols );
export default VectorAdditionSymbols;