// Copyright 2019, University of Colorado Boulder

/**
 * Colors for the project.
 *
 * @author Brandon Li
 */
define( function( require ) {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const white = 'rgb( 255, 255, 255 )';
  const black = 'rgb( 0, 0, 0 )';

  const VectorAdditionColors = {

    //----------------------------------------------------------------------------------------
    // Various backgrounds
    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',
    CONTROL_PANEL_BACKGROUND: 'rgb( 248, 248, 248 )',
    INSPECT_VECTOR_BACKGROUND: 'rgb( 230, 230, 230 )',
    VECTOR_CREATOR_BACKGROUND: white,
    GRAPH_BACKGROUND: white,

    //----------------------------------------------------------------------------------------
    // Graph colors
    ORIGIN_DOT_COLOR: 'rgb( 25, 253, 56 )',
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 220, 220, 220 )',
    GRAPH_MINOR_LINE_COLOR: 'rgb( 230, 230, 230 )',
    TICKS_COLOR: black,


    //----------------------------------------------------------------------------------------
    // Vector Inspect Panel
    INSPECT_VECTOR_BORDER_COLOR: 'rgb( 190, 190, 190 )',


    //----------------------------------------------------------------------------------------
    // Graph Control Panel
    GRAPH_CONTROL_PANEL_LINE_COLOR: black,
    COMPONENTS_RADIO_BUTTON_COLORS: {
      baseColor: white,
      selectedStroke: '#419ac9'
    },
    GRID_ICON_COLOR: 'rgb( 120, 120, 120 )',
    ANGLE_ICON_COLOR: black,


    //----------------------------------------------------------------------------------------
    // Vector colors
    VECTOR_BORDER_COLOR: black,
    LIGHT_BLUE_VECTOR_COLOR: 'rgb( 0, 185, 255 )',
    LIGHT_BLUE_VECTOR_COMPONENT_COLOR: 'rgb( 155, 222, 255 )',
    BLACK_VECTOR_COLOR: black,
    PURPLE_VECTOR_COLOR: 'rgb( 188, 3, 255 )'




  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );