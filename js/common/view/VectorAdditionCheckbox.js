// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorAdditionCheckbox styles Checkbox for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

export default class VectorAdditionCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} property
   * @param {Node} content
   * @param {Object} [options]
   */
  constructor( property, content, options ) {

    options = merge( {
      boxWidth: VectorAdditionConstants.CHECKBOX_BOX_WIDTH,
      touchAreaXDilation: 5,
      touchAreaYDilation: 3.5
    }, options );

    super( property, content, options );

    this.touchArea = this.localBounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
  }
}

vectorAddition.register( 'VectorAdditionCheckbox', VectorAdditionCheckbox );