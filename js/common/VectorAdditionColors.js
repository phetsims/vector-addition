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
  const LIGHT_RED = 'rgb( 245, 120, 120 )';
  const LIGHT_BLUE = 'rgb( 155, 222, 255 )';

  const VectorAdditionColors = {

    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',

    //----------------------------------------------------------------------------------------
    // General   
    RADIO_BUTTON_COLORS: {
      baseColor: WHITE,
      selectedStroke: '#419ac9',
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
    POLAR_ICON_VECTOR_COLOR: 'rgb( 188, 3, 255 )',
    CARTESIAN_ICON_COLOR: BLACK,
    VECTOR_ICON_STROKE_COLOR: BLACK,

    //----------------------------------------------------------------------------------------
    // References, see https://github.com/phetsims/sun/issues/312
    WHITE: WHITE,
    BLACK: BLACK,
    LIGHT_GREY: LIGHT_GREY,
    LIGHT_RED: LIGHT_RED,
    LIGHT_BLUE: LIGHT_BLUE
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );