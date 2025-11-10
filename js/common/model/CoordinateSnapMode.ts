// Copyright 2019-2025, University of Colorado Boulder

/**
 * CoordinateSnapMode is an enumeration of the possible 'modes' of snapping vectors to the graph.
 *
 * @author Brandon Li
 */

export const CoordinateSnapModeValues = [

  // Vector tail and tip are snapped to an exact grid coordinate (components are always integers).
  'cartesian',

  // Vector tip is snapped so that angle is a multiple of VectorAdditionConstants.POLAR_ANGLE_INTERVAL,
  // and magnitude is an integer. When translating the body, the vector tail is either snapped to an exact
  // grid coordinate or the vector tail/tip is snapped to other polar vectors' tails/tips.
  'polar'
] as const;

export type CoordinateSnapMode = ( typeof CoordinateSnapModeValues )[number];