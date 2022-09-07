// Copyright 2019-2021, University of Colorado Boulder

/**
 * The 'Explore 1D' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionStrings from '../VectorAdditionStrings.js';
import Explore1DModel from './model/Explore1DModel.js';
import Explore1DScreenView from './view/Explore1DScreenView.js';

class Explore1DScreen extends Screen {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: VectorAdditionStrings.screen.explore1D,
      backgroundColorProperty: new Property( VectorAdditionColors.SCREEN_BACKGROUND ),
      homeScreenIcon: VectorAdditionIconFactory.createExplore1DScreenIcon(),
      tandem: tandem
    };

    super( () => new Explore1DModel( tandem.createTandem( 'model' ) ),
      model => new Explore1DScreenView( model, tandem.createTandem( 'view' ) ),
      options );
  }
}

vectorAddition.register( 'Explore1DScreen', Explore1DScreen );
export default Explore1DScreen;