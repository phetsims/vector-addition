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
  const ICON_SPACING = VectorAdditionConstants.ICON_SPACING;


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
        spacing: ICON_SPACING,
        children: [
          VectorAdditionIconFactory.createGridIcon()
        ]
      } ), gridVisibleProperty );

    }

  }

  return vectorAddition.register( 'GridCheckbox', GridCheckbox );
} );