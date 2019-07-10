// Copyright 2019, University of Colorado Boulder

/**
 * description
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const AccordionBox = require( 'SUN/AccordionBox' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Checkbox = require( 'SUN/Checkbox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const baseVectorsString = require( 'string!VECTOR_ADDITION/baseVectors' );
  const showBaseVectorsString = require( 'string!VECTOR_ADDITION/showBaseVectors' );

  // constants
  const EXPAND_COLLAPSE_PANEL_OPTIONS = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL;
  const SCREEN_VIEW_BOUNDS = VectorAdditionConstants.SCREEN_VIEW_BOUNDS;
  const SCREEN_VIEW_X_MARGIN = VectorAdditionConstants.SCREEN_VIEW_X_MARGIN;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const CHECKBOX_OPTIONS = _.extend( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, {
    spacing: 5
  } );
  const PANEL_WIDTH = 170;

  class BaseVectorsAccordionBox extends AccordionBox {
    /**
     * @constructor
     * arguments
     */
    constructor( baseVectorsVisibleProperty, options ) {

      options = _.extend( {}, EXPAND_COLLAPSE_PANEL_OPTIONS, {
        fixedWidth: PANEL_WIDTH,
        contentXMargin: EXPAND_COLLAPSE_PANEL_OPTIONS.buttonXMargin,

        // superclass options
        titleNode: new Text( baseVectorsString, {
          font: PANEL_FONT
        } ),
        right: SCREEN_VIEW_BOUNDS.maxX - SCREEN_VIEW_X_MARGIN,
        top: 350,
        titleAlignX: 'left'
      }, options );

      // Limit width of title
      options.titleNode.maxWidth = 0.75 * options.fixedWidth;

      const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );


      const children = [
        new Checkbox( new Text( showBaseVectorsString, { font: PANEL_FONT, maxWidth: PANEL_WIDTH - CHECKBOX_OPTIONS.spacing - CHECKBOX_OPTIONS.boxWidth } ),
          baseVectorsVisibleProperty,
          CHECKBOX_OPTIONS )
      ];


     const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 15,
        children: children
      } ) );

      super( content, options );
  

    }

  }

  const HStrut = require( 'SCENERY/nodes/HStrut' );

  // constants
  const ALIGN_VALUES = [ 'left', 'right', 'center' ];

  class FixedWidthNode extends Node {

    /**
     * @param {number} fixedWidth - this Node will be exactly this width
     * @param {Node} content - Node wrapped by this Node
     * @param {Object} [options]
     */
    constructor( fixedWidth, content, options ) {
      assert && assert( typeof fixedWidth === 'number' && fixedWidth > 0, `invalid fixedWidth: ${fixedWidth}` );
      assert && assert( content instanceof Node, `invalid content: ${content}` );

      options = _.extend( {
        align: 'left' // horizontal alignment of content in fixedWidth, see ALIGN_VALUES
      }, options );

      assert && assert( _.includes( ALIGN_VALUES, options.align ), `invalid align: ${options.align}` );

      // prevents the content from getting narrower than fixedWidth
      const strut = new HStrut( fixedWidth, { pickable: false } );

      assert && assert( options.maxWidth === undefined, 'FixedWidthNode sets maxWidth' );
      assert && assert( !options.children, 'FixedWidthNode sets children' );
      options = _.extend( {
        maxWidth: fixedWidth, // prevents the content from getting wider than fixedWidth
        children: [ strut, content ]
      }, options );

      // align content in fixedWidth
      if ( options.align === 'left' ) {
        content.left = strut.left;
      }
      else if ( options.align === 'right' ) {
        content.right = strut.right;
      }
      else {
        content.centerX = strut.centerX;
      }

      super( options );
    }
  }

  return vectorAddition.register( 'BaseVectorsAccordionBox', BaseVectorsAccordionBox );
} );