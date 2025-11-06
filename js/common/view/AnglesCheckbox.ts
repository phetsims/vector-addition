// Copyright 2019-2025, University of Colorado Boulder

/**
 * AnglesCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';

export default class AnglesCheckbox extends Checkbox {

  public constructor( anglesVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const options = combineOptions<CheckboxOptions>( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, {
      accessibleName: VectorAdditionStrings.a11y.anglesCheckbox.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.anglesCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    super( anglesVisibleProperty, VectorAdditionIconFactory.createAngleIcon(), options );
  }
}

vectorAddition.register( 'AnglesCheckbox', AnglesCheckbox );