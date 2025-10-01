// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from './LabScene.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';

export default class LabModel extends VectorAdditionModel {

  // Scene for Cartesian snap mode
  public readonly cartesianScene: LabScene;

  // Scene for Polar snap mode
  public readonly polarScene: LabScene;

  // The selected scene
  public readonly sceneProperty: Property<LabScene>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    const scenesTandem = tandem.createTandem( 'scenes' );

    this.cartesianScene = new LabScene(
      VectorAdditionStrings.a11y.cartesianSceneNameStringProperty,
      'cartesian',
      new Vector2( 8, 6 ),
      this.componentVectorStyleProperty,
      VectorAdditionSymbols.vStringProperty,
      VectorAdditionSymbols.uStringProperty,
      'u',
      'v',
      VectorAdditionColors.LAB_CARTESIAN_COLOR_PALETTE_1,
      VectorAdditionColors.LAB_CARTESIAN_COLOR_PALETTE_2,
      scenesTandem.createTandem( 'cartesianScene' )
    );

    this.polarScene = new LabScene(
      VectorAdditionStrings.a11y.polarSceneNameStringProperty,
      'polar',
      Vector2.createPolar( 8, toRadians( 45 ) ),
      this.componentVectorStyleProperty,
      VectorAdditionSymbols.pStringProperty,
      VectorAdditionSymbols.qStringProperty,
      'p',
      'q',
      VectorAdditionColors.LAB_POLAR_COLOR_PALETTE_1,
      VectorAdditionColors.LAB_POLAR_COLOR_PALETTE_2,
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

vectorAddition.register( 'LabModel', LabModel );