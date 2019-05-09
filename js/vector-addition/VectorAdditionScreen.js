// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/vector-addition/model/VectorAdditionModel' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/vector-addition/view/VectorAdditionScreenView' );

  class VectorAdditionScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new VectorAdditionModel( tandem.createTandem( 'model' ) ),
        ( model ) => new VectorAdditionScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return vectorAddition.register( 'VectorAdditionScreen', VectorAdditionScreen );
} );