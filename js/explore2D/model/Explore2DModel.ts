// Copyright 2019-2023, University of Colorado Boulder

/**
 * Explore2DModel is the model for the 'Explore 2D' screen.
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
import Explore2DGraph from './Explore2DGraph.js';

export default class Explore2DModel extends VectorAdditionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    super( tandem );

    // @public Property controlling the visibility of the sum for both Graph instances
    this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );

    // @public (read-only) {VectorColorPalette}
    this.cartesianVectorColorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;
    this.polarVectorColorPalette = VectorAdditionColors.PINK_COLOR_PALETTE;

    // @public (read-only) graph for Cartesian snap mode
    this.cartesianGraph = new Explore2DGraph( CoordinateSnapModes.CARTESIAN,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.cartesianVectorColorPalette );

    // @public (read-only) graph for Polar snap mode
    this.polarGraph = new Explore2DGraph( CoordinateSnapModes.POLAR,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.polarVectorColorPalette );
  }

  /**
   * Resets the Explore2DModel.
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.sumVisibleProperty.reset();
    this.cartesianGraph.reset();
    this.polarGraph.reset();
  }
}

vectorAddition.register( 'Explore2DModel', Explore2DModel );