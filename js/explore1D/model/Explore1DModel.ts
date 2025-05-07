// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DModel is the model for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DScene from './Explore1DScene.js';

export default class Explore1DModel extends VectorAdditionModel {

  // Property controlling the visibility of the sum for both VectorAdditionScene instances
  public readonly sumVisibleProperty: Property<boolean>;

  // Scene for the horizontal (x-axis) orientation
  public readonly horizontalScene: Explore1DScene;

  // Scene for the vertical (y-axis) orientation
  public readonly verticalScene: Explore1DScene;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE, {
      tandem: tandem.createTandem( 'sumVisibleProperty' )
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.horizontalScene = new Explore1DScene(
      'horizontal',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.BLUE_COLOR_PALETTE,
      scenesTandem.createTandem( 'horizontalScene' )
    );

    this.verticalScene = new Explore1DScene(
      'vertical',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.BLUE_COLOR_PALETTE,
      scenesTandem.createTandem( 'verticalScene' )
    );
  }

  public override reset(): void {
    super.reset();
    this.sumVisibleProperty.reset();
    this.horizontalScene.reset();
    this.verticalScene.reset();
  }
}

vectorAddition.register( 'Explore1DModel', Explore1DModel );