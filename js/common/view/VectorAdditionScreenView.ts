// Copyright 2019-2024, University of Colorado Boulder

/**
 * Base class for the top-level view of each screen.
 *
 * @author Martin Veillette
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionModel from '../model/VectorAdditionModel.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class VectorAdditionScreenView extends ScreenView {

  // Must be added to scene graph by subclass
  protected readonly resetAllButton: Node;

  protected constructor( model: VectorAdditionModel, tandem: Tandem ) {

    super( {
      layoutBounds: VectorAdditionConstants.SCREEN_VIEW_BOUNDS,
      isDisposable: false,
      tandem: tandem
    } );

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

  public reset(): void {

    // cancel any interactions that are in progress
    this.interruptSubtreeInput();
  }
}

vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );