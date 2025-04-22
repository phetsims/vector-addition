// Copyright 2019-2025, University of Colorado Boulder

/**
 * View-specific Properties for the sim. Can be subclassed to add more Properties.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import vectorAddition from '../../vectorAddition.js';
import { CoordinateSnapMode, CoordinateSnapModeValues } from '../model/CoordinateSnapMode.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  coordinateSnapModes?: CoordinateSnapMode[];
};

export type VectorAdditionViewPropertiesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorAdditionViewProperties {

  // indicates if the labels should contain the magnitudes
  public readonly valuesVisibleProperty: Property<boolean>;

  // controls the visibility of the angle
  public readonly anglesVisibleProperty: Property<boolean>;

  // indicates if the graph background grid is visible
  public readonly gridVisibleProperty: Property<boolean>;

  // controls the snapping mode for the vectors
  public readonly coordinateSnapModeProperty: StringUnionProperty<CoordinateSnapMode>;

  // whether the VectorValuesAccordionBox is expanded
  public readonly vectorValuesExpandedProperty: Property<boolean>;

  public constructor( providedOptions: VectorAdditionViewPropertiesOptions ) {

    const options = optionize<VectorAdditionViewPropertiesOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      coordinateSnapModes: [ ...CoordinateSnapModeValues ]
    }, providedOptions );

    this.valuesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' )
    } );

    this.anglesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'anglesVisibleProperty' )
    } );

    this.gridVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'gridVisibleProperty' )
    } );

    this.coordinateSnapModeProperty = new StringUnionProperty( 'cartesian', {
      validValues: options.coordinateSnapModes,
      tandem: options.tandem.createTandem( 'coordinateSnapModeProperty' )
    } );

    this.vectorValuesExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'vectorValuesExpandedProperty' )
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