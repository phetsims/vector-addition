// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DModel is the model for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DGraph from './Explore1DGraph.js';

export default class Explore1DModel extends VectorAdditionModel {

  // Property controlling the visibility of the sum for both Graph instances
  public readonly sumVisibleProperty: Property<boolean>;

  public readonly horizontalVectorColorPalette: VectorColorPalette;
  public readonly verticalVectorColorPalette: VectorColorPalette;

  // graph for the horizontal (x-axis) orientation
  public readonly horizontalGraph: Explore1DGraph;

  // graph for the vertical (y-axis) orientation
  public readonly verticalGraph: Explore1DGraph;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE, {
      tandem: tandem.createTandem( 'sumVisibleProperty' )
    } );

    this.horizontalVectorColorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;
    this.verticalVectorColorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;

    this.horizontalGraph = new Explore1DGraph( GraphOrientations.HORIZONTAL,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.horizontalVectorColorPalette );

    this.verticalGraph = new Explore1DGraph( GraphOrientations.VERTICAL,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.verticalVectorColorPalette );
  }

  public override reset(): void {
    super.reset();
    this.sumVisibleProperty.reset();
    this.horizontalGraph.reset();
    this.verticalGraph.reset();
  }
}

vectorAddition.register( 'Explore1DModel', Explore1DModel );