// Copyright 2019, University of Colorado Boulder

/**
 * Possible orientations for a vector (mirrors orientation of the graph)
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * There are 3 different types orientations of a vector:
   * 'HORIZONTAL': 1D, vector is constrained horizontally along the x-axis
   * 'VERTICAL': 1D, vector is constrained vertically along the y-axis
   * 'TWO_DIMENSIONAL': 2D, unconstrained
   */
  const VectorOrientations = new Enumeration( [ 'HORIZONTAL', 'VERTICAL', 'TWO_DIMENSIONAL' ] );

  return vectorAddition.register( 'VectorOrientations', VectorOrientations );
} );
