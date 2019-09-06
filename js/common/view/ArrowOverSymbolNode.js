// Copyright 2019, University of Colorado Boulder

/**
 * ArrowOverSymbolNode is a symbol with a vector arrow centered above it.
 * Origin is at the lower left of the symbol's baseline.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // const
  const DEFAULT_FONT = new MathSymbolFont( 18 );

  class ArrowOverSymbolNode extends Node {

    /**
     * @param {string} symbol
     * @param {Object} [options]
     */
    constructor( symbol, options ) {

      options = _.extend( {
        font: DEFAULT_FONT,
        spacing: 3,
        arrowScale: 0.65
      }, options );

      const symbolNode = new Text( symbol, {
        font: options.font,
        boundsMethod: 'accurate' // so that options.spacing is effective
      } );

      const rightArrowNode = new Text( '\u2192', {
        font: options.font,
        boundsMethod: 'accurate', // so that options.spacing is effective
        scale: options.arrowScale
      } );

      assert && assert( !options.children, 'ArrowOverSymbolNode sets children' );
      options.children = [ symbolNode, rightArrowNode ];

      super( options );

      // @private
      this.symbolNode = symbolNode;
      this.rightArrowNode = rightArrowNode;
      this.spacing = options.spacing;

      this.updateLayout();
    }

    /**
     * Changes the symbol.
     * @param {string} symbol
     */
    setSymbol( symbol ) {
      this.symbolNode.text = symbol;
      this.updateLayout();
    }

    /**
     * @private
     */
    updateLayout() {

      // Reposition the arrow
      this.rightArrowNode.centerX = this.symbolNode.centerX;
      this.rightArrowNode.bottom = this.symbolNode.top - this.spacing;
    }
  }

  return vectorAddition.register( 'ArrowOverSymbolNode', ArrowOverSymbolNode );
} );