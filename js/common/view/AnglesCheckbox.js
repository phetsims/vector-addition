// Copyright 2019, University of Colorado Boulder

/**
 * AnglesCheckbox is the checkbox labeled with an angle icon, used to control visibility of angles on vectors.
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
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class AnglesCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} anglesVisibleProperty
     * @param {Object} [options]
     */
    constructor( anglesVisibleProperty, options ) {

      options =   merge( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, options );

      const content = VectorAdditionIconFactory.createAngleIcon();

      super( content, anglesVisibleProperty, options );
    }
  }

  return vectorAddition.register( 'AnglesCheckbox', AnglesCheckbox );
} );