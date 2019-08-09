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

  // shared constants within this file
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 9;
  const PANEL_Y_MARGIN = 10;


  const VectorAdditionConstants = {

    //----------------------------------------------------------------------------------------
    // ScreenView constants
    SCREEN_VIEW_X_MARGIN: 10,
    SCREEN_VIEW_Y_MARGIN: 12,
    SCREEN_VIEW_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,


    //----------------------------------------------------------------------------------------
    // Graph Constants
    DEFAULT_GRAPH_BOUNDS: new Bounds2( -5, -5, 55, 35 ),
    DEFAULT_SUM_VISIBLE: false,
    AXES_ARROW_X_EXTENSION: 20, // how far the x-axis arrow extends past the end of the graph
    AXES_ARROW_Y_EXTENSION: 15, // how far the y-axis arrow extends past the end of the graph


    //----------------------------------------------------------------------------------------
    // Defaults for all Check Boxes
    CHECKBOX_OPTIONS: {
      boxWidth: 18,
      spacing: 7.5
    },

    //----------------------------------------------------------------------------------------
    // Defaults for all Radio Button Groups
    RADIO_BUTTON_OPTIONS: _.extend( {
      deselectedLineWidth: 1,
      selectedLineWidth: 1.5,
      cornerRadius: 8,
      deselectedButtonOpacity: 0.35,
      yMargin: 4.5,
      xMargin: 4.5
    }, VectorAdditionColors.RADIO_BUTTON_COLORS ),


    //----------------------------------------------------------------------------------------
    // Panel constants

    // Defaults for all panel-like containers
    PANEL_OPTIONS: _.extend( {
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: 10
    }, VectorAdditionColors.PANEL_COLORS ),

    PANEL_FONT: new PhetFont( 15.5 ), // font used on all panel-like container text nodes
    GRAPH_CONTROL_PANEL_SPACING: 10,  // spacing between items on each GraphControlPanel (See GraphControlPanel.js)


    //----------------------------------------------------------------------------------------
    // Defaults for all AccordionBox instances
    ACCORDION_BOX_OPTIONS: _.extend( {
      cornerRadius: PANEL_CORNER_RADIUS,
      contentXMargin: PANEL_X_MARGIN,
      contentYMargin: PANEL_Y_MARGIN,
      contentXSpacing: PANEL_X_MARGIN,
      buttonXMargin: PANEL_X_MARGIN,
      buttonYMargin: PANEL_Y_MARGIN,
      titleYMargin: PANEL_Y_MARGIN,
      titleXSpacing: PANEL_X_MARGIN,
      titleAlignX: 'left',
      expandCollapseButtonOptions: {
        sideLength: 22,
        touchAreaXDilation: 6,
        touchAreaYDilation: 6
      }
    }, VectorAdditionColors.PANEL_COLORS ),

    EXPAND_COLLAPSE_PANEL_HEIGHT: 50, // height of all ExpandCollapsePanel instances


    //----------------------------------------------------------------------------------------
    // Defaults for all Number Picker instances
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
    // Constants for Vectors

    // Defaults for all Vector Arrow Nodes
    VECTOR_OPTIONS: {
      lineWidth: 0,
      tailWidth: 4,
      headWidth: 11.5,
      headHeight: 8.5,
      cursor: 'move'
    },

    DEFAULT_VECTOR_LENGTH: 5, // side length of the arrow when initially dropped onto the graph.
    VECTOR_LABEL_OFFSET: 0.3, // the offset in model coordinates of the label with respect to the vector


    //----------------------------------------------------------------------------------------
    // Rounding
    NUMBER_DISPLAY_ROUNDING: 1, // rounding for all number display instances
    VECTOR_VALUE_ROUNDING: 1,   // rounding for the vector 'values' in decimal points


    //----------------------------------------------------------------------------------------
    // Vector symbols, not translatable. See https://github.com/phetsims/vector-addition/issues/10.
    VECTOR_SYMBOLS_GROUP_1: [ 'a', 'b', 'c' ],
    VECTOR_SYMBOLS_GROUP_2: [ 'd', 'e', 'f' ],


    //----------------------------------------------------------------------------------------
    // Interval spacing of vector angle (in degrees) when vector is in polar mode
    POLAR_ANGLE_INTERVAL: 5
  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );