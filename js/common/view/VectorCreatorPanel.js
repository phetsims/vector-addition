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
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  class VectorCreatorPanel extends Node {
    /**
     * @constructor
     * @param {array.<VectorCreatorPanelSlot>} panelSlots
     * @param {Object} [options] - options for the panel
     */
    constructor( panelSlots, options ) {

      options = _.extend( {}, VectorAdditionConstants.PANEL_OPTIONS, {
        minWidth: null,
        maxWidth: null,
        lineWidth: 0.8,
        xMargin: 0, // {number} - the margins on the left and ride side of the panel
        yMargin: 8, // {number} - the margins on the top and bottom of the panel
        slotSpacing: 20, // {number} - the spacing between slots
        align: 'center', // {string} - the alignment of the panel slots inside the panel
        right: 950, // {number}
        top: 320, // {number}
        contentWidth: 75, // {number} fixed width of the panel
        contentHeight: 118 // {number} fixed height of the panel
      }, VectorAdditionColors.VECTOR_CREATOR_COLORS, options );

      // Type check
      assert && assert( panelSlots.filter(
        slot => !( slot instanceof VectorCreatorPanelSlot ) ).length === 0,
        `panels slots where not created correctly: ${panelSlots}` );

      //----------------------------------------------------------------------------------------

      // Create a container for the vectorRepresentation nodes, which are in a zLayer above the slots
      const vectorRepresentationContainer = new Node();

      panelSlots.forEach( ( slot ) => {
        vectorRepresentationContainer.addChild( slot.vectorRepresentationNode );
      } );

      //----------------------------------------------------------------------------------------

      const slotsContainer = new VBox( {
        align: 'center',
        spacing: options.slotSpacing,
        children: panelSlots
      } );

      const fixedSizeSlotsContainer = new AlignBox( slotsContainer, {
        alignBounds: new Bounds2( 0, 0, options.contentWidth, options.contentHeight ),
        xAlign: 'center',
        yAlign: 'center',
        maxWidth: options.contentWidth,
        maxHeight: options.contentHeight,
        xMargin: 0,
        yMargin: 0
      } );

      super( {
        children: [
          new Panel( fixedSizeSlotsContainer, options ),
          vectorRepresentationContainer
        ]
      } );
    }
  }

  return vectorAddition.register( 'VectorCreatorPanel', VectorCreatorPanel );
} );

