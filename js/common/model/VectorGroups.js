// Copyright 2019, University of Colorado Boulder

/**
 * Possible groupings of vectors/
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * There are 4 groups of vectors. A vector set can only be one group.
   */
  const VectorGroups = new Enumeration( [ 'ONE', 'TWO', 'THREE', 'FOUR' ] );

  return vectorAddition.register( 'VectorGroups', VectorGroups );
} );