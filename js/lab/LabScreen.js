// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const LabModel = require( 'VECTOR_ADDITION/lab/model/LabModel' );
  const LabScreenView = require( 'VECTOR_ADDITION/lab/view/LabScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // strings
  const screenLabString = require( 'string!VECTOR_ADDITION/screen.lab' );

  class LabScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenLabString,
        backgroundColorProperty: new Property( 'white' ),
        tandem: tandem
      };

      super(
        () => new LabModel( tandem.createTandem( 'labModel' ) ),
        ( labModel ) => new LabScreenView( labModel, tandem.createTandem( 'labView' ) ),
        options
      );
    }
  }

  return vectorAddition.register( 'LabScreen', LabScreen );
} );