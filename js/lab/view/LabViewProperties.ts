// Copyright 2025, University of Colorado Boulder

/**
 * View-specific Properties for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import { CoordinateSnapMode, CoordinateSnapModeValues } from '../../common/model/CoordinateSnapMode.js';

export default class LabViewProperties extends VectorAdditionViewProperties {

  // controls the snapping mode for the vectors
  public readonly coordinateSnapModeProperty: StringUnionProperty<CoordinateSnapMode>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem
    } );

    this.coordinateSnapModeProperty = new StringUnionProperty( 'cartesian', {
      validValues: CoordinateSnapModeValues,
      tandem: tandem.createTandem( 'coordinateSnapModeProperty' )
    } );
  }

  public override reset(): void {
    this.coordinateSnapModeProperty.reset();
    super.reset();
  }
}

vectorAddition.register( 'LabViewProperties', LabViewProperties );