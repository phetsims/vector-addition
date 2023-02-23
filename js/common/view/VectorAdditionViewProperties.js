// Copyright 2019-2023, University of Colorado Boulder

/**
 * View-specific Properties for the sim. Can be subclassed to add more Properties.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import vectorAddition from '../../vectorAddition.js';
import CoordinateSnapModes from '../model/CoordinateSnapModes.js';

export default class VectorAdditionViewProperties {

  constructor() {

    // @public indicates if the labels should contain the magnitudes
    this.valuesVisibleProperty = new BooleanProperty( false );

    // @public controls the visibility of the angle
    this.anglesVisibleProperty = new BooleanProperty( false );

    // @public indicates if the graph background grid is visible
    this.gridVisibleProperty = new BooleanProperty( true );

    // @public controls the snapping mode for the vectors
    this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes.CARTESIAN );

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

vectorAddition.register( 'VectorAdditionViewProperties', VectorAdditionViewProperties );