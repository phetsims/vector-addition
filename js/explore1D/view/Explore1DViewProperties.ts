// Copyright 2019-2025, University of Colorado Boulder

/**
 * View-specific Properties for the 'Explore 1D' screen.
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
      anglesVisiblePropertyInstrumented: false,
      tandem: tandem
    } );

    this.graphOrientationProperty = new StringUnionProperty<GraphOrientation>( 'horizontal', {
      validValues: [ 'horizontal', 'vertical' ],
      tandem: tandem.createTandem( 'graphOrientationProperty' )
    } );
  }

  public override reset(): void {
    this.graphOrientationProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'Explore1DViewProperties', Explore1DViewProperties );