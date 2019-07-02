// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  //----------------------------------------------------------------------------------------
  // for all panel-like containers
  const PANEL_CORNER_RADIUS = 7;
  const PANEL_X_MARGIN = 12;
  const PANEL_Y_MARGIN = 12;
  const PANEL_WIDTH = 140; // fixed size

  const VectorAdditionConstants = {

    //----------------------------------------------------------------------------------------
    // Margins for all ScreenView instances
    SCREEN_VIEW_X_MARGIN: 10,
    SCREEN_VIEW_Y_MARGIN: 14,

    //----------------------------------------------------------------------------------------
    // Defaults for all Panel instances
    PANEL_OPTIONS: {
      align: 'left',
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
      fill: VectorAdditionColors.LIGHT_GREY,
      stroke: VectorAdditionColors.PANEL_STROKE_COLOR,
      minWidth: PANEL_WIDTH,
      maxWidth: PANEL_WIDTH,
      width: PANEL_WIDTH,
      contentWidth: PANEL_WIDTH - 2 * PANEL_X_MARGIN
    },
    PANEL_FONT: new PhetFont( 15 ),
    PANEL_LAYOUT_BOX_OPTIONS: {
      spacing: 10,
      align: 'left'
    },
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
      cornerRadius: PANEL_CORNER_RADIUS,
      deselectedButtonOpacity: 0.4,
      yMargin: 4.5,
      xMargin: 4.5
    }, VectorAdditionColors.RADIO_BUTTON_COLORS ),

    //----------------------------------------------------------------------------------------
    // Defaults for graphs

    // Default graph bounds. Used in 'lab' and 'explore2D'
    DEFAULT_GRAPH_BOUNDS: new Bounds2( -5, -5, 55, 35 ),

    //----------------------------------------------------------------------------------------
    // Defaults for all vector arrow nodes
    VECTOR_OPTIONS: {
      lineWidth: 0,
      tailWidth: 5,
      headWidth: 9,
      headHeight: 6,
      cursor: 'move'
    },

    // Side length of the arrow when initially dropped onto the graph.
    INITIAL_ARROW_SIDE_LENGTH: 5,

    // The offset in model coordinates of the label with respect to the vector
    VECTOR_LABEL_OFFSET: 0.5,

    //----------------------------------------------------------------------------------------
    // Rounding
    ANGLE_ROUNDING: 1, // in decimal points
    VECTOR_VALUE_ROUNDING: 1,


    //----------------------------------------------------------------------------------------
    // Vector tags, not translatable. See https://github.com/phetsims/vector-addition/issues/10.
    // These don't necessarily align with VectorGroups.
    VECTOR_TAGS_GROUP_1: [ 'a', 'b', 'c' ],
    VECTOR_TAGS_GROUP_2: [ 'd', 'e', 'f' ]
  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );