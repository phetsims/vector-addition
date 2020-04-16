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
import vectorAddition from '../vectorAddition.js';
import vectorAdditionStrings from '../vectorAdditionStrings.js';
import EquationsModel from './model/EquationsModel.js';
import EquationsScreenView from './view/EquationsScreenView.js';

class EquationsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: vectorAdditionStrings.screen.equations,
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