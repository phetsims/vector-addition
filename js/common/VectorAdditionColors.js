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
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

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

    //----------------------------------------------------------------------------------------
    // References, see https://github.com/phetsims/sun/issues/312
    WHITE: WHITE,
    BLACK: BLACK,
    LIGHT_GREY: LIGHT_GREY,
    GREY: GREY,
    PURPLE: PURPLE
  };

  //----------------------------------------------------------------------------------------
  // Vector colors by groups (See VectorGroups.js)
  //----------------------------------------------------------------------------------------

  VectorAdditionColors[ VectorGroups.ONE ] = {
    fill: 'rgb( 0, 185, 255 )',
    sum: 'rgb( 0, 181, 225 )',
    component: 'rgb( 155, 222, 255 )',
    labelBackground: 'rgb( 150, 210, 255 )'
  };

  VectorAdditionColors[ VectorGroups.TWO ] = {
    fill: 'rgb( 232, 25, 9 )',
    sum: 'rgb( 196, 2, 51 )',
    component: 'rgb( 245, 120, 120 )',
    labelBackground: 'rgb( 255, 100, 100 )'
  };

  VectorAdditionColors[ VectorGroups.THREE ] = {
    fill: PURPLE,
    sum: 'rgb( 128, 0, 128 )',
    component: 'rgb( 216, 191, 216 )',
    labelBackground: 'rgb( 210, 194, 210 )'
  };

  VectorAdditionColors[ VectorGroups.FOUR ] = {
    fill: 'rgb( 0, 255, 0 )',
    sum: 'rgb( 0, 102, 0 )',
    component: 'rgb( 190, 255, 190 )',
    labelBackground: 'rgb( 180, 255, 180 )'
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );