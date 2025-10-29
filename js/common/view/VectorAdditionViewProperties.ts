// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionViewProperties is the base class for view-specific Properties for the sim. It contains Properties
 * that all screens have in common.
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

  // Indicates if the labels should contain the magnitudes. The reason why this is valuesVisibleProperty instead of
  // magnitudesVisibleProperty is noted in https://github.com/phetsims/vector-addition/issues/327#issuecomment-3299637646.
  public readonly valuesVisibleProperty: Property<boolean>;

  // controls the visibility of the angle
  public readonly anglesVisibleProperty: Property<boolean>;

  // indicates if the graph's grid is visible
  public readonly gridVisibleProperty: Property<boolean>;

  // whether the VectorValuesAccordionBox is expanded
  public readonly vectorValuesAccordionBoxExpandedProperty: Property<boolean>;

  protected constructor( providedOptions: VectorAdditionViewPropertiesOptions ) {

    const options = optionize<VectorAdditionViewPropertiesOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      anglesVisiblePropertyInstrumented: true
    }, providedOptions );

    this.valuesVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );

    this.anglesVisibleProperty = new BooleanProperty( false, {
      tandem: options.anglesVisiblePropertyInstrumented ?
              options.tandem.createTandem( 'anglesVisibleProperty' ) :
              Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    this.gridVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'gridVisibleProperty' ),
      phetioFeatured: true
    } );

    this.vectorValuesAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'vectorValuesAccordionBoxExpandedProperty' ),
      phetioFeatured: true
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