// Copyright 2019, University of Colorado Boulder

/**
 * The 'Equations' screen.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const EquationsModel = require( 'VECTOR_ADDITION/equations/model/EquationsModel' );
  const EquationsScreenView = require( 'VECTOR_ADDITION/equations/view/EquationsScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // strings
  const screenEquationsString = require( 'string!VECTOR_ADDITION/screen.equations' );

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
        equationModel => new EquationsScreenView( equationModel, tandem.createTandem( 'equationsView' ) ),
        options
      );
    }
  }

  return vectorAddition.register( 'EquationsScreen', EquationsScreen );
} );