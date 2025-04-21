// Copyright 2025, University of Colorado Boulder

/**
 * AngleConvention enumerates the conventions for display angle values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const AngleConventionValues = [
  'unsigned',  // (0,360]
  'signed' // [-180,180)
] as const;
export type AngleConvention = ( typeof AngleConventionValues )[number];