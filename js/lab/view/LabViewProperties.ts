// Copyright 2025, University of Colorado Boulder

/**
 * View-specific Properties for the 'Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class LabViewProperties extends VectorAdditionViewProperties {

  public constructor( tandem: Tandem ) {
    super( {
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'LabViewProperties', LabViewProperties );