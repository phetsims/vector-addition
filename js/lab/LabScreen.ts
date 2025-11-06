// Copyright 2019-2025, University of Colorado Boulder

/**
 * The 'Lab' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import VectorAdditionKeyboardHelpContent from '../common/view/VectorAdditionKeyboardHelpContent.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

export default class LabScreen extends Screen<LabModel, LabScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: VectorAdditionStrings.screen.labStringProperty,
      backgroundColorProperty: VectorAdditionColors.screenBackgroundColorProperty,
      homeScreenIcon: VectorAdditionIconFactory.createLabScreenIcon(),
      screenButtonsHelpText: VectorAdditionStrings.a11y.labScreen.screenButtonsHelpTextStringProperty,
      createKeyboardHelpNode: () => new VectorAdditionKeyboardHelpContent(),
      tandem: tandem
    };

    super( () => new LabModel( tandem.createTandem( 'model' ) ),
      model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
      options );
  }
}

vectorAddition.register( 'LabScreen', LabScreen );