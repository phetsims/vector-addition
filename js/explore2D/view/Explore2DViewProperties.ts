// Copyright 2025, University of Colorado Boulder

/**
 * Explore2DViewProperties is the set of Properties that are specific to the view for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';

export default class Explore2DViewProperties extends VectorAdditionViewProperties {

  // Whether the sum vector (s) is visible. Shared by both scenes in this screen.
  public readonly sumVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( {
      anglesVisiblePropertyInstrumented: false,
      tandem: tandem
    } );

    this.sumVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'sumVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the vector sum (s) is visible when it is defined.'
    } );
  }

  public override reset(): void {
    this.sumVisibleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'Explore2DViewProperties', Explore2DViewProperties );