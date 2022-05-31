// Copyright 2019-2021, University of Colorado Boulder

/**
 * SumCheckbox is the checkbox labeled 'Sum', used to control visibility of a sum vector.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import vectorAdditionStrings from '../../vectorAdditionStrings.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

class SumCheckbox extends VectorAdditionCheckbox {

  /**
   * @param {BooleanProperty} sumVisibleProperty
   * @param {VectorColorPalette} vectorColorPalette
   * @param {Object} [options]
   */
  constructor( sumVisibleProperty, vectorColorPalette, options ) {

    // Type check arguments
    assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
    assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

    const textNode = new Text( vectorAdditionStrings.sum, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 75 // determined empirically
    } );

    const icon = VectorAdditionIconFactory.createVectorIcon( {
      fill: vectorColorPalette.sumFill,
      stroke: vectorColorPalette.sumStroke,
      length: 35
    } );

    const content = new HBox( {
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ textNode, icon ]
    } );

    super( content, sumVisibleProperty, options );
  }
}

vectorAddition.register( 'SumCheckbox', SumCheckbox );
export default SumCheckbox;