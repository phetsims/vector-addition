// Copyright 2019, University of Colorado Boulder

/**
 * ValuesCheckbox is the checkbox labeled 'Values', used to control visibility of values on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAdditionStrings from '../../vector-addition-strings.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';

const valuesString = vectorAdditionStrings.values;

class ValuesCheckbox extends VectorAdditionCheckbox {

  /**
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( valuesVisibleProperty, options ) {

    const content = new Text( valuesString, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 116 // determined empirically
    } );

    super( content, valuesVisibleProperty, options );
  }
}

vectorAddition.register( 'ValuesCheckbox', ValuesCheckbox );
export default ValuesCheckbox;