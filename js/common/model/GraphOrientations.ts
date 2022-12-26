// Copyright 2019-2022, University of Colorado Boulder

/**
 * Enumeration of the possible 'orientations' of a graph.
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import vectorAddition from '../../vectorAddition.js';

export default class GraphOrientations extends EnumerationValue {

  // 1D, the graph only has an x-axis, and its vectors are strictly horizontal
  public static readonly HORIZONTAL = new GraphOrientations();

  // 1D, the graph only has a y-axis, and its vectors are strictly vertical
  public static readonly VERTICAL = new GraphOrientations();

  // 2D, the graph has both x & y axes, and its vectors are unconstrained
  public static readonly TWO_DIMENSIONAL = new GraphOrientations();

  public static readonly enumeration = new Enumeration( GraphOrientations );
}

vectorAddition.register( 'GraphOrientations', GraphOrientations );