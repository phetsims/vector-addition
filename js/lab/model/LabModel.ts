// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import vectorAddition from '../../vectorAddition.js';
import LabCartesianScene from './LabCartesianScene.js';
import LabPolarScene from './LabPolarScene.js';
import LabScene from './LabScene.js';

export default class LabModel extends VectorAdditionModel {

  public readonly cartesianScene: LabCartesianScene;
  public readonly polarScene: LabPolarScene;
  public readonly scenes: LabScene[];

  // The selected scene
  public readonly sceneProperty: Property<LabScene>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new LabCartesianScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'cartesianScene' ) );

    this.polarScene = new LabPolarScene( this.componentVectorStyleProperty, scenesTandem.createTandem( 'polarScene' ) );

    this.scenes = [ this.cartesianScene, this.polarScene ];

    this.sceneProperty = new Property( this.cartesianScene, {
      validValues: this.scenes,
      tandem: tandem.createTandem( 'sceneProperty' ),
      phetioFeatured: true,
      phetioValueType: VectorAdditionScene.VectorAdditionSceneIO
    } );
  }

  public override reset(): void {
    this.scenes.forEach( scene => scene.reset() );
    this.sceneProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'LabModel', LabModel );