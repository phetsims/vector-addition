// Copyright 2019, University of Colorado Boulder

/**
 * 'Sum' check box, used to control visibility of the sum vector
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // strings
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  // constants
  const TEXT_OPTIONS = {
    font: VectorAdditionConstants.PANEL_FONT
  };
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  class ValuesCheckbox extends Checkbox {
    /**
     * @constructor
     * @param {BooleanProperty} valuesVisibleProperty
     */
    constructor( valuesVisibleProperty ) {

      // Type check arguments
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super( new Text( valuesString, TEXT_OPTIONS ), valuesVisibleProperty, CHECKBOX_OPTIONS );
    }
  }

  return vectorAddition.register( 'ValuesCheckbox', ValuesCheckbox );
} );