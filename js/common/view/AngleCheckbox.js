// Copyright 2019, University of Colorado Boulder

/**
 * View for the Angle Visibility check box (indicated by the wedge shaped icon), used to control visibility of the angle
 * underneath/above vectors.
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

  class AngleCheckbox extends Checkbox {
    /**
     * @constructor
     * @param {BooleanProperty} angleVisibleProperty
     * @param {Object} [options]
     */
    constructor( angleVisibleProperty, options ) {

      // Type check arguments
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( CHECKBOX_OPTIONS, options );

      super( VectorAdditionIconFactory.createAngleIcon(), angleVisibleProperty, options );
    }
  }

  return vectorAddition.register( 'AngleCheckbox', AngleCheckbox );
} );