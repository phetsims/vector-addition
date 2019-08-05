// Copyright 2019, University of Colorado Boulder

/**
 * Top level model for the 'Explore 2D' screen, which contains:
 *  - polar graph
 *  - cartesian graph
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Explore2DGraph = require( 'VECTOR_ADDITION/explore2D/model/Explore2DGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  class Explore2DModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {Graph} cartesianGraph
      this.cartesianGraph = new Explore2DGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        VectorColorGroups.COLOR_GROUP_1 );

      // @public (read-only) {Graph} polarGraph
      this.polarGraph = new Explore2DGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        VectorColorGroups.COLOR_GROUP_3 );
    }

    /**
     * Resets the Explore 2D Model. Called when the reset all button is clicked.
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

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );