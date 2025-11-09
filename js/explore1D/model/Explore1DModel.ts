// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DModel is the model for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ExploreScene from '../../common/model/ExploreScene.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DHorizontalScene from './Explore1DHorizontalScene.js';
import Explore1DVerticalScene from './Explore1DVerticalScene.js';

export default class Explore1DModel extends VectorAdditionModel {

  public readonly horizontalScene: Explore1DHorizontalScene;
  public readonly verticalScene: Explore1DVerticalScene;
  public readonly scenes: ExploreScene[];

  // The selected scene
  public readonly sceneProperty: Property<ExploreScene>;

  public constructor( tandem: Tandem ) {

    super( {
      componentVectorStylePropertyInstrumented: false,
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    // Origin is at the center.
    const graphBounds = new Bounds2( -VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.width / 2,
      -VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.height / 2,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.width / 2,
      VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.height / 2 );

    this.horizontalScene = new Explore1DHorizontalScene( this.componentVectorStyleProperty, graphBounds, scenesTandem.createTandem( 'horizontalScene' ) );

    this.verticalScene = new Explore1DVerticalScene( this.componentVectorStyleProperty, graphBounds, scenesTandem.createTandem( 'verticalScene' ) );

    this.scenes = [ this.horizontalScene, this.verticalScene ];

    this.sceneProperty = new Property( this.horizontalScene, {
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

vectorAddition.register( 'Explore1DModel', Explore1DModel );