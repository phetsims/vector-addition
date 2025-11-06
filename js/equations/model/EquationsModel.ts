// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsModel is the model for the 'Equations' screen.
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsCartesianScene from './EquationsCartesianScene.js';
import EquationsPolarScene from './EquationsPolarScene.js';
import EquationsScene from './EquationsScene.js';

export default class EquationsModel extends VectorAdditionModel {

  public readonly cartesianScene: EquationsScene;
  public readonly polarScene: EquationsScene;

  // The selected scene
  public readonly sceneProperty: Property<EquationsScene>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new EquationsCartesianScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'cartesianScene' ) );

    this.polarScene = new EquationsPolarScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'polarScene' ) );

    this.sceneProperty = new Property( this.cartesianScene, {
      validValues: [ this.cartesianScene, this.polarScene ],
      tandem: tandem.createTandem( 'sceneProperty' ),
      phetioFeatured: true,
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

vectorAddition.register( 'EquationsModel', EquationsModel );