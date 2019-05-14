// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 12; // horizontal panel margin
  const PANEL_BACKGROUND_COLOR = 'rgb( 230, 230, 230 )';
  const PANEL_Y_MARGIN = 12; // vertical panel margin

  const VectorAdditionConstants = {

    // grid
    GRID_BACKGROUND_STROKE_WIDTH: 1,
    GRID_BACKGROUND_STROKE_COLOR: 'rgb( 192, 192, 192)',
    GRID_BACKGROUND_FILL: 'white',

    MINOR_GRID_STROKE_WIDTH: 1.0,
    MINOR_GRID_STROKE_COLOR: 'rgb( 230, 230, 230 )',
    MAJOR_GRID_STROKE_WIDTH: 2.0,
    MAJOR_GRID_STROKE_COLOR: 'rgb( 230, 230, 230 )',

    GRAPH_MODEL_WIDTH: 60, // width of the graph, in model coordinates
    GRAPH_MODEL_HEIGHT: 40, // height of the graph, in model coordinates

    // Some
    BACKGROUND_COLOR: 'rgb( 255, 250, 227)',
    ORIGIN_DOT_COLOR: 'rgb( 25, 253, 56 )',

    BLUE_VECTOR_COLOR: 'rgb( 20, 122, 240 )',
    BLUE_COMPONENT_COLOR: 'rgb( 75, 173, 240 )',
    RED_VECTOR_COLOR: 'rgb( 254, 53, 46 )',
    RED_COMPONENT_COLOR: 'rgb( 255, 113, 96 )',

    // Fonts
    TITLE_FONT: new PhetFont( 14 ),
    TITLE_FONT_BOLD: new PhetFont( { size: 14, weight: 'bold' } ),

    TITLE_MAX_WIDTH: 140,
    TICK_LABEL_MAX_WIDTH: 50,

    RIGHT_CONTENT_WIDTH: 170,

    // Spacing between panels/boxes/sides of layout bounds
    PANEL_PADDING: 10,

    // Corner radius of our normal panels
    PANEL_CORNER_RADIUS: PANEL_CORNER_RADIUS,

    // Options for all top-level Panels
    PANEL_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: PANEL_BACKGROUND_COLOR,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN
    },

    // Options for AccordionBoxes
    BOX_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: PANEL_BACKGROUND_COLOR,
      contentXMargin: PANEL_X_MARGIN,
      contentYMargin: PANEL_Y_MARGIN
    },

    // Spacing between checkboxes, radio buttons, or other items of that nature
    CHECK_RADIO_SPACING: 7,

    // Alignment groups for the left and right panels/boxes
    LEFT_CONTENT_ALIGN_GROUP: new AlignGroup( { matchVertical: false } )

  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );
