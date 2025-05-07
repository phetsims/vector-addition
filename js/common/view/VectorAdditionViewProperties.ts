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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  anglesVisiblePropertyInstrumented?: boolean;
};

export type VectorAdditionViewPropertiesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorAdditionViewProperties {

  // indicates if the labels should contain the magnitudes
  public readonly valuesVisibleProperty: Property<boolean>;

  // controls the visibility of the angle
  public readonly anglesVisibleProperty: Property<boolean>;

  // indicates if the graph's grid is visible
  public readonly gridVisibleProperty: Property<boolean>;

  // whether the VectorValuesAccordionBox is expanded
  public readonly vectorValuesAccordionBoxExpandedProperty: Property<boolean>;

  public constructor( providedOptions: VectorAdditionViewPropertiesOptions ) {

    const options = optionize<VectorAdditionViewPropertiesOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      anglesVisiblePropertyInstrumented: true
    }, providedOptions );

    this.valuesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' )
    } );

    this.anglesVisibleProperty = new BooleanProperty( false, {
      tandem: options.anglesVisiblePropertyInstrumented ?
              options.tandem.createTandem( 'anglesVisibleProperty' ) :
              Tandem.OPT_OUT
    } );

    this.gridVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'gridVisibleProperty' )
    } );

    this.vectorValuesAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'vectorValuesAccordionBoxExpandedProperty' )
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    this.anglesVisibleProperty.reset();
    this.gridVisibleProperty.reset();
    this.vectorValuesAccordionBoxExpandedProperty.reset();
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

vectorAddition.register( 'VectorAdditionViewProperties', VectorAdditionViewProperties );