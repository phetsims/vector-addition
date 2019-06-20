// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class takes in a array of
 * VectorCreatorPanelSlots.
 *
 * The screens in the simulation respectively must extend this class and provide the abstract methods.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const FixedWidthNode = require( 'VECTOR_ADDITION/common/view/FixedWidthNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // constants
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const ALIGN_VALUES = [ 'top', 'bottom', 'center' ];

  class VectorCreatorPanel extends Node {
    /**
     * @constructor
     * @param {array.<VectorCreatorPanelSlot>} panelSlots
     * @param {Object} [options] - options for the panel
     */
    constructor( panelSlots, options ) {

      options = _.extend( {}, PANEL_OPTIONS, {
        xMargin: 8, // {number} - the margins on the left and ride side of the panel
        yMargin: 12,
        fixedWidth: 80, // {number} - the width of the panel,
        fixedHeight: 120, // {number} - the height of the panel,
        slotSpacing: 20, // {number} - the spacing between slots
        right: 940, // {number}
        top: 320 // {number}
      }, options );

      // Type check
      assert && assert( panelSlots.filter(
        slot => !( slot instanceof VectorCreatorPanelSlot ) ).length === 0,
        `panels slots where not created correctly: ${panelSlots}` );
      assert && assert( typeof options.fixedWidth === 'number' && options.fixedWidth > 0,
        `invalid options.fixedWidth: ${options.fixedWidth}` );
      assert && assert( typeof options.fixedHeight === 'number' && options.fixedHeight > 0,
        `invalid options.fixedHeight: ${options.fixedHeight}` );
      assert && assert( typeof options.xMargin === 'number' && options.xMargin > 0,
        `invalid options.xMargin: ${options.xMargin}` );
      assert && assert( typeof options.slotSpacing === 'number' && options.slotSpacing > 0,
        `invalid options.slotSpacing: ${options.slotSpacing}` );

      //----------------------------------------------------------------------------------------


      // Create a container for the vectorRepresentation nodes, which are in a zLayer above the slots
      const vectorRepresentationContainer = new Node();

      panelSlots.forEach( ( slot ) => {
        vectorRepresentationContainer.addChild( slot.vectorRepresentationNode );
      } );

      //----------------------------------------------------------------------------------------

      const vectorCreatorPanelWidth = options.fixedWidth - ( 2 * options.xMargin );
      const vectorCreatorPanelHeight = options.fixedHeight - ( 2 * options.yMargin );

      let vectorCreatorPanelSlots = new FixedHeightNode(
        vectorCreatorPanelHeight,
        new VBox( {
          align: 'center',
          spacing: options.slotSpacing,
          children: panelSlots
        } ), {
          align: 'center'
        } );

      vectorCreatorPanelSlots = new FixedWidthNode(
        vectorCreatorPanelWidth,
        vectorCreatorPanelSlots, {
          align: 'center'
        } );


      super( {
        children: [
          new Panel( vectorCreatorPanelSlots, options ),
          vectorRepresentationContainer
        ]
      } );
    }
  }

  //----------------------------------------------------------------------------------------
  // Fixed height node

  class FixedHeightNode extends Node {

    /**
     * @param {number} fixedHeight - this Node will be exactly this height
     * @param {Node} content - Node wrapped by this Node
     * @param {Object} [options]
     */
    constructor( fixedHeight, content, options ) {

      assert && assert( typeof fixedHeight === 'number' && fixedHeight > 0, `invalid fixedHeight: ${fixedHeight}` );
      assert && assert( content instanceof Node, `invalid content: ${content}` );

      options = _.extend( {
        align: 'center' // vertical alignment of content in fixedWidth, see ALIGN_VALUES
      }, options );

      assert && assert( _.includes( ALIGN_VALUES, options.align ), `invalid align: ${options.align}` );

      // prevents the content from getting narrower than fixedHeight
      const strut = new VStrut( fixedHeight, { pickable: false } );

      assert && assert( options.maxHeight === undefined, 'FixedHeightNode sets maxHeight' );
      assert && assert( !options.children, 'FixedWidthNode sets children' );
      options = _.extend( {
        maxHeight: fixedHeight, // prevents the content from getting bigger than fixedHeight
        children: [ strut, content ]
      }, options );

      // align content in fixedWidth
      if ( options.align === 'top' ) {
        content.top = strut.top;
      }
      else if ( options.align === 'bottom' ) {
        content.bottom = strut.bottom;
      }
      else {
        content.centerX = strut.centerX;
      }

      super( options );
    }
  }


  return vectorAddition.register( 'VectorCreatorPanel', VectorCreatorPanel );
} );

