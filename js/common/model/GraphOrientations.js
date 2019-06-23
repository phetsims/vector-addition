// Copyright 2019, University of Colorado Boulder

/**
 * Possible orientations for a Graph.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * There are 3 different types of graphs:
   * 'HORIZONTAL': 1D, the graph only has only has a x-axis and its vectors are strictly horizontal
   * 'VERTICAL': 1D, the graph only has only has a y-axis and its vectors are strictly vertical
   * 'TWO_DIMENSIONAL': 2D, the graph has both axes and its vectors are unconstrained
   */
  const GraphOrientations = new Enumeration( [ 'HORIZONTAL', 'VERTICAL', 'TWO_DIMENSIONAL' ] );

  return vectorAddition.register( 'GraphOrientations', GraphOrientations );
} );
