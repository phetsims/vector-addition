// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from './LabScene.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import LabCartesianScene from './LabCartesianScene.js';
import LabPolarScene from './LabPolarScene.js';

export default class LabModel extends VectorAdditionModel {

  public readonly cartesianScene: LabCartesianScene;
  public readonly polarScene: LabPolarScene;

  // The selected scene
  public readonly sceneProperty: Property<LabScene>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new LabCartesianScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'cartesianScene' ) );

    this.polarScene = new LabPolarScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'polarScene' ) );

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

vectorAddition.register( 'LabModel', LabModel );