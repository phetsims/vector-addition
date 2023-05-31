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

export default class LabModel extends VectorAdditionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    super( tandem );

    // @public visibility of the sum for the first vector set
    this.sumVisibleProperty1 = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );

    // @public visibility of the sum for the second vector set
    this.sumVisibleProperty2 = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );

    // @public (read-only) {VectorColorPalette}
    this.cartesianVectorColorPalette1 = VectorAdditionColors.BLUE_COLOR_PALETTE;
    this.cartesianVectorColorPalette2 = VectorAdditionColors.ORANGE_COLOR_PALETTE;
    this.polarVectorColorPalette1 = VectorAdditionColors.PINK_COLOR_PALETTE;
    this.polarVectorColorPalette2 = VectorAdditionColors.GREEN_COLOR_PALETTE;

    // @public (read-only) graph for Cartesian snap mode
    this.cartesianGraph = new LabGraph(
      CoordinateSnapModes.CARTESIAN,
      this.componentStyleProperty,
      this.sumVisibleProperty1,
      this.sumVisibleProperty2,
      this.cartesianVectorColorPalette1,
      this.cartesianVectorColorPalette2
    );

    // @public (read-only) graph for Polar snap mode
    this.polarGraph = new LabGraph(
      CoordinateSnapModes.POLAR,
      this.componentStyleProperty,
      this.sumVisibleProperty1,
      this.sumVisibleProperty2,
      this.polarVectorColorPalette1,
      this.polarVectorColorPalette2
    );
  }

  /**
   * Resets the LabModel.
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.sumVisibleProperty1.reset();
    this.sumVisibleProperty2.reset();
    this.cartesianGraph.reset();
    this.polarGraph.reset();
  }
}

vectorAddition.register( 'LabModel', LabModel );