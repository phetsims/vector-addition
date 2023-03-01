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

import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HBox, RichText, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';

export default class VectorSymbolNode extends HBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    //----------------------------------------------------------------------------------------

    options = merge( {

      // {string|null} optional symbol to display
      symbol: null,

      // {number|null} optional coefficient to display
      coefficient: null,

      // {boolean} flag to whether to show an arrow above the vector symbol
      showVectorArrow: true,

      // {boolean} whether to surround with absolute value bars, to indicate 'magnitude'
      includeAbsoluteValueBars: false,

      // {Font} font used for the vector symbol
      symbolFont: VectorAdditionConstants.EQUATION_SYMBOL_FONT,

      // {Font} font used for everything that is not a symbol
      font: VectorAdditionConstants.EQUATION_FONT,

      // HBox options
      align: 'origin', // so that text baselines are aligned
      spacing: 2 // {number} spacing of the text nodes / formula nodes

    }, options );

    assert && assert( typeof options.symbol === 'string' || options.symbol === null, `invalid symbol: ${options.symbol}` );
    assert && assert( typeof options.coefficient === 'number' || options.coefficient === null, `invalid coefficient: ${options.coefficient}` );

    super( options );

    // @private
    this.symbol = options.symbol;
    this.coefficient = options.coefficient;
    this.includeAbsoluteValueBars = options.includeAbsoluteValueBars;

    // Create all of the pieces of the VectorSymbolNode. Values will be set later, and these
    // will be added as children as needed based on how the VectorSymbolNode is configured.
    const leftBar = new Text( '|', { font: options.font } );
    const rightBar = new Text( '|', { font: options.font } );
    const coefficientText = new Text( '', { font: options.font } );
    const symbolNode = options.showVectorArrow ?
                       new ArrowOverSymbolNode( '', { font: options.symbolFont } ) :
                       new RichText( '', { font: options.symbolFont } );

    // @private function that updates the vector symbol node
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
        if ( options.showVectorArrow ) {
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
   * @public
   * @param {boolean} includeAbsoluteValueBars
   */
  setIncludeAbsoluteValueBars( includeAbsoluteValueBars ) {
    assert && assert( typeof includeAbsoluteValueBars === 'boolean', `invalid includeAbsoluteValueBars: ${includeAbsoluteValueBars}` );

    this.includeAbsoluteValueBars = includeAbsoluteValueBars;
    this.updateVectorSymbolNode();
  }

  /**
   * Sets the symbol.
   * @public
   * @param {string|null} symbol - the symbol to display. Null means no symbol is displayed.
   */
  setSymbol( symbol ) {
    assert && assert( typeof symbol === 'string' || symbol === null, `invalid symbol: ${symbol}` );

    this.symbol = symbol;
    this.updateVectorSymbolNode();
  }

  /**
   * Sets the coefficient.
   * @public
   * @param {number|null} coefficient
   */
  setCoefficient( coefficient ) {
    assert && assert( typeof coefficient === 'number' || coefficient === null, `invalid coefficient: ${coefficient}` );

    this.coefficient = coefficient;
    this.updateVectorSymbolNode();
  }

  /**
   * Performance method that sets all the attributes of the VectorSymbolNode and does 1 update.
   * @public
   * @param {string|null} symbol - the symbol to display (See comment at the top of the file)
   * @param {number|null} coefficient - the coefficient to display
   * @param {boolean} includeAbsoluteValueBars - indicates if absolute value bars are there
   */
  setVectorSymbolNode( symbol, coefficient, includeAbsoluteValueBars ) {
    assert && assert( typeof symbol === 'string' || symbol === null, `invalid symbol: ${symbol}` );
    assert && assert( typeof coefficient === 'number' || coefficient === null, `invalid coefficient: ${coefficient}` );
    assert && assert( typeof includeAbsoluteValueBars === 'boolean', `invalid includeAbsoluteValueBars: ${includeAbsoluteValueBars}` );

    this.symbol = symbol;
    this.coefficient = coefficient;
    this.includeAbsoluteValueBars = includeAbsoluteValueBars;

    this.updateVectorSymbolNode();
  }
}

vectorAddition.register( 'VectorSymbolNode', VectorSymbolNode );