// Copyright 2019, University of Colorado Boulder

/**
 * Colors for the 'Vector Addition'
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // shared colors
  const WHITE = 'rgb( 255, 255, 255 )';
  const BLACK = 'rgb( 0, 0, 0 )';
  const GREY = 'rgb( 190, 190, 190 )';
  const PURPLE = 'rgb( 188, 3, 255 )';


  const VectorAdditionColors = {

    //----------------------------------------------------------------------------------------
    // General
    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',

    //----------------------------------------------------------------------------------------
    // Graph colors
    ORIGIN_COLOR: 'rgb( 25, 253, 56 )',
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 212, 212, 212 )',
    GRAPH_MINOR_LINE_COLOR: 'rgb( 225, 225, 225 )',
    GRID_ICON_COLOR: 'rgb( 80, 80, 80 )', // on the control panel

    //----------------------------------------------------------------------------------------
    // Panel-like container default colors
    PANEL_COLORS: {
      stroke: 'rgb( 190, 190, 190 )',
      fill: 'rgb( 240, 240, 240 )'
    },

    //----------------------------------------------------------------------------------------
    // Radio Button Group default colors
    RADIO_BUTTON_COLORS: {
      baseColor: WHITE,
      selectedStroke: 'rgb( 65, 154, 201 )',
      deselectedStroke: 'rgb( 50, 50, 50 )'
    },

    //----------------------------------------------------------------------------------------
    // Label background on active vectors
    ACTIVE_VECTOR_LABEL_BACKGROUND: 'rgb( 240, 240, 100 )',

    //----------------------------------------------------------------------------------------
    // Color of the Sum Vectors on the 'Equation' screen
    EQUATION_SUM_FILL: BLACK,

    //----------------------------------------------------------------------------------------
    // On axis lines, aka leader lines
    ON_AXIS_LINES_NON_ACTIVE_STROKE: BLACK, // stroke when the vector isn't active
    ON_AXIS_LINES_ACTIVE_STROKE: BLACK, // stroke when the vector is active

    //----------------------------------------------------------------------------------------
    // References, see https://github.com/phetsims/sun/issues/312
    WHITE: WHITE,
    BLACK: BLACK,
    GREY: GREY,
    PURPLE: PURPLE,

    //----------------------------------------------------------------------------------------
    // Vector color palettes

    // blue
    VECTOR_COLOR_PALETTE_1: new VectorColorPalette( {
      fill: 'rgb( 10, 170, 250 )',
      sum: 'rgb( 10, 170, 250 )',
      component: 'rgb( 120, 200, 255 )'
    } ),

    // red
    VECTOR_COLOR_PALETTE_2: new VectorColorPalette( {
      fill: 'rgb( 232, 25, 9 )',
      sum: 'rgb( 232, 25, 9 )',
      component: 'rgb( 245, 120, 120 )'
    } ),

    // purple
    VECTOR_COLOR_PALETTE_3: new VectorColorPalette( {
      fill: PURPLE,
      sum: PURPLE,
      component: 'rgb( 216, 191, 216 )'
    } ),

    // green
    VECTOR_COLOR_PALETTE_4: new VectorColorPalette( {
      fill: 'rgb( 5, 200, 0 )',
      sum: 'rgb( 5, 200, 0 )',
      component: 'rgb( 150, 205, 150 )'
    } )
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );