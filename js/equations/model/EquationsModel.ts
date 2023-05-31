// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationsModel is the model for the 'Equations' screen.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorAdditionModel from '../../common/model/VectorAdditionModel.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsGraph from './EquationsGraph.js';

export default class EquationsModel extends VectorAdditionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    super( tandem );

    // @public
    this.sumVisibleProperty = new BooleanProperty( true );

    // @public (read-only) {VectorColorPalette}
    this.cartesianVectorColorPalette = VectorAdditionColors.EQUATIONS_BLUE_COLOR_PALETTE;
    this.polarVectorColorPalette = VectorAdditionColors.EQUATIONS_PINK_COLOR_PALETTE;

    // @public (read-only) graph for Cartesian snap mode
    this.cartesianGraph = new EquationsGraph( CoordinateSnapModes.CARTESIAN,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.cartesianVectorColorPalette
    );

    // @public (read-only) graph for Polar snap mode
    this.polarGraph = new EquationsGraph( CoordinateSnapModes.POLAR,
      this.componentStyleProperty,
      this.sumVisibleProperty,
      this.polarVectorColorPalette
    );
  }

  /**
   * Resets the EquationsModel.
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

vectorAddition.register( 'EquationsModel', EquationsModel );