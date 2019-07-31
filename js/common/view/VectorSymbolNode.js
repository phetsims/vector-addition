// Copyright 2019, University of Colorado Boulder

/**
 * View for the Vectors Symbol.
 *
 * Encapsulated Node for just a Vector Symbol that mixes FormulaNode and textNodes. It contains
 *  - Absolute value bars (text node)
 *  - A Coefficient (text node)
 *  - A vector symbol (formula node)
 *
 * For instance, the Vector 'a' could have a symbol node of '|-3a|'. This can be achieved by passing a symbol ('a'), a
 * coefficient (-3), and a boolean value representing if the absolute value bars are there (true in this case).
 *
 * Auto formats coefficients (e.g. if vector 'a' had the coefficients -1, the symbol node would display '-a').
 *
 * This is used in the 'Vector Values' panel to represent the magnitude number display and is also used in the
 * VectorLabel for the label of the vector.
 *
 * Contains methods to change the magnitude boolean value, the symbol, and the coefficient.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );

  class VectorSymbolNode extends HBox {

    /**
     * @param {string|null} symbol - the symbol to display (See comment at the top of the file)
     * @param {number|null} coefficient - the coefficient to display
     * @param {boolean} includeAbsoluteValueBars - indicates if absolute value bars are there
     * @param {Object} [options]
     */
    constructor( symbol, coefficient, includeAbsoluteValueBars, options ) {

      assert && assert( !symbol || typeof symbol === 'string', `invalid symbol: ${symbol}` );
      assert && assert( !coefficient || typeof coefficient === 'number', `invalid coefficient: ${coefficient}` );
      assert && assert( typeof includeAbsoluteValueBars === 'boolean',
        `invalid includeAbsoluteValueBars: ${includeAbsoluteValueBars}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = merge( {

        // {Object} passed to the coefficientText instance
        coefficientTextOptions: {
          font: new PhetFont( { size: 18, weight: 500, stretch: 'ultra-condensed' } )
        },

        // {Object} passed to the absoluteValueText instances
        absoluteValueTextOptions: {
          font: new PhetFont( { size: 18, weight: 100 } )
        },

        // {number} Formula Node should be scaled to match the size of the coefficient text.
        // Only used if options.useRichText is false
        formulaNodeScale: 1,

        // {number} spacing of the text nodes / formula nodes
        spacing: 2,

        // {boolean} flag to indicate if rich text should be used instead of a formula node.
        // NOTE: if true, a vector arrow will not be drawn
        useRichText: false,

        // {Object} passed to the rich text. Only used if options.useRichText is true
        richTextFont: new MathSymbolFont( { size: 20, weight: 500 } )

      }, options || {} );

      super( { spacing: options.spacing } );

      //----------------------------------------------------------------------------------------
      // Create private references

      // @private {boolean} includeAbsoluteValueBars
      this.includeAbsoluteValueBars = includeAbsoluteValueBars;

      // @private {number|null} coefficient
      this.coefficient = coefficient;

      // @private {String|null} symbol
      this.symbol = symbol;

      //----------------------------------------------------------------------------------------
      // Create arbitrary nodes that represent the content of the symbol node, to be set later.
      const leftBar = new Text( '|', options.absoluteValueTextOptions );

      const rightBar = new Text( '|', options.absoluteValueTextOptions );

      const symbolNode = options.useRichText ? new RichText( '' ).setFont( options.richTextFont ) :
                         new FormulaNode( '', { scale: options.formulaNodeScale } );

      const coefficientText = new Text( '', options.coefficientTextOptions );

      //----------------------------------------------------------------------------------------
      // @private {function} updateVectorSymbolNode - function that updates the vector symbol node
      this.updateVectorSymbolNode = () => {

        // Auto format the coefficient
        let coefficient = null;
        if ( this.coefficient === -1 ) {
          coefficient = MathSymbols.UNARY_MINUS;
        }
        else if ( this.coefficient !== 1 && this.coefficient !== null ) {
          coefficient = `${this.coefficient}`;
        }

        //----------------------------------------------------------------------------------------
        // Set the coefficient and symbol text to match our properties
        coefficient && coefficientText.setText( coefficient );

        if ( this.symbol ) {
          symbolNode instanceof FormulaNode && symbolNode.setFormula( `\\vec{${this.symbol}\}` );
          symbolNode instanceof RichText && symbolNode.setText( this.symbol );
        }

        const children = [];

        //----------------------------------------------------------------------------------------
        // Reassign the children of the HBox
        this.includeAbsoluteValueBars && children.push( leftBar );

        coefficient && children.push( coefficientText );

        this.symbol && children.push( symbolNode );

        this.includeAbsoluteValueBars && children.push( rightBar );

        this.setChildren( children );

        // Set the visibility to true only if we have a child to display
        this.visible = children.length !== 0;
      };

      // Update the vector symbol node
      this.updateVectorSymbolNode();
    }

    /**
     * Sets the 'Include Absolute Value Bars' flag (toggles if the absolute value bars are displayed).
     * @public
     *
     * @param {boolean} includeAbsoluteValueBars
     */
    setIncludeAbsoluteValueBars( includeAbsoluteValueBars ) {
      assert && assert( typeof includeAbsoluteValueBars === 'boolean', `invalid includeAbsoluteValueBars: ${includeAbsoluteValueBars}` );

      this.includeAbsoluteValueBars = includeAbsoluteValueBars;
      this.updateVectorSymbolNode();
    }

    /**
     * Sets the symbol string
     * @public
     *
     * @param {string|null} symbol - the symbol to display. Null means no symbol is displayed.
     */
    setSymbol( symbol ) {
      assert && assert( !symbol || typeof symbol === 'string', `invalid symbol: ${symbol}` );

      this.symbol = symbol;
      this.updateVectorSymbolNode();
    }

    /**
     * Sets the Coefficient to display. Will Auto format (e.g. if vector 'a' had the coefficients -1,
     * the symbol node would display '-a').
     * @public
     *
     * @param {number|null}
     */
    setCoefficient( coefficient ) {
      assert && assert( !coefficient || typeof coefficient === 'number', `invalid coefficient: ${coefficient}` );

      this.coefficient = coefficient;
      this.updateVectorSymbolNode();
    }

    /**
     * Performance method that sets all the attributes of the VectorSymbolNode.
     * @public
     *
     * @param {string|null} symbol - the symbol to display (See comment at the top of the file)
     * @param {number|null} coefficient - the coefficient to display
     * @param {boolean} includeAbsoluteValueBars - indicates if absolute value bars are there
     */
    setVectorSymbolNode( symbol, coefficient, includeAbsoluteValueBars ) {

      assert && assert( !symbol || typeof symbol === 'string', `invalid symbol: ${symbol}` );
      assert && assert( !coefficient || typeof coefficient === 'number', `invalid coefficient: ${coefficient}` );
      assert && assert( typeof includeAbsoluteValueBars === 'boolean', `invalid includeAbsoluteValueBars: ${includeAbsoluteValueBars}` );

      this.symbol = symbol;
      this.coefficient = coefficient;
      this.includeAbsoluteValueBars = includeAbsoluteValueBars;

      this.updateVectorSymbolNode();
    }
  }

  return vectorAddition.register( 'VectorSymbolNode', VectorSymbolNode );
} );
