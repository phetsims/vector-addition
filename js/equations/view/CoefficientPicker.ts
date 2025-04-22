// Copyright 2025, University of Colorado Boulder

/**
 * CoefficientPicker is a NumberPicker for changing the coefficient of an equation term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberPicker, { NumberPickerOptions } from '../../../../sun/js/NumberPicker.js';
import vectorAddition from '../../vectorAddition.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';

type SelfOptions = EmptySelfOptions;

type CoefficientPickerOptions = SelfOptions &
  PickOptional<NumberPickerOptions, 'phetioVisiblePropertyInstrumented'> &
  PickRequired<NumberPickerOptions, 'tandem' | 'color'>;

export default class CoefficientPicker extends NumberPicker {

  public constructor( coefficientProperty: NumberProperty, providedOptions: CoefficientPickerOptions ) {

    const options = optionize4<CoefficientPickerOptions, SelfOptions, NumberPickerOptions>()(
      {}, VectorAdditionConstants.NUMBER_PICKER_OPTIONS, {

        // NumberPickerOptions
        isDisposable: false,
        touchAreaXDilation: 20,
        touchAreaYDilation: 14,
        font: VectorAdditionConstants.INTERACTIVE_EQUATION_FONT,

        // Hide arrows when picker is disabled.
        disabledOpacity: 1,
        backgroundStrokeDisabledOpacity: 1,
        arrowDisabledOpacity: 0
      }, providedOptions );

    super( coefficientProperty, coefficientProperty.rangeProperty, options );
  }
}

vectorAddition.register( 'CoefficientPicker', CoefficientPicker );