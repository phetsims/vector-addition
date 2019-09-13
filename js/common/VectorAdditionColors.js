// Copyright 2019, University of Colorado Boulder

/**
 * Colors for the 'Vector Addition' sim.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // shared colors
  const BLUE = 'rgb( 10, 170, 250 )';
  const PURPLE = 'rgb( 188, 3, 255 )';

  const VectorAdditionColors = {

    //----------------------------------------------------------------------------------------
    // Screen colors
    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',

    //----------------------------------------------------------------------------------------
    // Graph colors
    ORIGIN_COLOR: 'rgb( 25, 253, 56 )',
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 212, 212, 212 )',
    GRAPH_MINOR_LINE_COLOR: 'rgb( 225, 225, 225 )',

    //----------------------------------------------------------------------------------------
    // Panel-like container default colors
    PANEL_COLORS: {
      stroke: 'rgb( 190, 190, 190 )',
      fill: 'rgb( 240, 240, 240 )'
    },

    //----------------------------------------------------------------------------------------
    // Radio Button Group default colors
    RADIO_BUTTON_COLORS: {
      baseColor: Color.WHITE,
      selectedStroke: 'rgb( 65, 154, 201 )',
      deselectedStroke: 'rgb( 50, 50, 50 )'
    },

    //----------------------------------------------------------------------------------------
    // Label background on active vectors
    ACTIVE_VECTOR_LABEL_BACKGROUND: 'rgb( 240, 240, 100 )',

    //----------------------------------------------------------------------------------------
    // On axis lines, aka leader lines
    ON_AXIS_LINES_NON_ACTIVE_STROKE: Color.BLACK, // stroke when the vector isn't active
    ON_AXIS_LINES_ACTIVE_STROKE: Color.BLACK, // stroke when the vector is active

    //----------------------------------------------------------------------------------------
    // Vector color palettes

    // blue
    VECTOR_COLOR_PALETTE_1: new VectorColorPalette( {
      fill: BLUE,
      componentFill: 'rgb( 120, 200, 255 )'
    } ),

    // red
    VECTOR_COLOR_PALETTE_2: new VectorColorPalette( {
      fill: 'rgb( 232, 25, 9 )',
      componentFill: 'rgb( 245, 120, 120 )'
    } ),

    // purple
    VECTOR_COLOR_PALETTE_3: new VectorColorPalette( {
      fill: PURPLE,
      componentFill: 'rgb( 216, 191, 216 )'
    } ),

    // green
    VECTOR_COLOR_PALETTE_4: new VectorColorPalette( {
      fill: 'rgb( 5, 200, 0 )',
      componentFill: 'rgb( 150, 205, 150 )'
    } ),

    // Equation screen, blue
    EQUATION_VECTOR_COLOR_PALETTE_1: new VectorColorPalette( {
      fill: BLUE,
      componentFill: 'rgb( 120, 200, 255 )',
      sumFill: Color.BLACK,
      sumStroke: null,
      sumComponentFill: 'rgb( 130, 130, 130 )'
    } ),

    // Equation screen, purple
    EQUATION_VECTOR_COLOR_PALETTE_2: new VectorColorPalette( {
      fill: PURPLE,
      componentFill: 'rgb( 216, 191, 216 )',
      sumFill: Color.BLACK,
      sumStroke: null,
      sumComponentFill: 'rgb( 130, 130, 130 )'
    } )
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );