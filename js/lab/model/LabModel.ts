// Copyright 2019-2023, University of Colorado Boulder

/**
 * LabModel is the model for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import LabGraph from './LabGraph.js';
import Property from '../../../../axon/js/Property.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';

export default class LabModel extends VectorAdditionModel {

  // visibility of the sum for the first vector set
  public readonly sum1VisibleProperty: Property<boolean>;

  // visibility of the sum for the second vector set
  public readonly sum2VisibleProperty: Property<boolean>;

  public readonly cartesianVectorColorPalette1: VectorColorPalette;
  public readonly cartesianVectorColorPalette2: VectorColorPalette;
  public readonly polarVectorColorPalette1: VectorColorPalette;
  public readonly polarVectorColorPalette2: VectorColorPalette;

  // graph for Cartesian snap mode
  public readonly cartesianGraph: LabGraph;

  // graph for Polar snap mode
  public readonly polarGraph: LabGraph;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sum1VisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );
    this.sum2VisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );

    this.cartesianVectorColorPalette1 = VectorAdditionColors.BLUE_COLOR_PALETTE;
    this.cartesianVectorColorPalette2 = VectorAdditionColors.ORANGE_COLOR_PALETTE;
    this.polarVectorColorPalette1 = VectorAdditionColors.PINK_COLOR_PALETTE;
    this.polarVectorColorPalette2 = VectorAdditionColors.GREEN_COLOR_PALETTE;

    this.cartesianGraph = new LabGraph(
      CoordinateSnapModes.CARTESIAN,
      this.componentStyleProperty,
      this.sum1VisibleProperty,
      this.sum2VisibleProperty,
      this.cartesianVectorColorPalette1,
      this.cartesianVectorColorPalette2
    );

    this.polarGraph = new LabGraph(
      CoordinateSnapModes.POLAR,
      this.componentStyleProperty,
      this.sum1VisibleProperty,
      this.sum2VisibleProperty,
      this.polarVectorColorPalette1,
      this.polarVectorColorPalette2
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