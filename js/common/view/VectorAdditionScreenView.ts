// Copyright 2019-2025, University of Colorado Boulder

/**
 * Base class for the top-level view of each screen.
 *
 * @author Martin Veillette
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionModel from '../model/VectorAdditionModel.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

export type VectorAdditionScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class VectorAdditionScreenView extends ScreenView {

  // Must be added to the scenegraph and pdomOrder by subclass.
  protected readonly resetAllButton: Node;

  protected constructor( model: VectorAdditionModel, providedOptions: VectorAdditionScreenViewOptions ) {

    const options = optionize<VectorAdditionScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // ScreenViewOptions
      layoutBounds: VectorAdditionConstants.SCREEN_VIEW_BOUNDS
    }, providedOptions );

    super( options );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );
  }

  public reset(): void {
    // Nothing to do here, but subclasses will override.
  }
}

vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );