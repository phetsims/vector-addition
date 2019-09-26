// Copyright 2019, University of Colorado Boulder

/**
 * View-specific Properties for the sim. Can be subclassed to add more Properties.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorAdditionViewProperties {

    constructor() {

      // @public indicates if the labels should contain the magnitudes
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public controls the visibility of the angle
      this.anglesVisibleProperty = new BooleanProperty( false );

      // @public indicates if the graph background grid is visible
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public controls the snapping mode for the vectors
      this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes, CoordinateSnapModes.CARTESIAN );

      // @public whether the VectorValuesToggleBox is expanded
      this.vectorValuesExpandedProperty = new BooleanProperty( true );
    }

    /**
     * Resets the view properties
     * @public
     */
    reset() {
      this.valuesVisibleProperty.reset();
      this.anglesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.coordinateSnapModeProperty.reset();
      this.vectorValuesExpandedProperty.reset();
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'VectorAdditionViewProperties are not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'VectorAdditionViewProperties', VectorAdditionViewProperties );
} );