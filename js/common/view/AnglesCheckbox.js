// Copyright 2019-2023, University of Colorado Boulder

/**
 * AnglesCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import vectorAddition from '../../vectorAddition.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

export default class AnglesCheckbox extends VectorAdditionCheckbox {

  /**
   * @param {Property.<boolean>} anglesVisibleProperty
   * @param {Object} [options]
   */
  constructor( anglesVisibleProperty, options ) {

    const content = VectorAdditionIconFactory.createAngleIcon();

    super( anglesVisibleProperty, content, options );
  }
}

vectorAddition.register( 'AnglesCheckbox', AnglesCheckbox );