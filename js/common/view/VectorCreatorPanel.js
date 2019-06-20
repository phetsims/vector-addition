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

  // constants
  const PANEL_OPTIONS = _.clone( VectorAdditionConstants.PANEL_OPTIONS );

  class VectorCreatorPanel extends Node {
    /**
     * @constructor
     * @param {array.<VectorCreatorPanelSlot>} panelSlots
     * @param {Object} [options] - options for the panel
     */
    constructor( panelSlots, options ) {

      options = _.extend( {
        xMargin: 8, // {number} - the margins on the left and ride side of the panel
        yMargin: 4,
        fixedWidth: 80, // {number} - the width of the panel,
        slotSpacing: 40, // {number} - the spacing between slots
        right: 840, // {number}
        top: 300 // {number}
      }, PANEL_OPTIONS, options );

      // Type check
      assert && assert( panelSlots.filter(
        slot => !( slot instanceof VectorCreatorPanelSlot ) ).length === 0,
        `panels slots where not created correctly: ${panelSlots}` );
      assert && assert( typeof options.fixedWidth === 'number' && options.fixedWidth > 0,
        `invalid options.fixedWidth: ${options.fixedWidth}` );
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

      const vectorCreatorPanelSlots = new FixedWidthNode(
        vectorCreatorPanelWidth,
        new VBox( {
          align: 'center',
          spacing: options.slotSpacing,
          children: panelSlots
        } ), {
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

  return vectorAddition.register( 'VectorCreatorPanel', VectorCreatorPanel );
} );

