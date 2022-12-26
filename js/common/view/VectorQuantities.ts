// Copyright 2022, University of Colorado Boulder

/**
 * Enumeration of the quantities related to a vector that we want to display in VectorValuesNumberDisplay.
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import vectorAddition from '../../vectorAddition.js';

export default class VectorQuantities extends EnumerationValue {

  public static readonly MAGNITUDE = new VectorQuantities();
  public static readonly ANGLE = new VectorQuantities();
  public static readonly X_COMPONENT = new VectorQuantities();
  public static readonly Y_COMPONENT = new VectorQuantities();

  public static readonly enumeration = new Enumeration( VectorQuantities );
}

vectorAddition.register( 'VectorQuantities', VectorQuantities );