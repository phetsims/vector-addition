// Copyright 2019-2025, University of Colorado Boulder

/**
 * Enumeration of the possible 'equation types.'
 *
 * @author Brandon Li
 */

export const EquationTypeValues = [

  // Adding two vectors to get a third vector, e.g. 'a + b = c'
  'addition',

  // Subtracting a vector from another vector to get a third vector, e.g. 'a - b = c'
  'subtraction',

  // Negating the sum of two vectors to get a third vector, e.g. 'a + b = -c', simplified to 'a + b + c = 0'
  'negation'

] as const;

export type EquationType = ( typeof EquationTypeValues )[number];