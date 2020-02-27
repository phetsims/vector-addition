// Copyright 2019, University of Colorado Boulder

/**
 * The 'Explore 2D' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import vectorAdditionStrings from '../vector-addition-strings.js';
import vectorAddition from '../vectorAddition.js';
import Explore2DModel from './model/Explore2DModel.js';
import Explore2DScreenView from './view/Explore2DScreenView.js';

const screenExplore2DString = vectorAdditionStrings.screen.explore2D;

class Explore2DScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: screenExplore2DString,
      backgroundColorProperty: new Property( VectorAdditionColors.SCREEN_BACKGROUND ),
      homeScreenIcon: VectorAdditionIconFactory.createExplore2DScreenIcon(),
      tandem: tandem
    };

    super( () => new Explore2DModel( tandem.createTandem( 'explore2DModel' ) ),
      model => new Explore2DScreenView( model, tandem.createTandem( 'explore2DView' ) ),
      options );
  }
}

vectorAddition.register( 'Explore2DScreen', Explore2DScreen );
export default Explore2DScreen;