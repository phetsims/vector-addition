// Copyright 2019, University of Colorado Boulder

/**
 * View for the vector symbol. See https://github.com/phetsims/vector-addition/issues/47 for context.
 *
 * This is a node for a vector symbol, taking in a label and an option to have magnitude bars around it.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants

  const ARROW_SYMBOL_LENGTH = 9;

  // spacing between the arrow and the label
  const ARROW_LABEL_SPACING = 0.3;

  const ARROW_OPTIONS = {
    lineWidth: 0,
    tailWidth: 0.8,
    headWidth: 5,
    headHeight: 3.5
  };

  const MAGNITUDE_BARS_LENGTH = 14;

  // spacing between the magnitude bars and the label (only if includeMagnitudeBars is true)
  const MAGNITUDE_BARS_SPACING = 3;

  const MAGNITUDE_BARS_OPTIONS = {
    lineWidth: 0.6,
    stroke: 'black'
  };

  class VectorSymbolNode extends Node {
    /**
     * @constructor
     * @param {string} label - the vector label
     * @param {Object} [options]
     */
    constructor( label, options ) {

      options = _.extend( {

        // {boolean} true means to include | | around the label
        includeMagnitudeBars: false,

        // {Object} options passed to the text, see below for defaults
        textOptions: null
      }, options );

      options.textOptions = _.extend( {
        font: new PhetFont( {
          family: 'Times'
        } ),
        fontSize: 15,
        fontWeight: 500
      }, options.textOptions );

      assert && assert( typeof label === 'string', `invalid label: ${label}` );
      assert && assert( typeof options.includeMagnitudeBars === 'boolean',
        `invalid options.includeMagnitudeBars: ${options.includeMagnitudeBars}` );

      //----------------------------------------------------------------------------------------

      super( options );

      // @private {boolean}
      this.includeMagnitudeBars = options.includeMagnitudeBars;

      // @private {ArrowNode}
      this.vectorSymbolArrow = new ArrowNode( 0, 0, ARROW_SYMBOL_LENGTH, 0, ARROW_OPTIONS );

      // @private {Text}
      this.labelNode = new Text( label, options.textOptions );
      this.labelNode.setBoundsMethod( 'accurate' );

      //----------------------------------------------------------------------------------------

      if ( options.includeMagnitudeBars ) {
        // @private {Line}
        this.leftLine = new Line( 0, 0, 0, MAGNITUDE_BARS_LENGTH, MAGNITUDE_BARS_OPTIONS );

        // @private {Line}
        this.rightLine = new Line( 0, 0, 0, MAGNITUDE_BARS_LENGTH, MAGNITUDE_BARS_OPTIONS );

        this.setChildren( [
          this.leftLine,
          this.labelNode,
          this.vectorSymbolArrow,
          this.rightLine ] );
      }
      else {
        this.setChildren( [
          this.labelNode,
          this.vectorSymbolArrow ] );
      }

      this.label = label;
    }
    /**
     * Sets the label text
     * @param {string} label - the new label
     * @public
     */
    set label( label ) {

      assert && assert( typeof label === 'string', `invalid label: ${label}` );
      this.labelNode.setText( label );

      this.labelNode.invalidateText();

      // Layout the nodes
      this.labelNode.bottom = 0;
      this.vectorSymbolArrow.bottom = -this.labelNode.height - ARROW_LABEL_SPACING;
      this.vectorSymbolArrow.centerX = this.centerX;
      this.labelNode.centerX = this.centerX;

      if ( this.includeMagnitudeBars ) {
        this.leftLine.left = this.labelNode.left - MAGNITUDE_BARS_SPACING;
        this.rightLine.right = this.labelNode.right + MAGNITUDE_BARS_SPACING;

        this.leftLine.centerY = this.labelNode.centerY;
        this.rightLine.centerY = this.labelNode.centerY;
      }
    }
  }

  return vectorAddition.register( 'VectorSymbolNode', VectorSymbolNode );
} );
