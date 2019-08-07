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
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  // constants
  const TEXT_OPTIONS = {
    font: VectorAdditionConstants.PANEL_FONT,
    maxWidth: 95
  };
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  // strings
  const sumString = require( 'string!VECTOR_ADDITION/sum' );

  class SumCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} sumVisibleProperty
     * @param {VectorColorGroups} vectorColorGroup
     */
    constructor( sumVisibleProperty, vectorColorGroup ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup ), `invalid vectorColorGroup: ${vectorColorGroup}` );

      //----------------------------------------------------------------------------------------

      const text = new Text( sumString, TEXT_OPTIONS );

      super( new LayoutBox( {
        orientation: 'horizontal',
        spacing: CHECKBOX_OPTIONS.spacing,
        children: [
          text,
          VectorAdditionIconFactory.createSumIcon( vectorColorGroup )
        ]
      } ), sumVisibleProperty, CHECKBOX_OPTIONS );

      // @public {Text} textNode
      this.textNode = text;

    }
  }

  return vectorAddition.register( 'SumCheckbox', SumCheckbox );
} );