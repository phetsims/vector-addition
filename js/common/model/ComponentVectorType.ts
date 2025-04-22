// Copyright 2022, University of Colorado Boulder

/**
 * Enumeration of the possible types of component vectors.
 *
 * @author Brandon Li
 */

export const ComponentVectorTypeValues = [ 'xComponent', 'yComponent' ] as const;

export type ComponentVectorType = ( typeof ComponentVectorTypeValues )[number];