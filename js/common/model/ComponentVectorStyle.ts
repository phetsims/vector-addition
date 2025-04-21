// Copyright 2019-2022, University of Colorado Boulder

/**
 * Enumeration of the possible 'styles' to display component vectors.
 *
 * @author Brandon Li
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import vectorAddition from '../../vectorAddition.js';

export default class ComponentVectorStyle extends EnumerationValue {

  // Component vectors are not displayed at all
  public static readonly INVISIBLE = new ComponentVectorStyle();

  // Component vectors are displayed tip to tail, such that the component vectors
  // align to create a right triangle with the original vector
  public static readonly TRIANGLE = new ComponentVectorStyle();

  // Component vectors' initial points and the original vector's initial points coincide
  public static readonly PARALLELOGRAM = new ComponentVectorStyle();

  // Component vectors are displayed as projections on the x and y axes
  public static readonly PROJECTION = new ComponentVectorStyle();

  public static readonly enumeration = new Enumeration( ComponentVectorStyle );
}

vectorAddition.register( 'ComponentVectorStyle', ComponentVectorStyle );