// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the possible 'styles' to display component vectors.
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import vectorAddition from '../../vectorAddition.js';

const ComponentVectorStyles = Enumeration.byKeys( [

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