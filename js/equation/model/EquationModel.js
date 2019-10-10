// Copyright 2019, University of Colorado Boulder

/**
 * EquationModel is the model for the 'Equation' screen.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationGraph = require( 'VECTOR_ADDITION/equation/model/EquationGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  class EquationModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );

      // @public
      this.sumVisibleProperty = new BooleanProperty( true );

      // @public (read-only) {VectorColorPalette}
      this.cartesianVectorColorPalette = VectorAdditionColors.EQUATION_BLUE_COLOR_PALETTE;
      this.polarVectorColorPalette = VectorAdditionColors.EQUATION_PURPLE_COLOR_PALETTE;

      // @public (read-only) graph for Cartesian snap mode
      this.cartesianGraph = new EquationGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        this.cartesianVectorColorPalette );

      // @public (read-only) graph for Polar snap mode
      this.polarGraph = new EquationGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        this.polarVectorColorPalette );
    }

    /**
     * Resets the EquationModel.
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

  return vectorAddition.register( 'EquationModel', EquationModel );
} );