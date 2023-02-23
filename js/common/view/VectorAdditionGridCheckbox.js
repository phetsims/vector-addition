// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorAdditionGridCheckbox is a specialization of common-code GridCheckbox, styled for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GridCheckbox from '../../../../scenery-phet/js/GridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class VectorAdditionGridCheckbox extends GridCheckbox {

  /**
   * @param {Property.<boolean>} gridVisibleProperty
   * @param {Object} [options]
   */
  constructor( gridVisibleProperty, options ) {

    options = merge( {
      boxWidth: VectorAdditionConstants.CHECKBOX_BOX_WIDTH,
      iconOptions: { size: 24 }
    }, options );

    super( gridVisibleProperty, options );

    this.touchArea = this.localBounds.dilatedXY( 5, 1 );
  }
}

vectorAddition.register( 'VectorAdditionGridCheckbox', VectorAdditionGridCheckbox );