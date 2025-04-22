// Copyright 2019-2022, University of Colorado Boulder

/**
 * Enumeration of the possible 'equation types.'
 *
 * @author Brandon Li
 */

export const EquationTypeValues = [

  // Adding two vectors to get a third. Shown as 'a + b = c' or 'd + e = f'
  'addition',

  // Subtracting a vector from another to get a third. Shown as 'a - b = c' or 'd - e = f'
  'subtraction',

  // Negating the sum of two vectors to get a third.
  // Derived from '-( a + b ) = c', simplified to 'a + b + c = 0'
  // Shown as 'a + b + c = 0' or 'd + e + f = 0'
  'negation'

] as const;

export type EquationType = ( typeof EquationTypeValues )[number];