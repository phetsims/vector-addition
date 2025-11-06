// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DViewProperties is the set of view-specific Properties for the 'Explore 1D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';

export default class Explore1DViewProperties extends VectorAdditionViewProperties {

  // Whether the sum vector is visible. Shared by both scenes in this screen.
  public readonly sumVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( {
      anglesVisiblePropertyInstrumented: false,
      tandem: tandem
    } );

    this.sumVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'sumVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    this.sumVisibleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'Explore1DViewProperties', Explore1DViewProperties );