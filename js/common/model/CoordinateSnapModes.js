// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the possible 'modes' of snapping vectors to the graph.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const CoordinateSnapModes = new Enumeration( [

    'CARTESIAN',  // Vector tail and tip are snapped to an exact grid coordinate (components are always integers).

    'POLAR'       // Vector tip is snapped so that the angle is a multiple of 5 and the magnitude is an integer.
                  // When translating the body, the vector tail is either snapped to an exact grid coordinate or
                  // the vector tail/tip is snapped to other polar vector's tails/tips.

  ] );

  return vectorAddition.register( 'CoordinateSnapModes', CoordinateSnapModes );
} );