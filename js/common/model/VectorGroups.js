// Copyright 2019, University of Colorado Boulder

/**
 * Possible types of vectors
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * There are 2 groups of vectors. A vector set can only be one group.
   * 'ONE' - currently used in all screens except for lab
   * 'TWO' - only used in the lab screen as a second set of vectors
   */
  const VectorGroups = new Enumeration( [ 'ONE', 'TWO' ] );

  return vectorAddition.register( 'VectorGroups', VectorGroups );
} );
