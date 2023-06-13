// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorSymbolNode is responsible for displaying vector symbols in a variety of forms.
 *
 * The symbol includes zero or more of the following, all of which can be mutated:
 *  - vector symbol, e.g. 'a'
 *  - arrow over the vector symbol
 *  - absolute value bars, to indicate magnitude, e.g. |a|
 *  - coefficient
 *
 * For instance, the vector 'a' could have a symbol of '|-3a|'. This can be achieved with this combination of
 * options:
 *
 * {
 *   symbol: 'a',
 *   coefficient: -3,
 *   showVectorArrow: false,
 *   includeAbsoluteValueBars: true
 * }
 *
 * The coefficient is auto formatted. A coefficient of 1 is hidden, while a coefficient of -1 is displayed as
 * unary minus. E.g. if vector 'a' has the coefficient -1, the displayed symbol would be '-a'.
 *
 * @author Brandon Li
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { Font, HBox, HBoxOptions, RichText, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  symbol?: string | null; // optional symbol to display
  coefficient?: number | null; // optional coefficient to display
  showVectorArrow?: boolean; // flag to whether to show an arrow above the vector symbol
  includeAbsoluteValueBars?: boolean; // whether to surround with absolute value bars, to indicate 'magnitude'
  symbolFont?: Font; // font used for the vector symbol
  font?: Font; // font used for everything that is not a symbol
};

type VectorSymbolNodeOptions = SelfOptions & PickOptional<HBoxOptions, 'spacing' | 'maxWidth'>;

export default class VectorSymbolNode extends HBox {

  private symbol: string | null;
  private coefficient: number | null;
  private includeAbsoluteValueBars: boolean;
  private readonly updateVectorSymbolNode: () => void;

  public constructor( providedOptions?: VectorSymbolNodeOptions ) {

    const options = optionize<VectorSymbolNodeOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      symbol: null,
      coefficient: null,
      showVectorArrow: true,
      includeAbsoluteValueBars: false,
      symbolFont: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
      font: VectorAdditionConstants.EQUATION_FONT,

      // HBoxOptions
      align: 'origin', // so that text baselines are aligned
      spacing: 2 // {number} spacing of the text nodes / formula nodes

    }, providedOptions );

    super( options );

    this.symbol = options.symbol;
    this.coefficient = options.coefficient;
    this.includeAbsoluteValueBars = options.includeAbsoluteValueBars;

    // Create the pieces of the VectorSymbolNode. Values will be set later, and these
    // will be added as children as needed based on how the VectorSymbolNode is configured.
    const leftBar = new Text( '|', { font: options.font } );
    const rightBar = new Text( '|', { font: options.font } );
    const coefficientText = new Text( '', { font: options.font } );
    const symbolNode = options.showVectorArrow ?
                       new ArrowOverSymbolNode( '', { font: options.symbolFont } ) :
                       new RichText( '', { font: options.symbolFont } );

    this.updateVectorSymbolNode = () => {

      // Auto format the coefficient
      let coefficient = null;
      if ( this.coefficient === -1 ) {
        coefficient = MathSymbols.UNARY_MINUS;
      }
      else if ( this.coefficient !== 1 && this.coefficient !== null ) {
        coefficient = `${this.coefficient}`;
      }

      // Set the coefficient and symbol text to match our properties
      coefficient && coefficientText.setString( coefficient );
      if ( this.symbol ) {
        if ( symbolNode instanceof ArrowOverSymbolNode ) {
          symbolNode.setSymbol( this.symbol );
        }
        else {
          symbolNode.setString( this.symbol );
        }
      }

      // Add the pieces that are relevant for the current configuration.
      const children = [];
      this.includeAbsoluteValueBars && children.push( leftBar );
      coefficient && children.push( coefficientText );
      this.symbol && children.push( symbolNode );
      this.includeAbsoluteValueBars && children.push( rightBar );
      this.setChildren( children );

      // Set the visibility to true only if we have a child to display
      this.visible = ( children.length !== 0 );
    };

    // Update the vector symbol node
    this.updateVectorSymbolNode();
  }

  /**
   * Determines whether absolute value bars are displayed to indicate 'magnitude'.
   */
  public setIncludeAbsoluteValueBars( includeAbsoluteValueBars: boolean ): void {
    this.includeAbsoluteValueBars = includeAbsoluteValueBars;
    this.updateVectorSymbolNode();
  }

  /**
   * Sets the symbol.
   * @param symbol - the symbol to display. Null means no symbol is displayed.
   */
  public setSymbol( symbol: string | null ): void {
    this.symbol = symbol;
    this.updateVectorSymbolNode();
  }

  /**
   * Sets the coefficient.
   */
  public setCoefficient( coefficient: number | null ): void {
    this.coefficient = coefficient;
    this.updateVectorSymbolNode();
  }

  /**
   * Performance method that sets all the attributes of the VectorSymbolNode and does 1 update.
   * @param symbol - the symbol to display (See comment at the top of the file)
   * @param coefficient - the coefficient to display
   * @param includeAbsoluteValueBars - indicates if absolute value bars are there
   */
  public setVectorSymbolNode( symbol: string | null, coefficient: number | null, includeAbsoluteValueBars: boolean ): void {
    this.symbol = symbol;
    this.coefficient = coefficient;
    this.includeAbsoluteValueBars = includeAbsoluteValueBars;
    this.updateVectorSymbolNode();
  }
}

vectorAddition.register( 'VectorSymbolNode', VectorSymbolNode );