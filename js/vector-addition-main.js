// Copyright 2019, University of Colorado Boulder

/**
 * Main entry point for the 'Vector Addition' sim.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const EquationsScreen = require( 'VECTOR_ADDITION/equations/EquationsScreen' );
  const Explore1DScreen = require( 'VECTOR_ADDITION/explore1D/Explore1DScreen' );
  const Explore2DScreen = require( 'VECTOR_ADDITION/explore2D/Explore2DScreen' );
  const LabScreen = require( 'VECTOR_ADDITION/lab/LabScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const vectorAdditionTitleString = require( 'string!VECTOR_ADDITION/vector-addition.title' );

  const options = {
    credits: {
      leadDesign: 'Michael Dubson, Amy Rouinfar',
      softwareDevelopment: 'Brandon Li, Martin Veillette, Chris Malley (PixelZoom, Inc.)',
      team: 'Diana L\u00f3pez Tavares, Amanda McGarry, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Katie Woessner'
    }
  };

  SimLauncher.launch( () => {
    const screens = [
      new Explore1DScreen( Tandem.rootTandem.createTandem( 'explore1DScreen' ) ),
      new Explore2DScreen( Tandem.rootTandem.createTandem( 'explore2DScreen' ) ),
      new LabScreen( Tandem.rootTandem.createTandem( 'labScreen' ) ),
      new EquationsScreen( Tandem.rootTandem.createTandem( 'equationsScreen' ) )
    ];
    const sim = new Sim( vectorAdditionTitleString, screens, options );
    sim.start();
  } );
} );
