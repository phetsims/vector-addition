// Copyright 2019, University of Colorado Boulder

/**
 * View for the label 'next' to a vector.
 *
 * ## Scenery:
 *  - background rectangle
 *  - text nodes and/or formula nodes of the label content
 *     - See https://user-images.githubusercontent.com/42391580/61661427-433bcb80-ac89-11e9-8681-d6147763e142.png
 *
 * ## API:
 *  - Meant to be a static view, but the content (coefficient, symbol, and value) can be changed with methods
 *
 *  - NOT meant to depend on a RootVector. In other words, this WILL NOT update its content to match a Vector (In fact,
 *    it isn't even necessary to instantiate a RootVector to generate this view. This is how the Icon Factory creates
 *    label nodes without instantiating a Vector for the screen icons).
 *        - However, since this view contains methods to change the content, links can be made
 *           to a RootVector EXTERNALLY to match the vector's symbol, coefficient, and value
 *
 *  - This view is NOT responsible for any positioning other than the internal text nodes / formula nodes
 *    (for instance if it is desirable to put the label node under a vector node, it must be done externally).
 *
 *  - Contains method to change if the label is part of a active vector (which uses a yellow label) or not.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  //----------------------------------------------------------------------------------------
  // constants

  // background color of the label when the label is active
  const ACTIVE_VECTOR_LABEL_BACKGROUND = VectorAdditionColors.ACTIVE_VECTOR_LABEL_BACKGROUND;

  // options for the background rectangle
  const BACKGROUND_RECTANGLE_OPTIONS = {
    opacity: 0.75,
    cornerRadius: 4
  };

  // options for text node instances
  const TEXT_OPTIONS = {
    font: new PhetFont( { size: 12.5, fontWeight: 800 } ),
    boundsMethod: 'accurate'
  };

  // scale resize of the formula node to match the font size above
  const FORMULA_NODE_SCALE = 0.67;


  class VectorLabel extends Node {

    /**
     * @param {string|null} coefficient - coefficient of the label. 'null' means to not display a coefficient
     * @param {string|null} symbol - symbol of the label. 'null' means to not display a symbol
     * @param {string|null} value - value of the label. 'null' means to not display a value
     * @param {VectorColorGroups} vectorColorGroup - color group of the label
     * @param {boolean} isActive - indicates if the label is part of an active vector
     * @param {Object} [options]
     */
    constructor( coefficient, symbol, value, vectorColorGroup, isActive, options ) {

      assert && assert( typeof coefficient === 'string' || !coefficient, `invalid coefficient: ${coefficient}` );
      assert && assert( typeof symbol === 'string' || !symbol, `invalid symbol: ${symbol}` );
      assert && assert( typeof value === 'string' || !value, `invalid value: ${value}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup ),
        `invalid vectorColorGroup: ${vectorColorGroup}` );
      assert && assert( typeof isActive === 'boolean', `invalid isActive: ${isActive}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {

        xMargin: 4, // {number} horizontal margin of the rectangle
        yMargin: 2 // {number} vertical margin of the rectangle

      }, options );

      super();

      //----------------------------------------------------------------------------------------
      // Create Private references
      //----------------------------------------------------------------------------------------

      // @private {null|string} coefficient - coefficient of the label
      this.coefficient = coefficient;

      // @private {null|string} symbol - symbol of the label
      this.symbol = symbol;

      // @private {null|string} value - value of the label
      this.value = value;

      // @private {boolean} isActive - flag that indicates if the label is the label of an active vector
      this.isActive = isActive;

      //----------------------------------------------------------------------------------------
      // Scenery (https://user-images.githubusercontent.com/42391580/61661427-433bcb80-ac89-11e9-8681-d6147763e142.png)
      //----------------------------------------------------------------------------------------

      // @private {Rectangle} background - the background rectangle, set as an arbitrary rectangle for now
      const backgroundRectangle = new Rectangle( 0, 0, 1, 1, BACKGROUND_RECTANGLE_OPTIONS );
  
      // @private {HBox} vectorContentContainer - container of the content of the label
      const vectorContentContainer = new HBox( { spacing: 0, align: 'center' } );

      // @private {Text} coefficientLabel - text node for the coefficient
      const coefficientLabel = new Text( '', TEXT_OPTIONS );

      // @private {FormulaNode} symbolLabel - formula node for the symbol
      const symbolLabel = new FormulaNode( '', { scale: FORMULA_NODE_SCALE } );

      // @private {Text} valueLabel - text node for the value
      const valueLabel = new Text( '', TEXT_OPTIONS );

      // Layout
      this.setChildren( [ backgroundRectangle, vectorContentContainer ] );

      //----------------------------------------------------------------------------------------
      this.updateLabel = () => {
        // Update labels
        coefficientLabel.setText( this.coefficient ? this.coefficient : '' );
        symbolLabel.setFormula( this.symbol ? `\\vec{\\mathrm{${this.symbol}}\}` : '' );
        valueLabel.setVisible( this.value !== null ).setText( this.value ? this.value : '' );
        
        const content = [ coefficientLabel, symbolLabel, valueLabel ].filter( label => label.visible );

        // Update the content Container
        vectorContentContainer.setChildren( content );

        backgroundRectangle.visible = coefficientLabel.visible || symbolLabel.visible || valueLabel.visible;
        
        //----------------------------------------------------------------------------------------
        // Update the background
        if ( backgroundRectangle.visible ) {

          backgroundRectangle.fill = !this.isActive ? VectorAdditionColors[ vectorColorGroup ].labelBackground : ACTIVE_VECTOR_LABEL_BACKGROUND;

          // Set the background size
          backgroundRectangle.setRectWidth( vectorContentContainer.getBounds().width + 2 * options.xMargin );
          backgroundRectangle.setRectHeight( vectorContentContainer.getBounds().height + 2 * options.yMargin );
          backgroundRectangle.center = vectorContentContainer.center;
        }
      };
      this.updateLabel();

    }

    /**
     * Sets the coefficient and updates the label
     * @public
     *
     * @param {number|null} coefficient
     */
    setCoefficient( coefficient ) {

      this.coefficient = coefficient;
      this.updateLabel();
    }


    /**
     * Sets the symbol and updates the label
     * @public
     *
     * @param {string|null} symbol
     */
    setSymbol( symbol ) {
      this.symbol = symbol;
      this.updateLabel();
    }

    setIsActive( isActive ) {
      this.isActive = isActive;
      this.updateLabel();
    }

    setValue( value ) {
      this.value = value;
      this.updateLabel();
    }


  }

  return vectorAddition.register( 'VectorLabel', VectorLabel );
} );