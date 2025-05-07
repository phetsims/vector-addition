// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from './LabScene.js';

export default class LabModel extends VectorAdditionModel {

  // visibility of the sum for the first vector set
  public readonly sum1VisibleProperty: Property<boolean>;

  // visibility of the sum for the second vector set
  public readonly sum2VisibleProperty: Property<boolean>;

  // graph for Cartesian snap mode
  public readonly cartesianGraph: LabScene;

  // graph for Polar snap mode
  public readonly polarGraph: LabScene;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sum1VisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE, {
      tandem: tandem.createTandem( 'sum1VisibleProperty' )
    } );
    this.sum2VisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE, {
      tandem: tandem.createTandem( 'sum2VisibleProperty' )
    } );

    this.cartesianGraph = new LabScene(
      'cartesian',
      this.componentVectorStyleProperty,
      this.sum1VisibleProperty,
      this.sum2VisibleProperty,
      VectorAdditionColors.BLUE_COLOR_PALETTE,
      VectorAdditionColors.ORANGE_COLOR_PALETTE,
      tandem.createTandem( 'cartesianGraph' )
    );

    this.polarGraph = new LabScene(
      'polar',
      this.componentVectorStyleProperty,
      this.sum1VisibleProperty,
      this.sum2VisibleProperty,
      VectorAdditionColors.PINK_COLOR_PALETTE,
      VectorAdditionColors.GREEN_COLOR_PALETTE,
      tandem.createTandem( 'polarGraph' )
    );
  }

  public override reset(): void {
    super.reset();
    this.sum1VisibleProperty.reset();
    this.sum2VisibleProperty.reset();
    this.cartesianGraph.reset();
    this.polarGraph.reset();
  }
}

vectorAddition.register( 'LabModel', LabModel );