// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class CommonScreenView extends ScreenView {

    /**
     * @param {commonModel} commonModel
     * @param {Tandem} tandem
     */
    constructor( commonModel, tandem ) {

      super();

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          commonModel.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }

  }

  return vectorAddition.register( 'CommonScreenView', CommonScreenView );
} );