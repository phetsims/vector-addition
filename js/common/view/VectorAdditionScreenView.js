// Copyright 2019, University of Colorado Boulder

/**
 * Root class for the top level views of each screen.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  // constants
  const SCREEN_VIEW_X_MARGIN = VectorAdditionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

  class VectorAdditionScreenView extends ScreenView {
    /**
     * @constructor
     * @param {VectorAdditionModel} vectorAdditionModel
     * @param {Tandem} tandem
     */
    constructor( vectorAdditionModel, tandem ) {

      assert && assert( vectorAdditionModel instanceof VectorAdditionModel,
        `invalid vectorAdditionModel: ${vectorAdditionModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( {
        layoutBounds: VectorAdditionConstants.SCREEN_VIEW_BOUNDS
      } );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          vectorAdditionModel.reset();
        },
        right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );
} );