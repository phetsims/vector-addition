// Copyright 2019-2020, University of Colorado Boulder

/**
 * Enumeration of the possible 'orientations' of a graph.
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import vectorAddition from '../../vectorAddition.js';

const GraphOrientations = Enumeration.byKeys( [

  // 1D, the graph only has an x-axis, and its vectors are strictly horizontal
  'HORIZONTAL',

  // 1D, the graph only has a y-axis, and its vectors are strictly vertical
  'VERTICAL',

  // 2D, the graph has both x & y axes, and its vectors are unconstrained
  'TWO_DIMENSIONAL'
] );

vectorAddition.register( 'GraphOrientations', GraphOrientations );
export default GraphOrientations;