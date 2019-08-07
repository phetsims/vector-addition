// Copyright 2019, University of Colorado Boulder

/**
 * Panel that contains 'slots' that can be clicked upon to create new vectors.
 *
 * ## Implementation
 *  - Each slot is a VectorCreatorPanelSlot (See ./VectorCreatorPanelSlot.js).
 *  - This class solely takes in an array of these slots and lays them out correctly.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Panel = require( 'SUN/Panel' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;


  class VectorCreatorPanel extends Panel {

    /**
     * @param {VectorCreatorPanelSlot[]} panelSlots - array of the panel slots to go into the panel
     * @param {Object} [options]
     */
    constructor( panelSlots, options ) {

      assert && assert( _.every( panelSlots, slot => slot instanceof VectorCreatorPanelSlot ),
        `invalid panelSlots: ${panelSlots}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {}, PANEL_OPTIONS, {

        // super class options
        lineWidth: 0.8,
        xMargin: 2, // {number} - the margins on the left and right side of the panel
        yMargin: 10, // {number} - the margins on the top and bottom of the panel
        left: 900, // {number}
        top: 290, // {number}

        // options specific to this class
        xAlign: 'center',  // 'left' || 'center' || 'right' - horizontal alignment of the panel slots
        yAlign: 'center', // 'top' || 'center' || 'bottom' - vertical alignment of the panel slots
        slotSpacing: 20, // {number} - the spacing between slots
        contentWidth: 80, // {number} fixed width of the panel content
        contentHeight: 120 // {number} fixed height of the panel content

      }, VectorAdditionColors.VECTOR_CREATOR_COLORS, options );


      //----------------------------------------------------------------------------------------

      // Create the container for the slots in a vertical alignment
      const slotsContainer = new VBox( {
        spacing: options.slotSpacing,
        children: panelSlots
      } );

      // Align the slots in a AlignBox to ensure sizing/alignment is correct
      const fixedSizeSlotsContainer = new AlignBox( slotsContainer, {
        alignBounds: new Bounds2( 0, 0, options.contentWidth, options.contentHeight ),
        xAlign: options.xAlign,
        yAlign: options.yAlign,
        maxWidth: options.contentWidth,
        maxHeight: options.contentHeight
      } );

      super( fixedSizeSlotsContainer, options );
    }
  }

  return vectorAddition.register( 'VectorCreatorPanel', VectorCreatorPanel );
} );