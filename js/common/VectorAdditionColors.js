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

  // shared colors
  const BLUE_FILL = 'rgb( 10, 170, 250 )';
  const BLUE_COMPONENT_FILL = 'rgb( 167, 213, 251 )';
  const PURPLE_FILL = 'rgb( 188, 3, 255 )';
  const PURPLE_COMPONENT_FILL = 'rgb( 214, 199, 216 )';
  const EQUATION_COLOR_PALETTE_OPTIONS = {
    sumFill: Color.BLACK,
    sumStroke: null,
    sumComponentFill: 'rgb( 130, 130, 130 )'
  };

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

    // blue
    VECTOR_COLOR_PALETTE_1: new VectorColorPalette( {
      fill: BLUE_FILL,
      componentFill: BLUE_COMPONENT_FILL
    } ),

    // red
    VECTOR_COLOR_PALETTE_2: new VectorColorPalette( {
      fill: 'rgb( 232, 25, 9 )',
      componentFill: 'rgb( 233, 156, 154 )'
    } ),

    // purple
    VECTOR_COLOR_PALETTE_3: new VectorColorPalette( {
      fill: PURPLE_FILL,
      componentFill: PURPLE_COMPONENT_FILL
    } ),

    // green
    VECTOR_COLOR_PALETTE_4: new VectorColorPalette( {
      fill: 'rgb( 5, 200, 0 )',
      componentFill: 'rgb( 185, 216, 180 )'
    } ),

    // Equation screen, blue
    EQUATION_VECTOR_COLOR_PALETTE_1: new VectorColorPalette( _.extend( {}, EQUATION_COLOR_PALETTE_OPTIONS, {
      fill: BLUE_FILL,
      componentFill: BLUE_COMPONENT_FILL
    } ) ),

    // Equation screen, purple
    EQUATION_VECTOR_COLOR_PALETTE_2: new VectorColorPalette( _.extend( {}, EQUATION_COLOR_PALETTE_OPTIONS, {
      fill: PURPLE_FILL,
      componentFill: PURPLE_COMPONENT_FILL
    } ) )
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );