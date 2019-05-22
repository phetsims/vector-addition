// Copyright 2019, University of Colorado Boulder

/**
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

  // strings
  const screenExplore1DString = require( 'string!VECTOR_ADDITION/screen.explore1D' );

  class Explore1DScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenExplore1DString,
        backgroundColorProperty: new Property( 'rgb( 255, 250, 227 )' ),
        tandem: tandem
      };

      super(
        () => new Explore1DModel( tandem.createTandem( 'explore1DModel' ) ),
        ( explore1DModel ) => new Explore1DScreenView( explore1DModel, tandem.createTandem( 'explore1DView' ) ),
        options
      );
    }
  }

  return vectorAddition.register( 'Explore1DScreen', Explore1DScreen );
} );