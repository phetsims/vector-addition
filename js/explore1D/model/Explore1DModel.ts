// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DModel is the model for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DHorizontalScene from './Explore1DHorizontalScene.js';
import Explore1DVerticalScene from './Explore1DVerticalScene.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class Explore1DModel extends VectorAdditionModel<ExploreScene> {

  // Specific scenes are needed in some view code.
  public readonly horizontalScene: ExploreScene;
  public readonly verticalScene: ExploreScene;

  public constructor( tandem: Tandem ) {

    // Origin is at the center.
    const graphBounds = new Bounds2( -VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.width / 2,
      -VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.height / 2,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.width / 2,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.height / 2 );

    super( {
      componentVectorStylePropertyInstrumented: false,
      createScenes: ( componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, scenesTandem: Tandem ) => {
        return [
          new Explore1DHorizontalScene( componentVectorStyleProperty, graphBounds, scenesTandem.createTandem( 'horizontalScene' ) ),
          new Explore1DVerticalScene( componentVectorStyleProperty, graphBounds, scenesTandem.createTandem( 'verticalScene' ) )
        ];
      },
      tandem: tandem
    } );

    this.horizontalScene = this.scenes[ 0 ];
    affirm( this.horizontalScene instanceof Explore1DHorizontalScene, 'invalid scene type' );

    this.verticalScene = this.scenes[ 1 ];
    affirm( this.verticalScene instanceof Explore1DVerticalScene, 'invalid scene type' );
  }
}

vectorAddition.register( 'Explore1DModel', Explore1DModel );