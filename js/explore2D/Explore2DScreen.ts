// Copyright 2019-2023, University of Colorado Boulder

/**
 * The 'Explore 2D' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';
import Explore2DModel from './model/Explore2DModel.js';
import Explore2DScreenView from './view/Explore2DScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class Explore2DScreen extends Screen<Explore2DModel, Explore2DScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: VectorAdditionStrings.screen.explore2DStringProperty,
      backgroundColorProperty: VectorAdditionColors.screenBackgroundColorProperty,
      homeScreenIcon: VectorAdditionIconFactory.createExplore2DScreenIcon(),
      tandem: tandem
    };

    super(
      () => new Explore2DModel( tandem.createTandem( 'model' ) ),
      model => new Explore2DScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

vectorAddition.register( 'Explore2DScreen', Explore2DScreen );