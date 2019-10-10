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

    // Component vectors are not displayed at all
    'INVISIBLE',

    // Component vectors' initial points and the original vector's initial points coincide
    'PARALLELOGRAM',

    // Component vectors are displayed head to tail, such that the component vectors
    // align to create a right triangle with the original vector
    'TRIANGLE',

    // Component vectors are displayed as projections on the x and y axes
    'PROJECTION'
  ] );

  return vectorAddition.register( 'ComponentVectorStyles', ComponentVectorStyles );
} );