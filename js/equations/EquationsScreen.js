// Copyright 2019-2020, University of Colorado Boulder

/**
 * The 'Equations' screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import vectorAdditionStrings from '../vectorAdditionStrings.js';
import vectorAddition from '../vectorAddition.js';
import EquationsModel from './model/EquationsModel.js';
import EquationsScreenView from './view/EquationsScreenView.js';

const screenEquationsString = vectorAdditionStrings.screen.equations;

class EquationsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: screenEquationsString,
      backgroundColorProperty: new Property( VectorAdditionColors.SCREEN_BACKGROUND ),
      homeScreenIcon: VectorAdditionIconFactory.createEquationsScreenIcon(),
      tandem: tandem
    };

    super(
      () => new EquationsModel( tandem.createTandem( 'equationsModel' ) ),
      model => new EquationsScreenView( model, tandem.createTandem( 'equationsView' ) ),
      options
    );
  }
}

vectorAddition.register( 'EquationsScreen', EquationsScreen );
export default EquationsScreen;