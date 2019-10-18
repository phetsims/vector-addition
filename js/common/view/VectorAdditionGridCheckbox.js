// Copyright 2019, University of Colorado Boulder

/**
 * VectorAdditionGridCheckbox is a specialization of common-code GridCheckbox, styled for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const GridCheckbox = require( 'SCENERY_PHET/GridCheckbox' );
  const merge = require( 'PHET_CORE/merge' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  class VectorAdditionGridCheckbox extends GridCheckbox {

    /**
     * @param {Property.<boolean>} gridVisibleProperty
     * @param {Object} [options]
     */
    constructor( gridVisibleProperty, options ) {

      options = merge( {
        boxWidth: VectorAdditionConstants.CHECKBOX_BOX_WIDTH,
        gridSize: 24
      }, options );

      super( gridVisibleProperty, options );

      this.touchArea = this.localBounds.dilatedXY( 5, 1 );
    }
  }

  return vectorAddition.register( 'VectorAdditionGridCheckbox', VectorAdditionGridCheckbox );
} );