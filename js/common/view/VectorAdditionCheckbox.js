// Copyright 2019-2020, University of Colorado Boulder

/**
 * VectorAdditionCheckbox styles Checkbox for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';

class VectorAdditionCheckbox extends Checkbox {

  /**
   * @param {Node} content
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( content, property, options ) {

    options = merge( {
      boxWidth: VectorAdditionConstants.CHECKBOX_BOX_WIDTH,
      touchAreaXDilation: 5,
      touchAreaYDilation: 3.5
    }, options );

    super( content, property, options );

    this.touchArea = this.localBounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
  }
}

vectorAddition.register( 'VectorAdditionCheckbox', VectorAdditionCheckbox );
export default VectorAdditionCheckbox;