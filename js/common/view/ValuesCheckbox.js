// Copyright 2019-2021, University of Colorado Boulder

/**
 * ValuesCheckbox is the checkbox labeled 'Values', used to control visibility of values on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import vectorAdditionStrings from '../../vectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';

class ValuesCheckbox extends VectorAdditionCheckbox {

  /**
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( valuesVisibleProperty, options ) {

    const content = new Text( vectorAdditionStrings.values, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 116 // determined empirically
    } );

    super( valuesVisibleProperty, content, options );
  }
}

vectorAddition.register( 'ValuesCheckbox', ValuesCheckbox );
export default ValuesCheckbox;