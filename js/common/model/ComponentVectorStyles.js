// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the possible 'styles' to display component vectors.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const ComponentVectorStyles = new Enumeration( [
    'INVISIBLE',        // Component vectors are not displayed at all

    'PARALLELOGRAM',    // Component vector's initial points and the original vector's initial points coincide

    'TRIANGLE',         // Component vectors are displayed head to tail, such that the component vectors
                        // align to create a right triangle with the original vector

    'ON_AXIS'           // Component vectors are displayed on the x and y axes
  ] );

  return vectorAddition.register( 'ComponentVectorStyles', ComponentVectorStyles );
} );