// Copyright 2019, University of Colorado Boulder

/**
 * 'Angle' check box, used to control visibility of the angle node
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


  class AngleCheckbox extends Checkbox {
    /**
     * @constructor
     * @param {BooleanProperty} angleVisibleProperty
     * @param {VectorTypes} vectorType
     */
    constructor( angleVisibleProperty, vectorType ) {

      // Type check arguments
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super( new LayoutBox( {
        orientation: 'horizontal',
        spacing: ICON_SPACING,
        children: [
          VectorAdditionIconFactory.createAngleIcon()
        ]
      } ), angleVisibleProperty );
    }

  }

  return vectorAddition.register( 'AngleCheckbox', AngleCheckbox );
} );