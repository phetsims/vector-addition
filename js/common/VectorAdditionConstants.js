// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  // constants
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 9;
  const PANEL_Y_MARGIN = 10;


  const VectorAdditionConstants = {

    //----------------------------------------------------------------------------------------
    // ScreenView constants
    //----------------------------------------------------------------------------------------
    SCREEN_VIEW_X_MARGIN: 10,
    SCREEN_VIEW_Y_MARGIN: 12,
    SCREEN_VIEW_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,


    //----------------------------------------------------------------------------------------
    // Panel constants
    //----------------------------------------------------------------------------------------

    // Font used on all panel-like container text nodes
    PANEL_FONT: new PhetFont( 15.5 ),

    // Defaults for all panel-like containers
    PANEL_OPTIONS: _.extend( {
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: 10
    }, VectorAdditionColors.PANEL_COLORS ),

    // Spacing between items on each GraphControlPanel (See GraphControlPanel.js)
    GRAPH_CONTROL_PANEL_SPACING: 10,


    //----------------------------------------------------------------------------------------
    // Accordion Box Constants
    //----------------------------------------------------------------------------------------
    ACCORDION_BOX_OPTIONS: _.extend( {
      cornerRadius: PANEL_CORNER_RADIUS,

      contentXMargin: PANEL_X_MARGIN,
      contentXSpacing: PANEL_X_MARGIN,
      titleXSpacing: PANEL_X_MARGIN,
      buttonXMargin: PANEL_X_MARGIN,

      contentYMargin: PANEL_Y_MARGIN,
      titleYMargin: PANEL_Y_MARGIN,
      buttonYMargin: PANEL_Y_MARGIN,


      titleAlignX: 'left',
      expandCollapseButtonOptions: {
        sideLength: 22
      }
    }, VectorAdditionColors.PANEL_COLORS ),

    // Height of all ExpandCollapsePanel instances
    ACCORDION_BOX_OPTIONS_HEIGHT: 50,

    //----------------------------------------------------------------------------------------
    // Defaults for all check boxes
    CHECKBOX_OPTIONS: {
      boxWidth: 18,
      spacing: 7.5
    },

    //----------------------------------------------------------------------------------------
    // Defaults for all radio buttons
    RADIO_BUTTON_OPTIONS: _.extend( {
      deselectedLineWidth: 1,
      selectedLineWidth: 1.5,
      cornerRadius: 8,
      deselectedButtonOpacity: 0.35,
      yMargin: 4.5,
      xMargin: 4.5
    }, VectorAdditionColors.RADIO_BUTTON_COLORS ),

    //----------------------------------------------------------------------------------------
    // Default options for all Number Picker instances
    NUMBER_PICKER_OPTIONS: {
      color: VectorAdditionColors.BLACK,
      cornerRadius: 3.5,
      arrowYSpacing: 1.5,
      arrowHeight: 4,
      font: new PhetFont( 17.5 ),
      xMargin: 4.5,
      yMargin: 3.5,
      valueMaxWidth: 20
    },

    //----------------------------------------------------------------------------------------
    // Defaults for graphs

    // Default graph bounds. Used in 'lab' and 'explore2D'
    DEFAULT_GRAPH_BOUNDS: new Bounds2( -5, -5, 55, 35 ),
    DEFAULT_SUM_VISIBLE: false,


    AXES_ARROW_X_EXTENSION: 20, // how far the line extends past the grid
    AXES_ARROW_Y_EXTENSION: 15,

    //----------------------------------------------------------------------------------------
    // Defaults for all vector arrow nodes
    VECTOR_OPTIONS: {
      lineWidth: 0,
      tailWidth: 4,
      headWidth: 11.5,
      headHeight: 8.5,
      cursor: 'move'
    },

    // Side length of the arrow when initially dropped onto the graph. Same length as 1 major grid
    DEFAULT_VECTOR_LENGTH: 5,

    // The offset in model coordinates of the label with respect to the vector
    VECTOR_LABEL_OFFSET: 0.5,

    //----------------------------------------------------------------------------------------
    // Rounding
    NUMBER_DISPLAY_ROUNDING: 1, // in decimal points
    VECTOR_VALUE_ROUNDING: 1, // rounding for the value in the label next to vectors in decimal points

    // interval spacing of vector angle (in degrees) when vector is in polar mode

    POLAR_ANGLE_INTERVAL: 5,
    //----------------------------------------------------------------------------------------
    // Vector symbols, not translatable. See https://github.com/phetsims/vector-addition/issues/10.
    // These don't necessarily align with VectorColorGroups.
    VECTOR_SYMBOLS_GROUP_1: [ 'a', 'b', 'c' ],
    VECTOR_SYMBOLS_GROUP_2: [ 'd', 'e', 'f' ],

    DEFAULT_COLOR_GROUP: VectorColorGroups.COLOR_GROUP_1
  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );