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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Explore2DGraph = require( 'VECTOR_ADDITION/explore2D/model/Explore2DGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  class Explore2DModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );

      // @public Property controlling the visibility of the sum for both Graph instances
      this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );

      // @public (read-only) {Graph} cartesianGraph
      this.cartesianGraph = new Explore2DGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        VectorAdditionColors.VECTOR_COLOR_PALETTE_1 );

      // @public (read-only) {Graph} polarGraph
      this.polarGraph = new Explore2DGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        VectorAdditionColors.VECTOR_COLOR_PALETTE_3 );
    }

    /**
     * Resets the Explore 2D Model.
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

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );