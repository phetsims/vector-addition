// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the possible 'orientations' of a graph.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const GraphOrientations = new Enumeration( [

    // 1D, the graph only has an x-axis, and its vectors are strictly horizontal
    'HORIZONTAL',

    // 1D, the graph only has a y-axis, and its vectors are strictly vertical
    'VERTICAL',

    // 2D, the graph has both x & y axes, and its vectors are unconstrained
    'TWO_DIMENSIONAL'
  ] );

  return vectorAddition.register( 'GraphOrientations', GraphOrientations );
} );