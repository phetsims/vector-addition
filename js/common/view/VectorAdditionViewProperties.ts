// Copyright 2019-2024, University of Colorado Boulder

/**
 * View-specific Properties for the sim. Can be subclassed to add more Properties.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import vectorAddition from '../../vectorAddition.js';
import CoordinateSnapModes from '../model/CoordinateSnapModes.js';

export default class VectorAdditionViewProperties {

  // indicates if the labels should contain the magnitudes
  public readonly valuesVisibleProperty: Property<boolean>;

  // controls the visibility of the angle
  public readonly anglesVisibleProperty: Property<boolean>;

  // indicates if the graph background grid is visible
  public readonly gridVisibleProperty: Property<boolean>;

  // controls the snapping mode for the vectors
  public readonly coordinateSnapModeProperty: EnumerationProperty<CoordinateSnapModes>;

  // whether the VectorValuesToggleBox is expanded
  public readonly vectorValuesExpandedProperty: Property<boolean>;

  public constructor() {
    this.valuesVisibleProperty = new BooleanProperty( false );
    this.anglesVisibleProperty = new BooleanProperty( false );
    this.gridVisibleProperty = new BooleanProperty( true );
    this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes.CARTESIAN );
    this.vectorValuesExpandedProperty = new BooleanProperty( true );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    this.anglesVisibleProperty.reset();
    this.gridVisibleProperty.reset();
    this.coordinateSnapModeProperty.reset();
    this.vectorValuesExpandedProperty.reset();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

vectorAddition.register( 'VectorAdditionViewProperties', VectorAdditionViewProperties );