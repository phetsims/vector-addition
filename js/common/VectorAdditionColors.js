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

    BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 10, 170, 250 )'
    } ),

    PURPLE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 188, 3, 255 )'
    } ),

    LAB_BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 10, 170, 250 )',
      sumFill: 'rgb( 6, 118 , 177 )'
    } ),

    LAB_PURPLE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 188, 3, 255 )',
      sumFill: 'rgb( 111, 1, 152 )'
    } ),

    LAB_RED_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 232, 25, 9 )',
      sumFill: 'rgb( 133, 14, 5 )'
    } ),

    LAB_GREEN_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 5, 200, 0 )',
      sumFill: 'rgb( 5, 120, 0 )'
    } )
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );