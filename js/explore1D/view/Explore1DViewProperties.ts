// Copyright 2019-2025, University of Colorado Boulder

/**
 * View-specific Properties for the 'Explore 1D' screen.
 *
 * Extends VectorAdditionViewProperty but adds:
 *  - Graph Orientation Property
 *  - Disables coordinateSnapModeProperty and angle visible Property
 *
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class Explore1DViewProperties extends VectorAdditionViewProperties {

  public readonly graphOrientationProperty: EnumerationProperty<GraphOrientations>;

  public constructor( tandem: Tandem ) {

    super( tandem );

    this.graphOrientationProperty = new EnumerationProperty( GraphOrientations.HORIZONTAL, {
      tandem: tandem.createTandem( 'graphOrientationProperty' )
    } );

    // Vector angle visualization is not supported by this screen.
    // unlink is unnecessary, exists for the lifetime of the sim.
    assert && this.anglesVisibleProperty.link( angleVisible => {
      if ( angleVisible ) {
        assert && assert( false, 'Explore 1D does not support angles' );
      }
    } );

    // Polar snap mode is not supported by this screen.
    // unlink is unnecessary, exists for the lifetime of the sim.
    assert && this.coordinateSnapModeProperty.link( coordinateSnapMode => {
      if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
        assert && assert( false, 'Explore 1D does not support polar snap mode' );
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.graphOrientationProperty.reset();
  }
}

vectorAddition.register( 'Explore1DViewProperties', Explore1DViewProperties );