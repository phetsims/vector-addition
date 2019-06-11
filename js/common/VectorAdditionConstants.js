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
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );

  // constants
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 12; // horizontal panel margin
  const PANEL_BACKGROUND_COLOR = 'rgb( 230, 230, 230 )';
  const PANEL_Y_MARGIN = 12; // vertical panel margin

  const VectorAdditionConstants = {

    // defaults
    DEFAULT_VECTOR_ORIENTATION: VectorOrientations.ALL,
    EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION: VectorOrientations.HORIZONTAL,
    DEFAULT_COMPONENT_STYLE: ComponentStyles.INVISIBLE,

    // Graph

    // The coordinate for the graphNode in view coordinates.
    UPPER_LEFT_LOCATION: new Vector2( 29, 90 ),
    GRAPH_TO_VIEW_SCALE: 12.5,

    // Some
    BACKGROUND_COLOR: 'rgb( 255, 250, 227)',
    ORIGIN_DOT_COLOR: 'rgb( 25, 253, 56 )',

    BLUE_VECTOR_COLOR: 'rgb( 20, 122, 240 )',
    BLUE_COMPONENT_COLOR: 'rgb( 75, 173, 240 )',
    RED_VECTOR_COLOR: 'rgb( 254, 53, 46 )',
    RED_COMPONENT_COLOR: 'rgb( 255, 113, 96 )',

    // Fonts
    PANEL_FONT: new PhetFont( 16 ),

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

    // Options for Vector Boxes
    VECTOR_BOX_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: 'white',
      xMargin: PANEL_X_MARGIN,
      yMargin: 6
    },

    // Spacing between checkboxes, radio buttons, or other items of that nature
    CHECK_RADIO_SPACING: 7,

    // Alignment groups for the left and right panels/boxes
    LEFT_CONTENT_ALIGN_GROUP: new AlignGroup( { matchVertical: false } ),

    // Vectors
    // constants
    VECTOR_ARROW_OPTIONS: {
      fill: 'rgb( 0, 191, 255 )',
      lineWidth: 0,
      tailWidth: 5,
      headWidth: 9,
      headHeight: 6,
      cursor: 'move'
    },

    VECTOR_SUM_ARROW_OPTIONS: {
      fill: 'rgb( 0, 181, 225 )',
      lineWidth: 1,
      tailWidth: 5,
      headWidth: 9,
      headHeight: 6,
      cursor: 'move'
    },

    // vector display panel that displays vector attributes at the top of the screen
    VECTOR_DISPLAY_PANEL_LOCATION: {
      left: 195,
      top: 12
    }



  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );
