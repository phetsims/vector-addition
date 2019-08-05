// Copyright 2019, University of Colorado Boulder

/**
 * Top level model for the 'Lab' screen, which contains:
 *  - polar graph
 *  - cartesian graph
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );


  class LabModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {Graph} cartesianGraph
      this.cartesianGraph = new LabGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        VectorColorGroups.COLOR_GROUP_1,
        VectorColorGroups.COLOR_GROUP_2 );

      // @public (read-only) {Graph} polarGraph
      this.polarGraph = new LabGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        VectorColorGroups.COLOR_GROUP_3,
        VectorColorGroups.COLOR_GROUP_4 );
    }

    /**
     * Resets the Lab Model. Called when the reset all button is clicked.
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

  return vectorAddition.register( 'LabModel', LabModel );
} );