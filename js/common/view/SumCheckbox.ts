// Copyright 2019-2023, University of Colorado Boulder

/**
 * SumCheckbox is the checkbox labeled 'Sum', used to control visibility of a sum vector.
 *
 * @author Brandon Li
 */

import { HBox, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Property from '../../../../axon/js/Property.js';

export default class SumCheckbox extends VectorAdditionCheckbox {

  public constructor( sumVisibleProperty: Property<boolean>, vectorColorPalette: VectorColorPalette ) {

    const textNode = new Text( VectorAdditionStrings.sumStringProperty, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 75 // determined empirically
    } );

    const icon = VectorAdditionIconFactory.createVectorIcon( 35, {
      fill: vectorColorPalette.sumFill,
      stroke: vectorColorPalette.sumStroke
    } );

    const content = new HBox( {
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ textNode, icon ]
    } );

    super( sumVisibleProperty, content );
  }
}

vectorAddition.register( 'SumCheckbox', SumCheckbox );