// Copyright 2019-2023, University of Colorado Boulder

/**
 * Explore1DModel is the model for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DGraph from './Explore1DGraph.js';

export default class Explore1DModel extends VectorAdditionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    super( tandem );

    // @public Property controlling the visibility of the sum for both Graph instances
    this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );

    // @public (read-only) {VectorColorPalette}
    this.horizontalVectorColorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;
    this.verticalVectorColorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;

    // @public (read-only) graph for the horizontal (x-axis) orientation
    this.horizontalGraph = new Explore1DGraph( GraphOrientations.HORIZONTAL,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.horizontalVectorColorPalette );

    // @public (read-only) graph for the vertical (y-axis) orientation
    this.verticalGraph = new Explore1DGraph( GraphOrientations.VERTICAL,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.verticalVectorColorPalette );
  }

  /**
   * Resets the Explore1DModel.
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.sumVisibleProperty.reset();
    this.horizontalGraph.reset();
    this.verticalGraph.reset();
  }
}

vectorAddition.register( 'Explore1DModel', Explore1DModel );