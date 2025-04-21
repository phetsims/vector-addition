// Copyright 2019-2022, University of Colorado Boulder

/**
 * Enumeration of the possible 'equation types.'
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import vectorAddition from '../../vectorAddition.js';

export default class EquationType extends EnumerationValue {

  // Adding two vectors to get a third. Shown as 'a + b = c' or 'd + e = f'
  public static readonly ADDITION = new EquationType();

  // Subtracting a vector from another to get a third. Shown as 'a - b = c' or 'd - e = f'
  public static readonly SUBTRACTION = new EquationType();

  // Negating the sum of two vectors to get a third.
  // Derived from '-( a + b ) = c', simplified to 'a + b + c = 0'
  // Shown as 'a + b + c = 0' or 'd + e + f = 0'
  public static readonly NEGATION = new EquationType();

  public static readonly enumeration = new Enumeration( EquationType );
}

vectorAddition.register( 'EquationType', EquationType );