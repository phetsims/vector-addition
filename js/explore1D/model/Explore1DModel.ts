// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DModel is the model for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DScene from './Explore1DScene.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

export default class Explore1DModel extends VectorAdditionModel {

  // Scene for the horizontal (x-axis) orientation
  public readonly horizontalScene: Explore1DScene;

  // Scene for the vertical (y-axis) orientation
  public readonly verticalScene: Explore1DScene;

  // The selected scene
  public readonly sceneProperty: Property<Explore1DScene>;

  public constructor( tandem: Tandem ) {

    super( {
      componentVectorStylePropertyInstrumented: false,
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.horizontalScene = new Explore1DScene(
      VectorAdditionStrings.a11y.horizontalSceneNameStringProperty,
      'horizontal',
      this.componentVectorStyleProperty,
      VectorAdditionColors.EXPLORE_1D_HORIZONTAL_COLOR_PALETTE,
      scenesTandem.createTandem( 'horizontalScene' )
    );

    this.verticalScene = new Explore1DScene(
      VectorAdditionStrings.a11y.verticalSceneNameStringProperty,
      'vertical',
      this.componentVectorStyleProperty,
      VectorAdditionColors.EXPLORE_1D_VERTICAL_COLOR_PALETTE,
      scenesTandem.createTandem( 'verticalScene' )
    );

    this.sceneProperty = new Property( this.horizontalScene, {
      validValues: [ this.horizontalScene, this.verticalScene ],
      tandem: tandem.createTandem( 'sceneProperty' ),
      phetioValueType: VectorAdditionScene.VectorAdditionSceneIO
    } );
  }

  public override reset(): void {
    this.horizontalScene.reset();
    this.verticalScene.reset();
    this.sceneProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'Explore1DModel', Explore1DModel );