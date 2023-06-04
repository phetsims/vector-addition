// Copyright 2019-2023, University of Colorado Boulder

/**
 * ArrowOverSymbolNode is a symbol with a vector arrow centered above it.
 * Origin is at the lower left of the symbol's baseline.
 *
 * NOTE: I would have preferred to call this VectorSymbolNode, but that name was already taken.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import { Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

// const
const DEFAULT_FONT = new MathSymbolFont( 18 );

type SelfOptions = {
  font?: PhetFont;
  spacing?: number; // vertical spacing between arrow and symbol
  arrowScale?: number;
};

type ArrowOverSymbolNodeOptions = SelfOptions & PickOptional<NodeOptions, 'maxWidth'>;

export default class ArrowOverSymbolNode extends Node {

  private readonly symbolNode: Text;
  private readonly rightArrowNode: Node;
  private readonly spacing: number;

  public constructor( symbol: string, providedOptions?: ArrowOverSymbolNodeOptions ) {

    const options = optionize<ArrowOverSymbolNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      font: DEFAULT_FONT,
      spacing: 3, // vertical spacing between arrow and symbol
      arrowScale: 0.65
    }, providedOptions );

    const symbolNode = new Text( symbol, {
      font: options.font,
      boundsMethod: 'accurate' // so that options.spacing is effective
    } );

    const rightArrowNode = new Text( '\u2192', {
      font: options.font,
      boundsMethod: 'accurate', // so that options.spacing is effective
      scale: options.arrowScale
    } );

    options.children = [ symbolNode, rightArrowNode ];

    super( options );

    this.symbolNode = symbolNode;
    this.rightArrowNode = rightArrowNode;
    this.spacing = options.spacing;

    this.updateLayout();
  }

  /**
   * Changes the symbol.
   */
  public setSymbol( symbol: string ): void {
    this.symbolNode.string = symbol;
    this.updateLayout();
  }

  private updateLayout(): void {

    // Reposition the arrow
    this.rightArrowNode.centerX = this.symbolNode.centerX;
    this.rightArrowNode.bottom = this.symbolNode.top - this.spacing;
  }
}

vectorAddition.register( 'ArrowOverSymbolNode', ArrowOverSymbolNode );