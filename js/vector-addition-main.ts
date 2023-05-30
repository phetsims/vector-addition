// Copyright 2019-2022, University of Colorado Boulder

/**
 * Main entry point for the 'Vector Addition' sim.
 *
 * @author Martin Veillette
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import VectorAdditionConstants from './common/VectorAdditionConstants.js';
import EquationsScreen from './equations/EquationsScreen.js';
import Explore1DScreen from './explore1D/Explore1DScreen.js';
import Explore2DScreen from './explore2D/Explore2DScreen.js';
import LabScreen from './lab/LabScreen.js';
import VectorAdditionStrings from './VectorAdditionStrings.js';

simLauncher.launch( () => {

  const screens = [
    new Explore1DScreen( Tandem.ROOT.createTandem( 'explore1DScreen' ) ),
    new Explore2DScreen( Tandem.ROOT.createTandem( 'explore2DScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) ),
    new EquationsScreen( Tandem.ROOT.createTandem( 'equationsScreen' ) )
  ];

  const sim = new Sim( VectorAdditionStrings[ 'vector-addition' ].titleStringProperty, screens, {
    credits: VectorAdditionConstants.CREDITS
  } );

  sim.start();
} );