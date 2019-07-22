// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the possible Color Groupings of vectors.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  //----------------------------------------------------------------------------------------
  // There are four 'Color Groupings' for the sim:
  //
  // Each 'Color Grouping' determines the color for:
  //  - Vectors
  //  - Vector Sums
  //  - Component Vectors
  //  - Base Vectors
  //  - Label backgrounds
  //  - Vector creator panel icons
  //  - Sum visible icons (next to the checkbox)
  //
  // All of the views above must correspond (e.g. blue vectors must have a blue icon for the sum visible checkbox).
  // Thus, this Enumeration keeps track of the 'Color Groupings' of vectors.
  //----------------------------------------------------------------------------------------
  const VectorColorGroups = new Enumeration( [
    'ONE',    // Blue
    'TWO',    // Red
    'THREE',  // Purple
    'FOUR'    // Green
  ] );

  return vectorAddition.register( 'VectorColorGroups', VectorColorGroups );
} );