// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DModel is the model for the 'Explore 2D' screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import vectorAddition from '../../vectorAddition.js';
import Explore2DScene from './Explore2DScene.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import CartesianScene from './CartesianScene.js';
import { PolarScene } from './PolarScene.js';

export default class Explore2DModel extends VectorAdditionModel {

  // Scene for Cartesian snap mode
  public readonly cartesianScene: CartesianScene;

  // Scene for Polar snap mode
  public readonly polarScene: PolarScene;

  // The selected scene
  public readonly sceneProperty: Property<Explore2DScene>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new CartesianScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'cartesianScene' ) );

    this.polarScene = new PolarScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'polarScene' ) );

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
    super.reset();
  }
}

vectorAddition.register( 'Explore2DModel', Explore2DModel );