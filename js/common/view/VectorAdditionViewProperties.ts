// Copyright 2019-2025, University of Colorado Boulder

/**
 * View-specific Properties for the sim. Can be subclassed to add more Properties.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import CoordinateSnapMode from '../model/CoordinateSnapMode.js';

export default class VectorAdditionViewProperties {

  // indicates if the labels should contain the magnitudes
  public readonly valuesVisibleProperty: Property<boolean>;

  // controls the visibility of the angle
  public readonly anglesVisibleProperty: Property<boolean>;

  // indicates if the graph background grid is visible
  public readonly gridVisibleProperty: Property<boolean>;

  // controls the snapping mode for the vectors
  public readonly coordinateSnapModeProperty: EnumerationProperty<CoordinateSnapMode>;

  // whether the VectorValuesToggleBox is expanded
  public readonly vectorValuesExpandedProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.valuesVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' )
    } );

    this.anglesVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'anglesVisibleProperty' )
    } );

    this.gridVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'gridVisibleProperty' )
    } );

    this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapMode.CARTESIAN, {
      tandem: tandem.createTandem( 'coordinateSnapModeProperty' )
    } );

    this.vectorValuesExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'vectorValuesExpandedProperty' )
    } );
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