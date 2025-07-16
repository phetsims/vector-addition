// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsModel is the model for the 'Equations' screen.
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsScene from './EquationsScene.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class EquationsModel extends VectorAdditionModel {

  // Scene for Cartesian snap mode
  public readonly cartesianScene: EquationsScene;

  // Scene for Polar snap mode
  public readonly polarScene: EquationsScene;

  // The selected scene
  public readonly sceneProperty: Property<EquationsScene>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new EquationsScene(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      'cartesian',
      this.componentVectorStyleProperty,
      VectorAdditionColors.EQUATIONS_CARTESIAN_COLOR_PALETTE,
      scenesTandem.createTandem( 'cartesianScene' )
    );

    this.polarScene = new EquationsScene(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      'polar',
      this.componentVectorStyleProperty,
      VectorAdditionColors.EQUATIONS_POLAR_COLOR_PALETTE,
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
    super.reset();
  }
}

vectorAddition.register( 'EquationsModel', EquationsModel );