// Copyright 2019, University of Colorado Boulder

/**
 * The 'Explore 2D' screen. Conforms to the contract specified in joist/Screen.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
  const Explore2DScreenView = require( 'VECTOR_ADDITION/explore2D/view/Explore2DScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // strings
  const screenExplore2DString = require( 'string!VECTOR_ADDITION/screen.explore2D' );

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
        explore2DModel => new Explore2DScreenView( explore2DModel, tandem.createTandem( 'explore2DView' ) ),
        options );
    }
  }

  return vectorAddition.register( 'Explore2DScreen', Explore2DScreen );
} );