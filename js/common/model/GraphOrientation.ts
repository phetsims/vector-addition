// Copyright 2019-2025, University of Colorado Boulder

/**
 * GraphOrientation is an enumeration of the possible graph orientations.
 *
 * @author Martin Veillette
 */

export const GraphOrientationValues = [

  // 1D, the scene only has an x-axis, and its vectors are strictly horizontal
  'horizontal',

  // 1D, the scene only has a y-axis, and its vectors are strictly vertical
  'vertical',

  // 2D, the scene has both x & y axes, and its vectors are unconstrained
  'twoDimensional'
] as const;

export type GraphOrientation = ( typeof GraphOrientationValues )[number];