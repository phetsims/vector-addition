// Copyright 2019, University of Colorado Boulder

/**
 * The 'Explore 1D' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Explore1DModel = require( 'VECTOR_ADDITION/explore1D/model/Explore1DModel' );
  const Explore1DScreenView = require( 'VECTOR_ADDITION/explore1D/view/Explore1DScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // strings
  const screenExplore1DString = require( 'string!VECTOR_ADDITION/screen.explore1D' );

  class Explore1DScreen extends Screen {
    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenExplore1DString,
        backgroundColorProperty: new Property( VectorAdditionColors.SCREEN_BACKGROUND ),
        homeScreenIcon: VectorAdditionIconFactory.createExplore1DScreenIcon(),
        tandem: tandem
      };

      super( () => new Explore1DModel( tandem.createTandem( 'explore1DModel' ) ),
        model => new Explore1DScreenView( model, tandem.createTandem( 'explore1DView' ) ),
        options );
    }
  }

  return vectorAddition.register( 'Explore1DScreen', Explore1DScreen );
} );