// Copyright 2019-2020, University of Colorado Boulder

/**
 * The 'Lab' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import VectorAdditionColors from '../common/VectorAdditionColors.js';
import VectorAdditionIconFactory from '../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../vectorAddition.js';
import vectorAdditionStrings from '../vectorAdditionStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: vectorAdditionStrings.screen.lab,
      backgroundColorProperty: new Property( VectorAdditionColors.SCREEN_BACKGROUND ),
      homeScreenIcon: VectorAdditionIconFactory.createLabScreenIcon(),
      tandem: tandem
    };

    super( () => new LabModel( tandem.createTandem( 'labModel' ) ),
      model => new LabScreenView( model, tandem.createTandem( 'labView' ) ),
      options );
  }
}

vectorAddition.register( 'LabScreen', LabScreen );
export default LabScreen;