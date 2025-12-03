// Copyright 2025, University of Colorado Boulder

/**
 * CoefficientPicker is a NumberPicker for changing the coefficient of an equation term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberPicker, { NumberPickerOptions } from '../../../../sun/js/NumberPicker.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

type SelfOptions = EmptySelfOptions;

type CoefficientPickerOptions = SelfOptions & PickRequired<NumberPickerOptions, 'tandem' | 'color'>;

export default class CoefficientPicker extends NumberPicker {

  public constructor( coefficientProperty: NumberProperty, labelStringProperty: TReadOnlyProperty<string>, providedOptions: CoefficientPickerOptions ) {

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
        arrowDisabledOpacity: 0,

        //TODO https://github.com/phetsims/scenery/issues/1731 Replace this workaround with accessibleName.
        // Workaround for dynamic accessibleName triggers a re-render and confuses Safari. These two options replace
        // accessibleName. See https://github.com/phetsims/vector-addition/issues/423#issuecomment-3603841659.
        labelTagName: 'label',
        labelContent: new PatternStringProperty( VectorAdditionStrings.a11y.coefficientPicker.accessibleNameStringProperty, {
          symbol: labelStringProperty
        } ),

        accessibleHelpText: VectorAdditionStrings.a11y.coefficientPicker.accessibleHelpTextStringProperty,

        // false because it makes no sense to hide coefficient pickers in the equations.
        phetioVisiblePropertyInstrumented: false
      }, providedOptions );

    super( coefficientProperty, coefficientProperty.rangeProperty, options );
  }
}

vectorAddition.register( 'CoefficientPicker', CoefficientPicker );