// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsModel is the model for the 'Equations' screen.
 *
 * @author Brandon Li
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsCartesianScene from './EquationsCartesianScene.js';
import EquationsPolarScene from './EquationsPolarScene.js';
import EquationsScene from './EquationsScene.js';

export default class EquationsModel extends VectorAdditionModel<EquationsScene> {

  // Specific scenes are needed in some view code.
  public readonly cartesianScene: EquationsScene;
  public readonly polarScene: EquationsScene;

  public constructor( tandem: Tandem ) {

    super( {
      createScenes: ( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, scenesTandem: Tandem ) => {
        return [
          new EquationsCartesianScene( componentVectorStyleProperty, scenesTandem.createTandem( 'cartesianScene' ) ),
          new EquationsPolarScene( componentVectorStyleProperty, scenesTandem.createTandem( 'polarScene' ) )
        ];
      },
      tandem: tandem
    } );

    this.cartesianScene = this.scenes[ 0 ];
    affirm( this.cartesianScene instanceof EquationsCartesianScene, 'invalid scene type' );

    this.polarScene = this.scenes[ 1 ];
    affirm( this.polarScene instanceof EquationsPolarScene, 'invalid scene type' );
  }
}

vectorAddition.register( 'EquationsModel', EquationsModel );