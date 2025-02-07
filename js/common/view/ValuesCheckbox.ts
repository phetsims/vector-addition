// Copyright 2019-2024, University of Colorado Boulder

/**
 * ValuesCheckbox is the checkbox labeled 'Values', used to control visibility of values on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';

export default class ValuesCheckbox extends VectorAdditionCheckbox {

  public constructor( valuesVisibleProperty: Property<boolean> ) {

    const content = new Text( VectorAdditionStrings.valuesStringProperty, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 116 // determined empirically
    } );

    super( valuesVisibleProperty, content );
  }
}

vectorAddition.register( 'ValuesCheckbox', ValuesCheckbox );