// Copyright 2019-2025, University of Colorado Boulder

/**
 * ValuesCheckbox is the checkbox labeled 'Values', used to control visibility of values on vectors.
 * The reason why this is named ValuesCheckbox instead of MagnitudesCheckbox is noted in
 * https://github.com/phetsims/vector-addition/issues/327#issuecomment-3299637646.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class ValuesCheckbox extends Checkbox {

  public constructor( valuesVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const content = new Text( VectorAdditionStrings.valuesStringProperty, {
      font: VectorAdditionConstants.CHECKBOX_FONT,
      maxWidth: 116 // determined empirically
    } );

    const options = combineOptions<CheckboxOptions>( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, {
      accessibleHelpText: VectorAdditionStrings.a11y.valuesCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    super( valuesVisibleProperty, content, options );
  }
}

vectorAddition.register( 'ValuesCheckbox', ValuesCheckbox );