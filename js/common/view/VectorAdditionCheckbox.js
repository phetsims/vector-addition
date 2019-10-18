// Copyright 2019, University of Colorado Boulder

/**
 * VectorAdditionCheckbox styles Checkbox for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const merge = require( 'PHET_CORE/merge' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

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

  return vectorAddition.register( 'VectorAdditionCheckbox', VectorAdditionCheckbox );
} );