// Copyright 2019, University of Colorado Boulder

/**
 * ValuesCheckbox is the checkbox labeled 'Values', used to control visibility of values on vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const merge = require( 'PHET_CORE/merge' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // strings
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  class ValuesCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( valuesVisibleProperty, options ) {

      options = merge( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, options );

      const content = new Text( valuesString, {
        font: VectorAdditionConstants.CHECKBOX_FONT,
        maxWidth: 116 // determined empirically
      } );

      super( content, valuesVisibleProperty, options );
    }
  }

  return vectorAddition.register( 'ValuesCheckbox', ValuesCheckbox );
} );