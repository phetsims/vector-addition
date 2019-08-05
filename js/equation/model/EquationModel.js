// Copyright 2019, University of Colorado Boulder

/**
 * Model for the 'Equation' screen, which contains:
 *  - polar graph
 *  - cartesian graph
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationGraph = require( 'VECTOR_ADDITION/equation/model/EquationGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  class EquationModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );

      //----------------------------------------------------------------------------------------
      // @public (read-only) {graph} polarGraph
      this.polarGraph = new EquationGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        VectorColorGroups.COLOR_GROUP_3 );

      // @public (read-only) {graph} cartesianGraph
      this.cartesianGraph = new EquationGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        VectorColorGroups.COLOR_GROUP_1 );
    }

    /**
     * Resets the Equation Model. Called when the reset all button is clicked.
     * @public
     *
     * @override
     */
    reset() {
      this.cartesianGraph.reset();
      this.polarGraph.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );