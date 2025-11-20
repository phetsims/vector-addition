// Copyright 2019-2025, University of Colorado Boulder

/**
 * Base class for the top-level view of each screen.
 *
 * @author Martin Veillette
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

type SelfOptions = {
  resetModel: () => void; // Called by resetAllButton to reset the model.
};

export type VectorAdditionScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem' | 'screenSummaryContent'>;

export default class VectorAdditionScreenView extends ScreenView {

  // Must be added to the scenegraph and pdomOrder by subclass.
  protected readonly resetAllButton: Node;

  protected constructor( sceneProperty: TReadOnlyProperty<VectorAdditionScene>, providedOptions: VectorAdditionScreenViewOptions ) {

    const options = optionize<VectorAdditionScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // ScreenViewOptions
      layoutBounds: VectorAdditionConstants.SCREEN_VIEW_BOUNDS
    }, providedOptions );

    super( options );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        options.resetModel();
        this.reset();
      },
      right: this.layoutBounds.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Cancel interactions when switching scenes.
    sceneProperty.lazyLink( () => this.interruptSubtreeInput() );
  }

  public reset(): void {
    // Nothing to do here, but subclasses will override.
  }
}

vectorAddition.register( 'VectorAdditionScreenView', VectorAdditionScreenView );