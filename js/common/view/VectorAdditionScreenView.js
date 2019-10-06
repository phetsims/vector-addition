// Copyright 2019, University of Colorado Boulder

/**
 * Base class for the top-level view of each screen.
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

  class VectorAdditionScreenView extends ScreenView {

    /**
     * @abstract
     * @param {VectorAdditionModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      assert && assert( model instanceof VectorAdditionModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( {
        layoutBounds: VectorAdditionConstants.SCREEN_VIEW_BOUNDS,
        tandem: tandem
      } );

      // @protected for layout
      this.resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
          this.reset();
        },
        right: this.layoutBounds.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( this.resetAllButton );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'VectorAdditionScreenView is not intended to be disposed' );
    }

    /**
     * @public
     */
    reset() {

      // cancel any interactions that are in progress
      this.interruptSubtreeInput();
    }
  }

  return vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );
} );