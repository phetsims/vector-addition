// Copyright 2019-2023, University of Colorado Boulder

/**
 * The 'Equations' screen.
 *
 * @author Martin Veillette
 */

import Screen from '../../../joist/js/Screen.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';
import EquationsModel from './model/EquationsModel.js';
import EquationsScreenView from './view/EquationsScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class EquationsScreen extends Screen<EquationsModel, EquationsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: VectorAdditionStrings.screen.equationsStringProperty,
      backgroundColorProperty: VectorAdditionColors.screenBackgroundColorProperty,
      homeScreenIcon: VectorAdditionIconFactory.createEquationsScreenIcon(),
      tandem: tandem
    };

    super(
      () => new EquationsModel( tandem.createTandem( 'model' ) ),
      model => new EquationsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

vectorAddition.register( 'EquationsScreen', EquationsScreen );