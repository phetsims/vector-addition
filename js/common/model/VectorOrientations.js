// Copyright 2019, University of Colorado Boulder

/**
 * Possible orientations for a vector
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * A vector can be constrained to point along x-axis (HORIZONTAL), along the y-axis (VERTICAL)
   * or be unconstrained (ALL)
   * @public
   */
  const VectorOrientations = new Enumeration( [ 'HORIZONTAL', 'VERTICAL', 'ALL' ] );

  return vectorAddition.register( 'VectorOrientations', VectorOrientations );
} );
