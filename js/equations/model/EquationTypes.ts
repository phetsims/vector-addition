// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Enumeration of the possible 'equation types.'
 *
 * @author Brandon Li
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import vectorAddition from '../../vectorAddition.js';

const EquationTypes = EnumerationDeprecated.byKeys( [

  // Adding two vectors to get a third. Shown as 'a + b = c' or 'd + e = f'
  'ADDITION',

  // Subtracting a vector from another to get a third. Shown as 'a - b = c' or 'd - e = f'
  'SUBTRACTION',

  // Negating the sum of two vectors to get a third.
  // Derived from '-( a + b ) = c', simplified to 'a + b + c = 0'
  // Shown as 'a + b + c = 0' or 'd + e + f = 0'
  'NEGATION'

] );

vectorAddition.register( 'EquationTypes', EquationTypes );
export default EquationTypes;