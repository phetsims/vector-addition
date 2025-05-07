// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsModel is the model for the 'Equations' screen.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsScene from './EquationsScene.js';

export default class EquationsModel extends VectorAdditionModel {

  public readonly sumVisibleProperty: Property<boolean>;

  // Scene for Cartesian snap mode
  public readonly cartesianScene: EquationsScene;

  // Scene for Polar snap mode
  public readonly polarScene: EquationsScene;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sumVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'sumVisibleProperty' )
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new EquationsScene( 'cartesian',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.EQUATIONS_BLUE_COLOR_PALETTE,
      scenesTandem.createTandem( 'cartesianScene' )
    );

    this.polarScene = new EquationsScene( 'polar',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.EQUATIONS_PINK_COLOR_PALETTE,
      scenesTandem.createTandem( 'polarScene' )
    );
  }

  public override reset(): void {
    super.reset();
    this.sumVisibleProperty.reset();
    this.cartesianScene.reset();
    this.polarScene.reset();
  }
}

vectorAddition.register( 'EquationsModel', EquationsModel );