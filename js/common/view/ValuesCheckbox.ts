// Copyright 2019-2023, University of Colorado Boulder

/**
 * ValuesCheckbox is the checkbox labeled 'Values', used to control visibility of values on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import Property from '../../../../axon/js/Property.js';

export default class ValuesCheckbox extends VectorAdditionCheckbox {

  public constructor( valuesVisibleProperty: Property<boolean> ) {

    const content = new Text( VectorAdditionStrings.values, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 116 // determined empirically
    } );

    super( valuesVisibleProperty, content );
  }
}

vectorAddition.register( 'ValuesCheckbox', ValuesCheckbox );