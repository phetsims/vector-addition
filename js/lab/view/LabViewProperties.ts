// Copyright 2025, University of Colorado Boulder

/**
 * LabViewProperties is the set of view-specific Properties for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class LabViewProperties extends VectorAdditionViewProperties {

  // whether the sum vector for vector set 1 is visible
  public readonly sum1VisibleProperty: Property<boolean>;

  // whether the sum vector for vector set 2 is visible
  public readonly sum2VisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    super( {
      anglesVisiblePropertyInstrumented: false,
      tandem: tandem
    } );

    this.sum1VisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'sum1VisibleProperty' )
    } );

    this.sum2VisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'sum2VisibleProperty' )
    } );
  }

  public override reset(): void {
    this.sum1VisibleProperty.reset();
    this.sum2VisibleProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'LabViewProperties', LabViewProperties );