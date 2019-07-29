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
  //
  // The values of the Enumeration were named by consensus, see https://github.com/phetsims/vector-addition/issues/75
  //----------------------------------------------------------------------------------------
  const VectorColorGroups = new Enumeration( [
    'COLOR_GROUP_1',    // blue
    'COLOR_GROUP_2',    // red
    'COLOR_GROUP_3',    // purple
    'COLOR_GROUP_4'     // green
  ] );

  return vectorAddition.register( 'VectorColorGroups', VectorColorGroups );
} );