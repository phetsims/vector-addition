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

import { GraphOrientation } from '../../common/model/GraphOrientation.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

export default class Explore1DViewProperties extends VectorAdditionViewProperties {

  public readonly graphOrientationProperty: StringUnionProperty<GraphOrientation>;

  public constructor( tandem: Tandem ) {

    super( {

      //TODO https://github.com/phetsims/vector-addition/issues/258 coordinateSnapModeProperty should not be instrumented for this screen.
      coordinateSnapModes: [ 'cartesian' ], // 'polar' is not supported in this screen
      tandem: tandem
    } );

    this.graphOrientationProperty = new StringUnionProperty<GraphOrientation>( 'horizontal', {
      validValues: [ 'horizontal', 'vertical' ],
      tandem: tandem.createTandem( 'graphOrientationProperty' )
    } );

    // Vector angle visualization is not supported by this screen.
    // unlink is unnecessary, exists for the lifetime of the sim.
    //TODO https://github.com/phetsims/vector-addition/issues/258 anglesVisibleProperty should not be instrumented for this screen.
    assert && this.anglesVisibleProperty.link( angleVisible => {
      if ( angleVisible ) {
        assert && assert( false, 'Explore 1D does not support angles' );
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.graphOrientationProperty.reset();
  }
}

vectorAddition.register( 'Explore1DViewProperties', Explore1DViewProperties );