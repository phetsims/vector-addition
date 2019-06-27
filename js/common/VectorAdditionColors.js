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

  // shared colors
  const WHITE = 'rgb( 255, 255, 255 )';
  const BLACK = 'rgb( 0, 0, 0 )';
  const LIGHT_GREY = 'rgb( 240, 240, 240 )';
  const GREY = 'rgb( 190, 190, 190 )';
  const LIGHT_RED = 'rgb( 245, 120, 120 )';
  const LIGHT_BLUE = 'rgb( 155, 222, 255 )';
  const PURPLE = 'rgb( 188, 3, 255 )';
  const LIGHT_PURPLE = 'rgb( 216, 191, 216 )';
  const LIGHT_GREEN = 'rgb( 204, 255, 204 )';

  const VectorAdditionColors = {
    
    //----------------------------------------------------------------------------------------
    // General
    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',
  
    RADIO_BUTTON_COLORS: {
      baseColor: WHITE,
      selectedStroke: 'rgb( 65, 154, 201 )',
      deselectedStroke: 'rgb( 50, 50, 50 )'
    },
    PANEL_STROKE_COLOR: 'rgb( 190, 190, 190 )',

    //----------------------------------------------------------------------------------------
    // Graph colors
    ORIGIN_DOT_COLOR: 'rgb( 25, 253, 56 )',
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 220, 220, 220 )',
    GRAPH_MINOR_LINE_COLOR: 'rgb( 230, 230, 230 )',
    TICKS_COLOR: BLACK,

    //----------------------------------------------------------------------------------------
    // Graph Control Panel
    GRAPH_CONTROL_PANEL_LINE_COLOR: BLACK,
    GRID_ICON_COLOR: 'rgb( 80, 80, 80 )',
    ANGLE_ICON_COLOR: BLACK,

    //----------------------------------------------------------------------------------------
    // Vector Creator Panel
    VECTOR_CREATOR_COLORS: {
      fill: WHITE,
      stroke: BLACK
    },

    //----------------------------------------------------------------------------------------
    // Vector colors
    VECTOR_GROUP_1_COLORS: {
      fill: 'rgb( 0, 185, 255 )',
      sum: 'rgb( 0, 181, 225 )',
      component: LIGHT_BLUE,
      labelBackground: LIGHT_BLUE
    },
    VECTOR_GROUP_2_COLORS: {
      fill: 'rgb( 232, 25, 9 )',
      sum: 'rgb( 196, 2, 51 )',
      component: LIGHT_RED,
      labelBackground: LIGHT_RED
    },
    VECTOR_GROUP_3_COLORS: {
      fill: PURPLE,
      sum: 'rgb( 128, 0, 128 )',
      component: LIGHT_PURPLE,
      labelBackground: LIGHT_PURPLE
    },
    VECTOR_GROUP_4_COLORS: {
      fill: 'rgb( 0, 255, 0 )',
      sum: 'rgb( 0, 102, 0 )',
      component: LIGHT_GREEN,
      labelBackground: LIGHT_GREEN
    },

    //----------------------------------------------------------------------------------------
    // References, see https://github.com/phetsims/sun/issues/312
    WHITE: WHITE,
    BLACK: BLACK,
    LIGHT_GREY: LIGHT_GREY,
    GREY: GREY,
    LIGHT_RED: LIGHT_RED,
    LIGHT_BLUE: LIGHT_BLUE,
    PURPLE: PURPLE,
    LIGHT_PURPLE: LIGHT_PURPLE,
    LIGHT_GREEN: LIGHT_GREEN
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );