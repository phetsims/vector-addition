// Copyright 2019, University of Colorado Boulder

/**
 * 'Sum' check box, used to control visibility of the sum vector
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

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
     * @param {VectorSet} vectorSet
     */
    constructor( vectorSet ) {

      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      //----------------------------------------------------------------------------------------

      super( new LayoutBox( {
        orientation: 'horizontal',
        spacing: CHECKBOX_OPTIONS.spacing,
        children: [
          new Text( sumString, TEXT_OPTIONS ),
          VectorAdditionIconFactory.createSumIcon( vectorSet.vectorGroup )
        ]
      } ), vectorSet.sumVisibleProperty, CHECKBOX_OPTIONS );
    }
  }

  return vectorAddition.register( 'SumCheckbox', SumCheckbox );
} );