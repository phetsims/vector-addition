// Copyright 2019, University of Colorado Boulder

/**
 * View-specific Properties for the sim. Can be subtyped if necessary to add more properties.
 *
 * Responsibilities are:
 *  - values visibility
 *  - angle visibility
 *  - grid visibility
 *  - coordinate snap mode
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

  // constants
  const STARTING_COORDINATE_SNAP_MODE = CoordinateSnapModes.CARTESIAN;


  class VectorAdditionViewProperties {

    constructor() {

      // @public {BooleanProperty} valuesVisibleProperty - indicates if the labels should contain the magnitudes
      this.valuesVisibleProperty = new BooleanProperty( false );
      
      // @public {BooleanProperty} gridVisibleProperty - indicates if the graph background grid is visible
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {BooleanProperty} angleVisibleProperty  - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );

      // @public {EnumerationProperty.<CoordinateSnapModes>} coordinateSnapModeProperty - controls the snapping mode
      // for the vectors
      this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes, STARTING_COORDINATE_SNAP_MODE );
    }

    /**
     * Resets the view properties
     * @public
     */
    reset() {
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();
      this.coordinateSnapModeProperty.reset();
    }
  }

  return vectorAddition.register( 'VectorAdditionViewProperties', VectorAdditionViewProperties );
} );