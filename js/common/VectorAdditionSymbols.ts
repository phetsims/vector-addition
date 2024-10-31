// Copyright 2024, University of Colorado Boulder

import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';
import StringProperty from '../../../axon/js/StringProperty.js';

/**
 * Strings for mathematical symbols.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const VectorAdditionSymbols = {

  // Axis labels
  xStringProperty: VectorAdditionStrings.symbol.xStringProperty,
  yStringProperty: VectorAdditionStrings.symbol.yStringProperty,

  // Vector symbols are not translatable. See https://github.com/phetsims/vector-addition/issues/10.
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