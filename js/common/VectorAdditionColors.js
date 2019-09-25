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

  // Colors that are used in more than one VectorColorPalette
  const MAIN_BLUE = 'rgb( 10, 170, 250 )';
  const MAIN_PURPLE = 'rgb( 188, 3, 255 )';

  // VectorColorPalette options that are common to both color palettes in the Equation screen
  const EQUATION_COLOR_PALETTE_OPTIONS = {
    sumFill: Color.BLACK,
    sumComponentFill: 'rgb( 130, 130, 130 )'
  };

  const VectorAdditionColors = {

    //----------------------------------------------------------------------------------------
    // Screen colors
    SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',

    //----------------------------------------------------------------------------------------
    // Graph colors
    GRAPH_BACKGROUND_COLOR: Color.WHITE,
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 212, 212, 212 )',
    GRAPH_MINOR_LINE_COLOR: 'rgb( 225, 225, 225 )',

    ORIGIN_COLOR: 'rgb( 25, 253, 56 )',

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
    // Label background on active (selected) vectors
    ACTIVE_VECTOR_LABEL_BACKGROUND: 'rgb( 240, 240, 100 )',

    //----------------------------------------------------------------------------------------
    // On axis lines, aka leader lines
    ON_AXIS_LINES_NON_ACTIVE_STROKE: Color.BLACK, // stroke when the vector isn't active
    ON_AXIS_LINES_ACTIVE_STROKE: Color.BLACK, // stroke when the vector is active

    //----------------------------------------------------------------------------------------
    // Vector color palettes

    BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: MAIN_BLUE,
      sumFill: 'rgb( 5, 85, 125 )'
    } ),

    PURPLE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: MAIN_PURPLE,
      sumFill: 'rgb( 84, 2, 128 )'
    } ),

    RED_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 255, 53, 133 )',
      sumFill: 'rgb( 128, 1, 51 )'
    } ),

    GREEN_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 5, 200, 0 )',
      sumFill: 'rgb( 2, 75, 0 )'
    } ),

    // Equation screen
    EQUATION_BLUE_COLOR_PALETTE: new VectorColorPalette( _.extend( {
      mainFill: MAIN_BLUE
    }, EQUATION_COLOR_PALETTE_OPTIONS ) ),

    EQUATION_PURPLE_COLOR_PALETTE: new VectorColorPalette( _.extend( {
      mainFill: MAIN_PURPLE
    }, EQUATION_COLOR_PALETTE_OPTIONS ) )
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );