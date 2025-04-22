// Copyright 2019-2022, University of Colorado Boulder

/**
 * Enumeration of the possible 'orientations' of a graph.
 *
 * @author Martin Veillette
 */

export const GraphOrientationValues = [

  // 1D, the graph only has an x-axis, and its vectors are strictly horizontal
  'horizontal',

  // 1D, the graph only has a y-axis, and its vectors are strictly vertical
  'vertical',

  // 2D, the graph has both x & y axes, and its vectors are unconstrained
  'twoDimensional'
] as const;

export type GraphOrientation = ( typeof GraphOrientationValues )[number];