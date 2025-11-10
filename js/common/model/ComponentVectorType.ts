// Copyright 2022-2025, University of Colorado Boulder

/**
 * ComponentVectorType is an enumeration of possible component vector types.
 *
 * @author Brandon Li
 */

export const ComponentVectorTypeValues = [ 'xComponent', 'yComponent' ] as const;

export type ComponentVectorType = ( typeof ComponentVectorTypeValues )[number];