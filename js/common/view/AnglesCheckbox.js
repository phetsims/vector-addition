// Copyright 2019, University of Colorado Boulder

/**
 * AnglesCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionCheckbox' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class AnglesCheckbox extends VectorAdditionCheckbox {

    /**
     * @param {Property.<boolean>} anglesVisibleProperty
     * @param {Object} [options]
     */
    constructor( anglesVisibleProperty, options ) {

      const content = VectorAdditionIconFactory.createAngleIcon();

      super( content, anglesVisibleProperty, options );
    }
  }

  return vectorAddition.register( 'AnglesCheckbox', AnglesCheckbox );
} );