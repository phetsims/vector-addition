// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'Angle' Visibility check box, used to control visibility of the angle underneath vectors.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // constants
  const CHECKBOX_LABEL_SPACING = VectorAdditionConstants.CHECKBOX_LABEL_SPACING;


  class AngleCheckbox extends Checkbox {
    /**
     * @constructor
     * @param {BooleanProperty} angleVisibleProperty
     * @param {Object} [options]
     * Create the angle visibility checkbox
     */
    constructor( angleVisibleProperty, options ) {

      // Type check arguments
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {
        spacing: CHECKBOX_LABEL_SPACING
      }, options );
      
      super( VectorAdditionIconFactory.createAngleIcon(), angleVisibleProperty, options );
   
    }

  }

  return vectorAddition.register( 'AngleCheckbox', AngleCheckbox );
} );