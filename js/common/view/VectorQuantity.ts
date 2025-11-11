// Copyright 2022-2025, University of Colorado Boulder

/**
 * VectorQuantity is an enumeration of the quantities related to a vector that are displayed in
 * the 'Vector Values' accordion box via VectorQuantityDisplay.
 *
 * @author Brandon Li
 */

export const VectorQuantityValues = [ 'magnitude', 'angle', 'xComponent', 'yComponent' ] as const;

export type VectorQuantity = ( typeof VectorQuantityValues )[number];