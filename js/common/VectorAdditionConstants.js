// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 * @author Brandon Li
 */

define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 7;
  const PANEL_Y_MARGIN = 10;


  //----------------------------------------------------------------------------------------
  const VectorAdditionConstants = {

    // Margins for all ScreenView instances
    SCREEN_VIEW_X_MARGIN: 10,
    SCREEN_VIEW_Y_MARGIN: 12,
    SCREEN_VIEW_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

    //----------------------------------------------------------------------------------------
    // Defaults for all panel-like containers
    PANEL_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: 8,
      yMargin: 10,
      minWidth: 140,
      maxWidth: 140,
      fill: VectorAdditionColors.LIGHT_GREY,
      stroke: VectorAdditionColors.PANEL_STROKE_COLOR
    },

    // Font used on all panel-like container text nodes
    PANEL_FONT: new PhetFont( 15 ),

    // Defaults for layout boxes embedded in graph control panels (panel at the top-right of each and every screen)
    CONTROL_PANEL_LAYOUT_BOX_OPTIONS: {
      spacing: 10,
      align: 'left'
    },

    //----------------------------------------------------------------------------------------
    // Defaults for all panels with a expand collapse button
    EXPAND_COLLAPSE_PANEL: {
      cornerRadius: PANEL_CORNER_RADIUS,
      contentXMargin: 2,
      contentYMargin: PANEL_Y_MARGIN,
      buttonXMargin: PANEL_X_MARGIN,
      buttonYMargin: PANEL_Y_MARGIN,
      fill: VectorAdditionColors.LIGHT_GREY,
      stroke: VectorAdditionColors.PANEL_STROKE_COLOR,
      expandCollapseButtonOptions: {
        sideLength: 20
      }
    },

    // Height of all ExpandCollapsePanel instances
    EXPAND_COLLAPSE_PANEL_HEIGHT: 30,

    //----------------------------------------------------------------------------------------
    // Defaults for all check boxes
    CHECKBOX_OPTIONS: {
      boxWidth: 18,
      spacing: 7.5
    },

    //----------------------------------------------------------------------------------------
    // Defaults for all radio buttons
    RADIO_BUTTON_OPTIONS: _.extend( {
      deselectedLineWidth: 0.8,
      selectedLineWidth: 1.5,
      cornerRadius: 8,
      deselectedButtonOpacity: 0.4,
      yMargin: 4.5,
      xMargin: 4.5
    }, VectorAdditionColors.RADIO_BUTTON_COLORS ),

    //----------------------------------------------------------------------------------------
    // Options for all number pickers
    NUMBER_PICKER_OPTIONS: {
      color: VectorAdditionColors.BLACK,
      cornerRadius: 3,
      arrowYSpacing: 1.5,
      arrowHeight: 3.5,
      font: new PhetFont( 15.5 ),
      xMargin: 2.2,
      yMargin: 2.1,
      valueMaxWidth: 17
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
      tailWidth: 5,
      headWidth: 9,
      headHeight: 6,
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

    //----------------------------------------------------------------------------------------
    // Vector tags, not translatable. See https://github.com/phetsims/vector-addition/issues/10.
    // These don't necessarily align with VectorGroups.
    VECTOR_TAGS_GROUP_1: [ 'a', 'b', 'c' ],
    VECTOR_TAGS_GROUP_2: [ 'd', 'e', 'f' ]
  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );