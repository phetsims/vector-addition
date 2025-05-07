// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DModel is the model for the 'Explore 2D' screen.
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
import Explore2DScene from './Explore2DScene.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';

export default class Explore2DModel extends VectorAdditionModel {

  // Scene for Cartesian snap mode
  public readonly cartesianScene: Explore2DScene;

  // Scene for Polar snap mode
  public readonly polarScene: Explore2DScene;

  // The selected scene
  public readonly sceneProperty: Property<Explore2DScene>;

  // Visibility of the sum vector, shared by both scenes.
  public readonly sumVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE, {
      tandem: tandem.createTandem( 'sumVisibleProperty' )
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new Explore2DScene(
      'cartesian',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.BLUE_COLOR_PALETTE,
      scenesTandem.createTandem( 'cartesianScene' )
    );

    this.polarScene = new Explore2DScene(
      'polar',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.PINK_COLOR_PALETTE,
      scenesTandem.createTandem( 'polarScene' )
    );

    this.sceneProperty = new Property( this.cartesianScene, {
      validValues: [ this.cartesianScene, this.polarScene ],
      tandem: tandem.createTandem( 'sceneProperty' ),
      phetioValueType: VectorAdditionScene.VectorAdditionSceneIO
    } );
  }

  public override reset(): void {
    this.cartesianScene.reset();
    this.polarScene.reset();
    this.sceneProperty.reset();
    this.sumVisibleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'Explore2DModel', Explore2DModel );