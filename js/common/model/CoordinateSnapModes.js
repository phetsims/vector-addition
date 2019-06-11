// Copyright 2019, University of Colorado Boulder

/**
 * Possible modes of snapping vectors to the graph.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * Vectors can be snapped in 2 ways:
   * 'CARTESIAN' - the tail and the tip on the grid and components are integers
   * 'POLAR' - the angle is a multiple of 5 and the magnitude must be an integer
   */
  const CoordinateSnapModes = new Enumeration( [ 'CARTESIAN', 'POLAR' ] );

  return vectorAddition.register( 'CoordinateSnapModes', CoordinateSnapModes );
} );
