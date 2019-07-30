// Copyright 2019, University of Colorado Boulder

/**
 * Colors for the project.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  // shared colors
  const WHITE = 'rgb( 255, 255, 255 )';
  const BLACK = 'rgb( 0, 0, 0 )';
  const LIGHT_GREY = 'rgb( 240, 240, 240 )';
  const GREY = 'rgb( 190, 190, 190 )';
  const PURPLE = 'rgb( 188, 3, 255 )';

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
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 212, 212, 212 )',
    GRAPH_MINOR_LINE_COLOR: 'rgb( 225, 225, 225 )',

    //----------------------------------------------------------------------------------------
    // Graph Control Panel
    GRID_ICON_COLOR: 'rgb( 80, 80, 80 )',

    //----------------------------------------------------------------------------------------
    // Vector Creator Panel
    VECTOR_CREATOR_COLORS: {
      fill: WHITE,
      stroke: BLACK
    },

    //----------------------------------------------------------------------------------------
    // Label background on active vectors
    ACTIVE_VECTOR_LABEL_BACKGROUND: 'rgb( 255, 255, 100 )',
    EQUATION_SUM_FILL: BLACK,


    //----------------------------------------------------------------------------------------
    // On axis lines
    ON_AXIS_LINES_NON_ACTIVE_STROKE: BLACK,
    ON_AXIS_LINES_ACTIVE_STROKE: '#D64F00',

    //----------------------------------------------------------------------------------------
    // References, see https://github.com/phetsims/sun/issues/312
    WHITE: WHITE,
    BLACK: BLACK,
    LIGHT_GREY: LIGHT_GREY,
    GREY: GREY,
    PURPLE: PURPLE
  };

  //----------------------------------------------------------------------------------------
  // Vector colors by groups (See VectorColorGroups.js)
  //----------------------------------------------------------------------------------------

  VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1.toString() ] = {
    fill: 'rgb( 10, 170, 250 )',
    sum: 'rgb( 0, 181, 225 )',
    component: 'rgb( 120, 200, 255 )',
    labelBackground: 'rgb( 150, 210, 255 )'
  };

  VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_2.toString() ] = {
    fill: 'rgb( 232, 25, 9 )',
    sum: 'rgb( 196, 2, 51 )',
    component: 'rgb( 245, 120, 120 )',
    labelBackground: 'rgb( 255, 100, 100 )'
  };

  VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_3.toString() ] = {
    fill: PURPLE,
    sum: 'rgb( 128, 0, 128 )',
    component: 'rgb( 216, 191, 216 )',
    labelBackground: 'rgb( 210, 194, 210 )'
  };

  VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_4.toString() ] = {
    fill: '#058000',
    sum: '#024700',
    component: '#02CD00',
    labelBackground: 'rgb( 180, 255, 180 )'
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );