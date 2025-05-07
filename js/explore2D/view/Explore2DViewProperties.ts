// Copyright 2025, University of Colorado Boulder

/**
 * View-specific Properties for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class Explore2DViewProperties extends VectorAdditionViewProperties {

  public constructor( tandem: Tandem ) {
    super( {
      tandem: tandem
    } );
  }
}

vectorAddition.register( 'Explore2DViewProperties', Explore2DViewProperties );