// Copyright 2025, University of Colorado Boulder

/**
 * ExploreViewProperties is the set of Properties that are specific to the view for the 'Explore 1D' and 'Explore 2D' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionViewProperties, { VectorAdditionViewPropertiesOptions } from './VectorAdditionViewProperties.js';

type SelfOptions = EmptySelfOptions;

type ExploreViewPropertiesOptions = SelfOptions & VectorAdditionViewPropertiesOptions;

export default class ExploreViewProperties extends VectorAdditionViewProperties {

  // Whether the sum vector (s) is visible. Shared by both scenes in this screen.
  public readonly sumVisibleProperty: Property<boolean>;

  public constructor( providedOptions: ExploreViewPropertiesOptions ) {

    const options = providedOptions;

    super( options );

    this.sumVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'sumVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the vector sum (s) is visible when it is defined.'
    } );
  }

  public override reset(): void {
    this.sumVisibleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'ExploreViewProperties', ExploreViewProperties );