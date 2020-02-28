// Copyright 2019-2020, University of Colorado Boulder

/**
 * Enumeration of the possible 'modes' of snapping vectors to the graph.
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import vectorAddition from '../../vectorAddition.js';

const CoordinateSnapModes = Enumeration.byKeys( [

  'CARTESIAN',  // Vector tail and tip are snapped to an exact grid coordinate (components are always integers).

  'POLAR'       // Vector tip is snapped so that the angle is a multiple of 5 and the magnitude is an integer.
                // When translating the body, the vector tail is either snapped to an exact grid coordinate or
                // the vector tail/tip is snapped to other polar vector's tails/tips.

] );

vectorAddition.register( 'CoordinateSnapModes', CoordinateSnapModes );
export default CoordinateSnapModes;