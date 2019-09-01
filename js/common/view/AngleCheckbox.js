// Copyright 2019, University of Colorado Boulder

/**
 * AngleCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class AngleCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} angleVisibleProperty
     * @param {Object} [options]
     */
    constructor( angleVisibleProperty, options ) {

      options = _.extend( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, options );

      const content = VectorAdditionIconFactory.createAngleIcon();

      super( content, angleVisibleProperty, options );
    }
  }

  return vectorAddition.register( 'AngleCheckbox', AngleCheckbox );
} );