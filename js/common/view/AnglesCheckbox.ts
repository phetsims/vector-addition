// Copyright 2019-2025, University of Colorado Boulder

/**
 * AnglesCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionCheckbox from './VectorAdditionCheckbox.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class AnglesCheckbox extends VectorAdditionCheckbox {

  public constructor( anglesVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( anglesVisibleProperty, VectorAdditionIconFactory.createAngleIcon(), {
      accessibleName: VectorAdditionStrings.a11y.anglesCheckbox.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.anglesCheckbox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'AnglesCheckbox', AnglesCheckbox );