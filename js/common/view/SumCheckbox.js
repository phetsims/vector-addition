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
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const TEXT_OPTIONS = {
    font: VectorAdditionConstants.PANEL_FONT
  };
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  // strings
  const sumString = require( 'string!VECTOR_ADDITION/sum' );

  class SumCheckbox extends Checkbox {
    /**
     * @constructor
     * @param {BooleanProperty} sumVisibleProperty
     * @param {VectorTypes} vectorType
     */
    constructor( sumVisibleProperty, vectorType ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorTypes.includes( vectorType ), `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      super( new LayoutBox( {
        orientation: 'horizontal',
        spacing: CHECKBOX_OPTIONS.spacing,
        children: [
          new Text( sumString, TEXT_OPTIONS ),
          VectorAdditionIconFactory.createSumIcon( vectorType )
        ]
      } ), sumVisibleProperty, CHECKBOX_OPTIONS );
    }

  }

  return vectorAddition.register( 'SumCheckbox', SumCheckbox );
} );