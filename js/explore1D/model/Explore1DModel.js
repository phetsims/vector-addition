// Copyright 2019, University of Colorado Boulder

/**
 * Top level model for the 'Explore 1D' screen, which contains:
 *  - polar graph
 *  - cartesian graph
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Explore1DGraph = require( 'VECTOR_ADDITION/explore1D/model/Explore1DGraph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  class Explore1DModel extends VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );

      // @public Property controlling the visibility of the sum for both Graph instances
      this.sumVisibleProperty = new BooleanProperty( VectorAdditionConstants.DEFAULT_SUM_VISIBLE );

      // @public (read-only) {VectorColorPalette}
      this.horizontalVectorColorPalette = VectorAdditionColors.EXPLORE_1D_BLUE_COLOR_PALETTE;
      this.verticalVectorColorPalette = VectorAdditionColors.EXPLORE_1D_BLUE_COLOR_PALETTE;

      // @public (read-only) {Graph}
      this.horizontalGraph = new Explore1DGraph( GraphOrientations.HORIZONTAL,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        this.horizontalVectorColorPalette );

      // @public (read-only) {Graph}
      this.verticalGraph = new Explore1DGraph( GraphOrientations.VERTICAL,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        this.verticalVectorColorPalette );
    }

    /**
     * Resets the Explore 1D Model.
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

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );