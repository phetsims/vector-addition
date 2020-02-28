// Copyright 2019-2020, University of Colorado Boulder

/**
 * SumCheckbox is the checkbox labeled 'Sum', used to control visibility of a sum vector.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAdditionStrings from '../../vector-addition-strings.js';
import vectorAddition from '../../vectorAddition.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

const sumString = vectorAdditionStrings.sum;

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

    const textNode = new Text( sumString, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 75 // determined empirically
    } );

    const icon = VectorAdditionIconFactory.createVectorIcon( {
      fill: vectorColorPalette.sumFill,
      stroke: vectorColorPalette.sumStroke,
      length: 35
    } );

    const content = new LayoutBox( {
      orientation: 'horizontal',
      spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
      children: [ textNode, icon ]
    } );

    super( content, sumVisibleProperty, options );
  }
}

vectorAddition.register( 'SumCheckbox', SumCheckbox );
export default SumCheckbox;