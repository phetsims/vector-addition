// Copyright 2019, University of Colorado Boulder

/**
 * Colors for the 'Vector Addition' sim.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // the four basic colors used in VectorColorPalettes
  const BLUE = 'rgb( 10, 170, 250 )';
  const PURPLE = 'rgb( 188, 3, 255 )';
  const RED = 'rgb( 232, 25, 9 )';
  const GREEN = 'rgb( 5, 200, 0 )';

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
    // RadioButtonGroup default colors
    RADIO_BUTTON_GROUP_COLORS: {
      baseColor: Color.WHITE,
      selectedStroke: 'rgb( 65, 154, 201 )', // blue
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

    //TODO #184 remove duplication in VectorColorPalette instances when colors are finalized

    // Explore 1D screen

    EXPLORE_1D_BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: BLUE,
      mainStroke: null,
      componentFill: BLUE,
      sumFill: BLUE,
      sumStroke: 'black',
      sumComponentFill: BLUE
    } ),

    // Explore 2D screen

    EXPLORE_2D_BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: BLUE,
      mainStroke: null,
      componentFill: BLUE,
      sumFill: BLUE,
      sumStroke: 'black',
      sumComponentFill: BLUE
    } ),

    EXPLORE_2D_PURPLE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: PURPLE,
      mainStroke: null,
      componentFill: PURPLE,
      sumFill: PURPLE,
      sumStroke: 'black',
      sumComponentFill: PURPLE
    } ),

    // Lab screen

    LAB_BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: BLUE,
      mainStroke: null,
      componentFill: BLUE,
      sumFill: BLUE,
      sumStroke: 'black',
      sumComponentFill: BLUE
    } ),

    LAB_PURPLE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: PURPLE,
      mainStroke: null,
      componentFill: PURPLE,
      sumFill: PURPLE,
      sumStroke: 'black',
      sumComponentFill: PURPLE
    } ),

    LAB_RED_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: RED,
      mainStroke: null,
      componentFill: RED,
      sumFill: RED,
      sumStroke: 'black',
      sumComponentFill: RED
    } ),

    LAB_GREEN_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: GREEN,
      mainStroke: null,
      componentFill: GREEN,
      sumFill: GREEN,
      sumStroke: 'black',
      sumComponentFill: GREEN
    } ),

    // Equation screen

    EQUATION_BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: BLUE,
      mainStroke: null,
      componentFill: BLUE,
      sumFill: BLUE,
      sumStroke: 'black',
      sumComponentFill: BLUE,
      baseVectorFill: 'white',
      baseVectorStroke: BLUE
    } ),

    EQUATION_PURPLE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: PURPLE,
      mainStroke: null,
      componentFill: PURPLE,
      sumFill: PURPLE,
      sumStroke: 'black',
      sumComponentFill: PURPLE,
      baseVectorFill: 'white',
      baseVectorStroke: PURPLE
    } )
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );