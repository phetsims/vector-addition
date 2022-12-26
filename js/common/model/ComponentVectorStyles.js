// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Enumeration of the possible 'styles' to display component vectors.
 *
 * @author Brandon Li
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import vectorAddition from '../../vectorAddition.js';

const ComponentVectorStyles = EnumerationDeprecated.byKeys( [

  // Component vectors are not displayed at all
  'INVISIBLE',

  // Component vectors are displayed tip to tail, such that the component vectors
  // align to create a right triangle with the original vector
  'TRIANGLE',

  // Component vectors' initial points and the original vector's initial points coincide
  'PARALLELOGRAM',

  // Component vectors are displayed as projections on the x and y axes
  'PROJECTION'
] );

vectorAddition.register( 'ComponentVectorStyles', ComponentVectorStyles );
export default ComponentVectorStyles;