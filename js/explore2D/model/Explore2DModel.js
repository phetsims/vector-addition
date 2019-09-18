// Copyright 2019, University of Colorado Boulder

/**
 * Explore2DModel is the model for the 'Explore 2D' screen.
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

      // @public (read-only) {VectorColorPalette}
      this.cartesianVectorColorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;
      this.polarVectorColorPalette = VectorAdditionColors.PURPLE_COLOR_PALETTE;

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

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );