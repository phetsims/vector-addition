// Copyright 2022-2025, University of Colorado Boulder

/**
 * Enumeration of the quantities related to a vector that we want to display in VectorValuesNumberDisplay.
 *
 * @author Brandon Li
 */

export const VectorQuantityValues = [ 'magnitude', 'angle', 'xComponent', 'yComponent' ] as const;

export type VectorQuantity = ( typeof VectorQuantityValues )[number];