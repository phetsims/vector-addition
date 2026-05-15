// Copyright 2019-2026, University of Colorado Boulder

/**
 * The 'Equations' screen.
 *
 * @author Martin Veillette
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import VectorAdditionKeyboardHelpContent from '../common/view/VectorAdditionKeyboardHelpContent.js';
import VectorAdditionFluent from '../VectorAdditionFluent.js';
import EquationsModel from './model/EquationsModel.js';
import EquationsScreenView from './view/EquationsScreenView.js';

export default class EquationsScreen extends Screen<EquationsModel, EquationsScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: VectorAdditionFluent.screen.equationsStringProperty,
      backgroundColorProperty: VectorAdditionColors.screenBackgroundColorProperty,
      homeScreenIcon: VectorAdditionIconFactory.createEquationsScreenIcon(),
      screenButtonsHelpText: VectorAdditionFluent.a11y.equationsScreen.screenButtonsHelpTextStringProperty,
      createKeyboardHelpNode: () => new VectorAdditionKeyboardHelpContent( false /* includeScaleRotate */ ),
      tandem: tandem
    };

    super(
      () => new EquationsModel( tandem.createTandem( 'model' ) ),
      model => new EquationsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}
