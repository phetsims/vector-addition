// Copyright 2019, University of Colorado Boulder

/**
 * Grid check box (indicated by a grid icon), used to control visibility of the grid
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // constants
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  class GridCheckbox extends Checkbox {
    /**
     * @constructor
     * @param {BooleanProperty} gridVisibleProperty
     */
    constructor( gridVisibleProperty ) {

      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );

      super( VectorAdditionIconFactory.createGridIcon(), gridVisibleProperty, CHECKBOX_OPTIONS );
    }
  }

  return vectorAddition.register( 'GridCheckbox', GridCheckbox );
} );