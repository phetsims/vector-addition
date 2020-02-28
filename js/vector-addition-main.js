// Copyright 2019-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Vector Addition' sim.
 *
 * @author Martin Veillette
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import VectorAdditionConstants from './common/VectorAdditionConstants.js';
import EquationsScreen from './equations/EquationsScreen.js';
import Explore1DScreen from './explore1D/Explore1DScreen.js';
import Explore2DScreen from './explore2D/Explore2DScreen.js';
import LabScreen from './lab/LabScreen.js';
import vectorAdditionStrings from './vector-addition-strings.js';

const vectorAdditionTitleString = vectorAdditionStrings[ 'vector-addition' ].title;

SimLauncher.launch( () => {

  const screens = [
    new Explore1DScreen( Tandem.ROOT.createTandem( 'explore1DScreen' ) ),
    new Explore2DScreen( Tandem.ROOT.createTandem( 'explore2DScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) ),
    new EquationsScreen( Tandem.ROOT.createTandem( 'equationsScreen' ) )
  ];

  const sim = new Sim( vectorAdditionTitleString, screens, {
    credits: VectorAdditionConstants.CREDITS
  } );

  sim.start();
} );