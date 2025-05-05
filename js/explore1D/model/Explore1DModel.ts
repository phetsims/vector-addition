// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DModel is the model for the 'Explore 1D' screen.
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
import Explore1DGraph from './Explore1DGraph.js';

export default class Explore1DModel extends VectorAdditionModel {

  // Property controlling the visibility of the sum for both Graph instances
  public readonly sumVisibleProperty: Property<boolean>;

  // graph for the horizontal (x-axis) orientation
  public readonly horizontalGraph: Explore1DGraph;

  // graph for the vertical (y-axis) orientation
  public readonly verticalGraph: Explore1DGraph;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE, {
      tandem: tandem.createTandem( 'sumVisibleProperty' )
    } );

    this.horizontalGraph = new Explore1DGraph(
      'horizontal',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.BLUE_COLOR_PALETTE,
      tandem.createTandem( 'horizontalGraph' )
    );

    this.verticalGraph = new Explore1DGraph(
      'vertical',
      this.componentVectorStyleProperty,
      this.sumVisibleProperty,
      VectorAdditionColors.BLUE_COLOR_PALETTE,
      tandem.createTandem( 'verticalGraph' )
    );
  }

  public override reset(): void {
    super.reset();
    this.sumVisibleProperty.reset();
    this.horizontalGraph.reset();
    this.verticalGraph.reset();
  }
}

vectorAddition.register( 'Explore1DModel', Explore1DModel );