// Copyright 2019, University of Colorado Boulder

/**
 * VectorCheckbox is a checkbox that is labeled with a vector symbol and vector arrow.
 * It's used to control the visibility of the sum ('c' or 'f') vector in the Equation screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class VectorCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} vectorVisibleProperty
     * @param {string} symbol
     * @param {Object} [options]
     */
    constructor( vectorVisibleProperty, symbol, options ) {

      // Type check arguments
      assert && assert( vectorVisibleProperty instanceof BooleanProperty, `invalid vectorVisibleProperty: ${vectorVisibleProperty}` );
      assert && assert( typeof symbol === 'string', `invalid symbol: ${symbol}` );

      options = _.extend( {
        vectorFill: 'white',
        vectorStroke: 'black'
      }, options );

      const symbolNode = new FormulaNode( `\\vec{${symbol}\}`, {
        maxWidth: 95 // determined empirically
      } );

      const icon = VectorAdditionIconFactory.createVectorIcon( options.vectorFill, options.vectorStroke );

      const content = new LayoutBox( {
        orientation: 'horizontal',
        spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
        children: [ symbolNode, icon ]
      } );

      super( content, vectorVisibleProperty, VectorAdditionConstants.CHECKBOX_OPTIONS );
    }
  }

  return vectorAddition.register( 'VectorCheckbox', VectorCheckbox );
} );