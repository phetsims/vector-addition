// Copyright 2025, University of Colorado Boulder

/**
 * Utility functions for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionConstants from './VectorAdditionConstants.js';

/**
 * Converts a signed angle to an unsigned angle, in degrees.
 */
export function signedToUnsignedDegrees( signedDegrees: number ): number {
  assert && assert( VectorAdditionConstants.SIGNED_ANGLE_RANGE.contains( signedDegrees ), `invalid signedDegrees: ${signedDegrees}` );
  return ( signedDegrees > 0 ) ? signedDegrees : signedDegrees + 360;
}

/**
 * Converts an unsigned angle to a signed angle, in degrees.
 */
export function unsignedToSignedDegrees( unsignedDegrees: number ): number {
  assert && assert( VectorAdditionConstants.UNSIGNED_ANGLE_RANGE.contains( unsignedDegrees ), `invalid unsignedDegrees: ${unsignedDegrees}` );
  return ( unsignedDegrees <= 180 ) ? unsignedDegrees : unsignedDegrees - 360;
}