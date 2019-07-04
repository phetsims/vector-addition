// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the equation types.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * There are three different types of equations:
   * 'ADDITION': a + b = c. Adding two vectors to get to a third.
   * 'SUBTRACTION': a - b = c. Subtracting two vectors to get a third
   * 'NEGATION': a + b = -c or a + b - c = 0; Negating the sum of the first two vectors.
   */
  const EquationTypes = new Enumeration( [ 'ADDITION', 'SUBTRACTION', 'NEGATION' ] );

  return vectorAddition.register( 'EquationTypes', EquationTypes );
} );