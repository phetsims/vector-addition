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

    'ADDITION',     // Adding two vectors to get a third.
                    // Shown as 'A + B = C' || 'D + E = F' on the Equation Types Radio Buttons

    'SUBTRACTION',  // Subtracting a vector from another to get a third.
                    // Shown as 'A - B = C' || 'D - E = F' on the Equation Types Radio Buttons


    'NEGATION'      // Negating the sum of two vectors to get a third.
                    // Derived from '-( A + B ) = C'. Simplified to 'A + B + C = 0'
                    //
                    // Shown as 'A + B + C = 0' || 'D + E + F = 0' on the Equation Types Radio Buttons

  ] );

  return vectorAddition.register( 'EquationTypes', EquationTypes );
} );