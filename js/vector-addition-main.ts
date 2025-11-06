// Copyright 2019-2025, University of Colorado Boulder

/**
 * Main entry point for the 'Vector Addition' sim.
 *
 * @author Martin Veillette
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import VectorAdditionPreferences from './common/model/VectorAdditionPreferences.js';
import VectorAdditionConstants from './common/VectorAdditionConstants.js';
import VectorAdditionPreferencesNode from './common/view/VectorAdditionPreferencesNode.js';
import EquationsScreen from './equations/EquationsScreen.js';
import Explore1DScreen from './explore1D/Explore1DScreen.js';
import Explore2DScreen from './explore2D/Explore2DScreen.js';
import LabScreen from './lab/LabScreen.js';
import VectorAdditionStrings from './VectorAdditionStrings.js';

simLauncher.launch( () => {

  const titleStringProperty = VectorAdditionStrings[ 'vector-addition' ].titleStringProperty;

  const screens = [
    new Explore1DScreen( Tandem.ROOT.createTandem( 'explore1DScreen' ) ),
    new Explore2DScreen( Tandem.ROOT.createTandem( 'explore2DScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) ),
    new EquationsScreen( Tandem.ROOT.createTandem( 'equationsScreen' ) )
  ];

  const options = {
    credits: VectorAdditionConstants.CREDITS,

    // Preferences
    preferencesModel: new PreferencesModel( {
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new VectorAdditionPreferencesNode( VectorAdditionPreferences.instance, tandem )
        } ]
      }
    } )
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );