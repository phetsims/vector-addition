// Copyright 2019, University of Colorado Boulder

/**
 * BaseVectorsCheckbox is the checkbox used to control visibility of base vectors.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  class BaseVectorsCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} baseVectorsVisibleProperty
     * @param {VectorColorPalette} vectorColorPalette
     */
    constructor( baseVectorsVisibleProperty, vectorColorPalette ) {

      // Type check arguments
      assert && assert( baseVectorsVisibleProperty instanceof BooleanProperty, `invalid baseVectorsVisibleProperty: ${baseVectorsVisibleProperty}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

      const icon = VectorAdditionIconFactory.createVectorIcon( {
        fill: vectorColorPalette.baseVectorFill,
        stroke: vectorColorPalette.baseVectorStroke,
        lineWidth: VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS.lineWidth,
        length: 50
      } );

      super( icon, baseVectorsVisibleProperty, VectorAdditionConstants.CHECKBOX_OPTIONS );
    }
  }

  return vectorAddition.register( 'BaseVectorsCheckbox', BaseVectorsCheckbox );
} );