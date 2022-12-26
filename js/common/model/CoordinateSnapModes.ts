// Copyright 2019-2022, University of Colorado Boulder

/**
 * Enumeration of the possible 'modes' of snapping vectors to the graph.
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import vectorAddition from '../../vectorAddition.js';

export default class CoordinateSnapModes extends EnumerationValue {

  // Vector tail and tip are snapped to an exact grid coordinate (components are always integers).
  public static readonly CARTESIAN = new CoordinateSnapModes();

  // Vector tip is snapped so that the angle is a multiple of 5 and the magnitude is an integer.
  // When translating the body, the vector tail is either snapped to an exact grid coordinate or
  // the vector tail/tip is snapped to other polar vector's tails/tips.
  public static readonly POLAR = new CoordinateSnapModes();

  public static readonly enumeration = new Enumeration( CoordinateSnapModes );
}

vectorAddition.register( 'CoordinateSnapModes', CoordinateSnapModes );