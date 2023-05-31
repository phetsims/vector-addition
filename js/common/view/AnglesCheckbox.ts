// Copyright 2019-2023, University of Colorado Boulder

/**
 * AnglesCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vectorAddition from '../../vectorAddition.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Property from '../../../../axon/js/Property.js';

export default class AnglesCheckbox extends VectorAdditionCheckbox {

  public constructor( anglesVisibleProperty: Property<boolean> ) {
    super( anglesVisibleProperty, VectorAdditionIconFactory.createAngleIcon() );
  }
}

vectorAddition.register( 'AnglesCheckbox', AnglesCheckbox );