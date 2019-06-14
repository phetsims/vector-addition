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
   * There are 2 types of vectors
   * 'ONE' - currently used in all screen except for lab
   * 'TWO' - only used in the lab screen as a second set of vectors
   */
  const VectorTypes = new Enumeration( [ 'ONE', 'TWO' ] );

  return vectorAddition.register( 'VectorTypes', VectorTypes );
} );
