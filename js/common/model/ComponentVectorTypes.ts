// Copyright 2022, University of Colorado Boulder

/**
 * Enumeration of the possible types of component vectors.
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import vectorAddition from '../../vectorAddition.js';

export default class ComponentVectorTypes extends EnumerationValue {

  public static readonly X_COMPONENT = new ComponentVectorTypes();
  public static readonly Y_COMPONENT = new ComponentVectorTypes();

  public static readonly enumeration = new Enumeration( ComponentVectorTypes );
}

vectorAddition.register( 'ComponentVectorTypes', ComponentVectorTypes );