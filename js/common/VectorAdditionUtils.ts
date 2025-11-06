// Copyright 2025, University of Colorado Boulder

/**
 * Utility functions for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../perennial-alias/js/browser-and-node/affirm.js';
import VectorAdditionConstants from './VectorAdditionConstants.js';

/**
 * Converts a signed angle to an unsigned angle, in degrees.
 * Note that 0 is mapped to 0, *not* 360.
 */
export function signedToUnsignedDegrees( signedDegrees: number ): number {
  affirm( VectorAdditionConstants.SIGNED_ANGLE_RANGE.contains( signedDegrees ), `invalid signedDegrees: ${signedDegrees}` );
  return ( signedDegrees >= 0 ) ? signedDegrees : signedDegrees + 360;
}

/**
 * Converts an unsigned angle to a signed angle, in degrees.
 * Note that 0 and 360 are both mapped to 0, so the sim will never display 360.
 */
export function unsignedToSignedDegrees( unsignedDegrees: number ): number {
  affirm( VectorAdditionConstants.UNSIGNED_ANGLE_RANGE.contains( unsignedDegrees ), `invalid unsignedDegrees: ${unsignedDegrees}` );
  return ( unsignedDegrees <= 180 ) ? unsignedDegrees : unsignedDegrees - 360;
}