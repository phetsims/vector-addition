// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const EquationModel = require( 'VECTOR_ADDITION/equation/model/EquationModel' );
  const EquationScreenView = require( 'VECTOR_ADDITION/equation/view/EquationScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // strings
  const screenEquationString = require( 'string!VECTOR_ADDITION/screen.equation' );

  class EquationScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenEquationString,
        backgroundColorProperty: new Property( 'rgb( 255, 250, 227 )' ),
        tandem: tandem
      };

      super(
        () => new EquationModel( tandem.createTandem( 'equationModel' ) ),
        ( equationModel ) => new EquationScreenView( equationModel, tandem.createTandem( 'equationView' ) ),
        options
      );
    }
  }

  return vectorAddition.register( 'EquationScreen', EquationScreen );
} );