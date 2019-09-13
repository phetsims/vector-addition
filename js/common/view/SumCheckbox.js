// Copyright 2019, University of Colorado Boulder

/**
 * SumCheckbox is the checkbox labeled 'Sum', used to control visibility of a sum vector.
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
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // strings
  const sumString = require( 'string!VECTOR_ADDITION/sum' );

  class SumCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} sumVisibleProperty
     * @param {VectorColorPalette} vectorColorPalette
     */
    constructor( sumVisibleProperty, vectorColorPalette ) {

      // Type check arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette,
        `invalid vectorColorPalette: ${vectorColorPalette}` );

      const textNode = new Text( sumString, {
        font: VectorAdditionConstants.CHECKBOX_FONT,
        maxWidth: 95 // determined empirically
      } );

      const icon = VectorAdditionIconFactory.createVectorIcon( {
        fill: vectorColorPalette.sumFill,
        stroke: vectorColorPalette.sumStroke
      } );

      const content = new LayoutBox( {
        orientation: 'horizontal',
        spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
        children: [ textNode, icon ]
      } );

      super( content, sumVisibleProperty, VectorAdditionConstants.CHECKBOX_OPTIONS );
    }
  }

  return vectorAddition.register( 'SumCheckbox', SumCheckbox );
} );