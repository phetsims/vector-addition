// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DModel is the model for the 'Explore 2D' screen.
 *
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import vectorAddition from '../../vectorAddition.js';
import Explore2DCartesianScene from './Explore2DCartesianScene.js';
import { Explore2DPolarScene } from './Explore2DPolarScene.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class Explore2DModel extends VectorAdditionModel<ExploreScene> {

  // Specific scenes are needed in some view code.
  public readonly cartesianScene: ExploreScene;
  public readonly polarScene: ExploreScene;

  public constructor( tandem: Tandem ) {

    super( {
      createScenes: ( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, scenesTandem: Tandem ) => {
        return [
          new Explore2DCartesianScene( componentVectorStyleProperty, scenesTandem.createTandem( 'cartesianScene' ) ),
          new Explore2DPolarScene( componentVectorStyleProperty, scenesTandem.createTandem( 'polarScene' ) )
        ];
      },
      tandem: tandem
    } );

    this.cartesianScene = this.scenes[ 0 ];
    affirm( this.cartesianScene instanceof Explore2DCartesianScene, 'invalid scene type' );

    this.polarScene = this.scenes[ 1 ];
    affirm( this.polarScene instanceof Explore2DPolarScene, 'invalid scene type' );
  }
}

vectorAddition.register( 'Explore2DModel', Explore2DModel );