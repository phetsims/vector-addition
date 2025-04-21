// Copyright 2025, University of Colorado Boulder

/**
 * AngleConvention enumerates the conventions for display angle values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const AngleConventionValues = [
  'signed', // [-180,180)
  'unsigned'  // (0,360]
] as const;
export type AngleConvention = ( typeof AngleConventionValues )[number];