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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );

  class LabModel extends VectorAdditionModel {

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
      this.cartesianVectorColorPalette1 = VectorAdditionColors.LAB_BLUE_COLOR_PALETTE;
      this.cartesianVectorColorPalette2 = VectorAdditionColors.LAB_RED_COLOR_PALETTE;
      this.polarVectorColorPalette1 = VectorAdditionColors.LAB_PURPLE_COLOR_PALETTE;
      this.polarVectorColorPalette2 = VectorAdditionColors.LAB_GREEN_COLOR_PALETTE;

      // @public (read-only) {Graph} cartesianGraph
      this.cartesianGraph = new LabGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        this.sumVisibleProperty1,
        this.sumVisibleProperty2,
        this.cartesianVectorColorPalette1,
        this.cartesianVectorColorPalette2 );

      // @public (read-only) {Graph} polarGraph
      this.polarGraph = new LabGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        this.sumVisibleProperty1,
        this.sumVisibleProperty2,
        this.polarVectorColorPalette1,
        this.polarVectorColorPalette2 );
    }

    /**
     * Resets the Lab Model.
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

  return vectorAddition.register( 'LabModel', LabModel );
} );