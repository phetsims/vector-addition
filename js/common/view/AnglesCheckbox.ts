// Copyright 2019-2024, University of Colorado Boulder

/**
 * AnglesCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

export default class AnglesCheckbox extends VectorAdditionCheckbox {

  public constructor( anglesVisibleProperty: Property<boolean> ) {
    super( anglesVisibleProperty, VectorAdditionIconFactory.createAngleIcon() );
  }
}

vectorAddition.register( 'AnglesCheckbox', AnglesCheckbox );