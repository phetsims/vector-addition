// Copyright 2019, University of Colorado Boulder

/**
 * View for the accordion box that appears on the right side of the 'Equation' screen.
 *
 * Functionality:
 *  - allow users to change the components of the vectors on cartesian mode
 *  - allow users to change the angle and the magnitude of the vectors on polar mode
 *  - allow users to toggle the visibility of the base vector nodes (via checkbox)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Checkbox = require( 'SUN/Checkbox' );
  // const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Node = require( 'SCENERY/nodes/Node' );
  // const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  // const NumberProperty = require( 'AXON/NumberProperty' );
  // const Property = require( 'AXON/Property' );
  // const Range = require( 'DOT/Range' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // strings
  const baseVectorsString = require( 'string!VECTOR_ADDITION/baseVectors' );
  const showBaseVectorsString = require( 'string!VECTOR_ADDITION/showBaseVectors' );

  // constants
  const EXPAND_COLLAPSE_PANEL_OPTIONS = VectorAdditionConstants.EXPAND_COLLAPSE_PANEL;
  const SCREEN_VIEW_BOUNDS = VectorAdditionConstants.SCREEN_VIEW_BOUNDS;
  const SCREEN_VIEW_X_MARGIN = VectorAdditionConstants.SCREEN_VIEW_X_MARGIN;
  const CHECKBOX_OPTIONS = _.extend( {}, VectorAdditionConstants.CHECKBOX_OPTIONS, {
    spacing: 5
  } );
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  // const NUMBER_PICKER_OPTIONS = VectorAdditionConstants.NUMBER_PICKER_OPTIONS;

  class BaseVectorsAccordionBox extends AccordionBox {
    /**
     * @constructor
     * @param {BooleanProperty} baseVectorsVisibleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. Some options are
     *                             specific to this class while some are passed to the superclass. See the code where
     *                             the options are set in the early portion of the constructor for details.
     */
    constructor( baseVectorsVisibleProperty, coordinateSnapMode, options ) {

      options = _.extend( {}, EXPAND_COLLAPSE_PANEL_OPTIONS, {
        
        fixedWidth: 170,
        contentXMargin: EXPAND_COLLAPSE_PANEL_OPTIONS.buttonXMargin,

        // superclass options
        titleNode: new Text( baseVectorsString, { font: PANEL_FONT } ),
        right: SCREEN_VIEW_BOUNDS.maxX - SCREEN_VIEW_X_MARGIN,
        top: 310,
        titleAlignX: 'left',
        titleXMargin: EXPAND_COLLAPSE_PANEL_OPTIONS.buttonXMargin
      }, options );

      // Limit width of title is the maximum size of the title.
      options.titleNode.maxWidth = options.fixedWidth
                                   - EXPAND_COLLAPSE_PANEL_OPTIONS.expandCollapseButtonOptions.sideLength
                                   - options.contentXMargin
                                   - options.buttonXMargin
                                   - options.titleXMargin;

      const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

      //----------------------------------------------------------------------------------------
      // Create the number pickers

      // const testPicker = new NumberPicker( new NumberProperty( 5 ), new Property( new Range( -5, 5 ) ), NUMBER_PICKER_OPTIONS );


      //----------------------------------------------------------------------------------------
      // Create the 'Show Base Vectors checkbox'

      // Create the text node
      const showBaseVectorsText = new Text( showBaseVectorsString, { font: PANEL_FONT } );

      showBaseVectorsText.maxWidth = contentWidth - CHECKBOX_OPTIONS.boxWidth - CHECKBOX_OPTIONS.spacing;

      const baseVectorsCheckbox = new Checkbox( showBaseVectorsText, baseVectorsVisibleProperty, CHECKBOX_OPTIONS );

      //----------------------------------------------------------------------------------------
      // Create the accordion box

      const children = [
        baseVectorsCheckbox
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