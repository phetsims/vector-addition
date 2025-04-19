// Copyright 2019-2024, University of Colorado Boulder

/**
 * Explore2DModel is the model for the 'Explore 2D' screen.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import Explore2DGraph from './Explore2DGraph.js';

export default class Explore2DModel extends VectorAdditionModel {

  // Property controlling the visibility of the sum for both Graph instances
  public readonly sumVisibleProperty: Property<boolean>;

  public readonly cartesianVectorColorPalette: VectorColorPalette;
  public readonly polarVectorColorPalette: VectorColorPalette;

  // graph for Cartesian snap mode
  public readonly cartesianGraph: Explore2DGraph;

  // graph for Polar snap mode
  public readonly polarGraph: Explore2DGraph;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE, {
      tandem: tandem.createTandem( 'sumVisibleProperty' )
    } );

    this.cartesianVectorColorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;
    this.polarVectorColorPalette = VectorAdditionColors.PINK_COLOR_PALETTE;

    this.cartesianGraph = new Explore2DGraph( CoordinateSnapModes.CARTESIAN,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.cartesianVectorColorPalette );

    this.polarGraph = new Explore2DGraph( CoordinateSnapModes.POLAR,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.polarVectorColorPalette );
  }

  public override reset(): void {
    super.reset();
    this.sumVisibleProperty.reset();
    this.cartesianGraph.reset();
    this.polarGraph.reset();
  }
}

vectorAddition.register( 'Explore2DModel', Explore2DModel );