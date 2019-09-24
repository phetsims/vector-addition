// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the possible 'equation types.'
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const EquationTypes = new Enumeration( [

    // Adding two vectors to get a third. Shown as 'a + b = c' or 'd + e = f'
    'ADDITION',

    // Subtracting a vector from another to get a third. Shown as 'a - b = c' or 'd - e = f'
    'SUBTRACTION',

    // Negating the sum of two vectors to get a third.
    // Derived from '-( a + b ) = c', simplified to 'a + b + c = 0'
    // Shown as 'a + b + c = 0' or 'd + e + f = 0'
    'NEGATION'

  ] );

  return vectorAddition.register( 'EquationTypes', EquationTypes );
} );