// Copyright 2019, University of Colorado Boulder

/**
 * VectorCheckbox is a checkbox that is labeled with a vector symbol and vector arrow.
 * It's used to control the visibility of the sum ('c' or 'f') vector in the Equations screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowOverSymbolNode = require( 'VECTOR_ADDITION/common/view/ArrowOverSymbolNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const merge = require( 'PHET_CORE/merge' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionCheckbox' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  class VectorCheckbox extends VectorAdditionCheckbox {

    /**
     * @param {BooleanProperty} vectorVisibleProperty
     * @param {string} symbol
     * @param {Object} [options]
     */
    constructor( vectorVisibleProperty, symbol, options ) {

      // Type check arguments
      assert && assert( vectorVisibleProperty instanceof BooleanProperty, `invalid vectorVisibleProperty: ${vectorVisibleProperty}` );
      assert && assert( typeof symbol === 'string', `invalid symbol: ${symbol}` );

      options = merge( {
        vectorFill: Color.WHITE,
        vectorStroke: Color.BLACK
      }, options );

      const symbolNode = new ArrowOverSymbolNode( symbol, {
        maxWidth: 95 // determined empirically
      } );

      const icon = VectorAdditionIconFactory.createVectorIcon( {
        fill: options.vectorFill,
        stroke: options.vectorStroke,
        length: 35
      } );

      const content = new LayoutBox( {
        orientation: 'horizontal',
        spacing: VectorAdditionConstants.CHECKBOX_ICON_SPACING,
        children: [ symbolNode, icon ]
      } );

      super( content, vectorVisibleProperty, options );
    }
  }

  return vectorAddition.register( 'VectorCheckbox', VectorCheckbox );
} );