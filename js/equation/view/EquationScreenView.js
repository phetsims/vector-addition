// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class EquationScreenView extends ScreenView {

    /**
     * @param {EquationModel} equationModel
     * @param {Tandem} tandem
     */
    constructor( equationModel, tandem ) {

      super();

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          equationModel.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

    // @public
    step( dt ) {
      //TODO Handle view animation here.
    }
  }

  return vectorAddition.register( 'EquationScreenView', EquationScreenView );
} );