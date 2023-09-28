// Copyright 2019-2023, University of Colorado Boulder

/**
 * The 'Explore 1D' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */

import Screen from '../../../joist/js/Screen.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';
import Explore1DModel from './model/Explore1DModel.js';
import Explore1DScreenView from './view/Explore1DScreenView.js';
import Tandem from '../../../tandem/js/Tandem.js';

export default class Explore1DScreen extends Screen<Explore1DModel, Explore1DScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: VectorAdditionStrings.screen.explore1DStringProperty,
      backgroundColorProperty: VectorAdditionColors.screenBackgroundColorProperty,
      homeScreenIcon: VectorAdditionIconFactory.createExplore1DScreenIcon(),
      tandem: tandem
    };

    super(
      () => new Explore1DModel( tandem.createTandem( 'model' ) ),
      model => new Explore1DScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

vectorAddition.register( 'Explore1DScreen', Explore1DScreen );