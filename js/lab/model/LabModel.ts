// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import vectorAddition from '../../vectorAddition.js';
import LabCartesianScene from './LabCartesianScene.js';
import LabPolarScene from './LabPolarScene.js';
import LabScene from './LabScene.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class LabModel extends VectorAdditionModel<LabScene> {

  // Specific scenes are needed in some view code.
  public readonly cartesianScene: LabScene;
  public readonly polarScene: LabScene;

  public constructor( tandem: Tandem ) {

    super( {
      createScenes: ( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, scenesTandem: Tandem ) => {
        return [
          new LabCartesianScene( componentVectorStyleProperty, scenesTandem.createTandem( 'cartesianScene' ) ),
          new LabPolarScene( componentVectorStyleProperty, scenesTandem.createTandem( 'polarScene' ) )
        ];
      },
      tandem: tandem
    } );

    this.cartesianScene = this.scenes[ 0 ];
    affirm( this.cartesianScene instanceof LabCartesianScene, 'invalid scene type' );

    this.polarScene = this.scenes[ 1 ];
    affirm( this.polarScene instanceof LabPolarScene, 'invalid scene type' );
  }
}

vectorAddition.register( 'LabModel', LabModel );