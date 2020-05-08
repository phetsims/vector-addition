// Copyright 2019-2020, University of Colorado Boulder

/**
 * ArrowOverSymbolNode is a symbol with a vector arrow centered above it.
 * Origin is at the lower left of the symbol's baseline.
 *
 * NOTE: I would have preferred to call this VectorSymbolNode, but that name was already taken.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';

// const
const DEFAULT_FONT = new MathSymbolFont( 18 );

class ArrowOverSymbolNode extends Node {

  /**
   * @param {string} symbol
   * @param {Object} [options]
   */
  constructor( symbol, options ) {

    options = merge( {
      font: DEFAULT_FONT,
      spacing: 3, // vertical spacing between arrow and symbol
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
   * @public
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

vectorAddition.register( 'ArrowOverSymbolNode', ArrowOverSymbolNode );
export default ArrowOverSymbolNode;