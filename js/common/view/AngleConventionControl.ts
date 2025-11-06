// Copyright 2025, University of Colorado Boulder

/**
 * AngleConventionControl.ts is the control in the Preferences dialog for choosing the convention used to
 * display angle values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { AngleConvention } from '../model/AngleConvention.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

const RADIO_BUTTON_LABEL_OPTIONS = {
  font: new PhetFont( 16 ),
  maxWidth: 200
};

export default class AngleConventionControl extends PreferencesControl {

  public constructor( angleConventionProperty: StringUnionProperty<AngleConvention>, tandem: Tandem ) {

    const labelText = new Text( VectorAdditionStrings.angleConventionStringProperty,
      PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );

    const descriptionText = new RichText( VectorAdditionStrings.angleConventionDescriptionStringProperty,
      PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );

    const radioButtonGroup = new AngleConventionRadioButtonGroup( angleConventionProperty,
      tandem.createTandem( 'radioButtonGroup' ) );

    super( combineOptions<PreferencesControlOptions>( {}, VectorAdditionConstants.PREFERENCES_CONTROL_OPTIONS, {
      labelNode: labelText,
      controlNode: radioButtonGroup,
      descriptionNode: descriptionText,
      tandem: tandem,
      phetioFeatured: true
    } ) );
  }
}

/**
 * The radio button group for this control.
 */
class AngleConventionRadioButtonGroup extends AquaRadioButtonGroup<AngleConvention> {

  public constructor( angleConventionProperty: StringUnionProperty<AngleConvention>, tandem: Tandem ) {

    const items: AquaRadioButtonGroupItem<AngleConvention>[] = [
      {
        value: 'signed',
        createNode: () => new Text( VectorAdditionStrings.signedRangeStringProperty, RADIO_BUTTON_LABEL_OPTIONS ),
        options: {
          accessibleName: VectorAdditionStrings.a11y.signedRadioButtonStringProperty
        },
        tandemName: 'signedRadioButton'
      },
      {
        value: 'unsigned',
        createNode: () => new Text( VectorAdditionStrings.unsignedRangeStringProperty, RADIO_BUTTON_LABEL_OPTIONS ),
        options: {
          accessibleName: VectorAdditionStrings.a11y.unsignedRadioButtonStringProperty
        },
        tandemName: 'unsignedRadioButton'
      }
    ];

    super( angleConventionProperty, items, {
      orientation: 'horizontal',
      spacing: 25,
      radioButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      },
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'AngleConventionControl', AngleConventionControl );