// Copyright 2025, University of Colorado Boulder

/**
 * AngleConventionControl.ts is the control in the Preferences dialog for choosing the convention used to
 * display angle values.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { AngleConvention } from '../model/AngleConvention.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';

const RADIO_BUTTON_FONT = new PhetFont( 20 );

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
      tandem: tandem
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
        value: 'unsigned',
        createNode: () => new Text( '(0,360]', {
          font: RADIO_BUTTON_FONT
        } ),
        tandemName: 'unsignedRadioButton'
      },
      {
        value: 'signed',
        createNode: () => new Text( '[-180,180)', {
          font: RADIO_BUTTON_FONT
        } ),
        tandemName: 'signedRadioButton'
      }
    ];

    super( angleConventionProperty, items, {
      orientation: 'vertical',
      spacing: 20,
      radioButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      },
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'AngleConventionControl', AngleConventionControl );