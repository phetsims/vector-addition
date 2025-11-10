// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentVectorStyle is an enumeration of the possible 'styles' to display component vectors.
 *
 * @author Brandon Li
 */

export const ComponentVectorStyleValues = [

  // Component vectors are not displayed at all
  'invisible',

  // Component vectors are displayed tip to tail, such that the component vectors
  // align to create a right triangle with the original vector
  'triangle',

  // Component vectors' initial points and the original vector's initial points coincide
  'parallelogram',

  // Component vectors are displayed as projections on the x and y axes
  'projection'

] as const;

export type ComponentVectorStyle = ( typeof ComponentVectorStyleValues )[number];