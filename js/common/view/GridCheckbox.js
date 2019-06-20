// Copyright 2019, University of Colorado Boulder

/**
 * 'Grid' check box, used to control visibility of the grid
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


  class GridCheckbox extends Checkbox {
    /**
     * @constructor
     * @param {BooleanProperty} gridVisibleProperty
     */
    constructor( gridVisibleProperty ) {

      // Type check arguments
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super( new LayoutBox( {
        orientation: 'horizontal',
        spacing: CHECKBOX_LABEL_SPACING,
        children: [
          VectorAdditionIconFactory.createGridIcon()
        ]
      } ), gridVisibleProperty );

    }

  }

  return vectorAddition.register( 'GridCheckbox', GridCheckbox );
} );