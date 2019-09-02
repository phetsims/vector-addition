// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 'Equation' screen, which contains:
 * - cartesian graph
 * - polar graph
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

      // @public (read-only) {graph} cartesianGraph
      this.cartesianGraph = new EquationGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        VectorAdditionColors.VECTOR_COLOR_PALETTE_1 );

      // @public (read-only) {graph} polarGraph
      this.polarGraph = new EquationGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        VectorAdditionColors.VECTOR_COLOR_PALETTE_3 );
    }

    /**
     * Resets the Equation Model. Called when the reset all button is clicked.
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