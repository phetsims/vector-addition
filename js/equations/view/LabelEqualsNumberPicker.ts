// Copyright 2025, University of Colorado Boulder

/**
 * LabelEqualsNumberPicker is a label (Node), equals sign (Text), and a NumberPicker, with horizontal layout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import NumberPicker, { NumberPickerOptions } from '../../../../sun/js/NumberPicker.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';

export class LabelEqualsNumberPicker extends HBox {

  public readonly numberPicker: NumberPicker;

  public constructor( numberProperty: Property<number>,
                      numberRange: Range,
                      labelNode: Node,
                      numberPickerOptions: WithRequired<NumberPickerOptions, 'tandem'> ) {

    const equalsSign = new Text( MathSymbols.EQUAL_TO, {
      font: VectorAdditionConstants.EQUATION_FONT
    } );

    // Empirically set the vertical position of the NumberPicker, and wrap it in a Node to work with HBox.
    // See https://github.com/phetsims/vector-addition/issues/209
    const numberPicker = new NumberPicker( numberProperty, new Property( numberRange ),
      combineOptions<NumberPickerOptions>( {}, VectorAdditionConstants.NUMBER_PICKER_OPTIONS, {
        touchAreaXDilation: 20,
        touchAreaYDilation: 10,

        // Hide arrows when picker is disabled.
        disabledOpacity: 1,
        backgroundStrokeDisabledOpacity: 1,
        arrowDisabledOpacity: 0
      }, numberPickerOptions )
    );
    numberPicker.centerY = -equalsSign.height / 3;
    const numberPickerParent = new Node( { children: [ numberPicker ] } );

    super( {
      align: 'origin',
      spacing: 3, // space around the equals sign
      children: [ labelNode, equalsSign, numberPickerParent ],
      visibleProperty: numberPicker.visibleProperty
    } );

    this.numberPicker = numberPicker;
  }
}

vectorAddition.register( 'LabelEqualsNumberPicker', LabelEqualsNumberPicker );