// Copyright 2019-2023, University of Colorado Boulder

/**
 * Base class for the top-level view of each screen.
 *
 * @author Martin Veillette
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionModel from '../model/VectorAdditionModel.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class VectorAdditionScreenView extends ScreenView {

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

vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );