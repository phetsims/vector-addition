// Copyright 2022, University of Colorado Boulder

/**
 * Enumeration of the quantities related to a vector that we want to display in VectorValuesNumberDisplay.
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import vectorAddition from '../../vectorAddition.js';

export default class VectorQuantity extends EnumerationValue {

  public static readonly MAGNITUDE = new VectorQuantity();
  public static readonly ANGLE = new VectorQuantity();
  public static readonly X_COMPONENT = new VectorQuantity();
  public static readonly Y_COMPONENT = new VectorQuantity();

  public static readonly enumeration = new Enumeration( VectorQuantity );
}

vectorAddition.register( 'VectorQuantity', VectorQuantity );