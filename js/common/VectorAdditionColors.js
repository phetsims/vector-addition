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
  const merge = require( 'PHET_CORE/merge' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // Colors that are used in more than one VectorColorPalette
  const BLUE = 'rgb( 10, 170, 250 )';
  const PINK = '#f149ff';

  // VectorColorPalette options that are common to both color palettes in the Equation screen
  const EQUATION_COLOR_PALETTE_OPTIONS = {
    sumFill: Color.BLACK,
    sumComponentFill: 'rgb( 130, 130, 130 )'
  };

  const VectorAdditionColors = {

    //----------------------------------------------------------------------------------------
    // Screen

    SCREEN_BACKGROUND: '#e5f7fe', // light blue

    //----------------------------------------------------------------------------------------
    // Graph

    GRAPH_BACKGROUND_COLOR: Color.WHITE,
    GRAPH_MAJOR_LINE_COLOR: 'rgb( 212, 212, 212 )', // gray
    GRAPH_MINOR_LINE_COLOR: 'rgb( 225, 225, 225 )', // lighter gray

    ORIGIN_COLOR: 'rgb( 150, 150, 150 )',

    //----------------------------------------------------------------------------------------
    // Panel-like containers

    PANEL_COLORS: {
      stroke: 'rgb( 190, 190, 190 )',
      fill: 'rgb( 240, 240, 240 )'
    },

    //----------------------------------------------------------------------------------------
    // RadioButtonGroups

    RADIO_BUTTON_GROUP_COLORS: {
      baseColor: Color.WHITE,
      selectedStroke: 'rgb( 65, 154, 201 )', // blue
      deselectedStroke: 'rgb( 50, 50, 50 )'
    },

    //----------------------------------------------------------------------------------------
    // Label background on vectors

    ACTIVE_VECTOR_LABEL_BACKGROUND_FILL: 'rgba( 240, 240, 100, 0.8 )', // yellow
    ACTIVE_VECTOR_LABEL_BACKGROUND_STROKE: 'rgba( 230, 230, 90, 0.8 )', // slightly darker yellow
    INACTIVE_VECTOR_LABEL_BACKGROUND_FILL: 'rgba( 235, 235, 235, 0.5 )', // gray
    INACTIVE_VECTOR_LABEL_BACKGROUND_STROKE: 'rgba( 215, 215, 215, 0.5 )', // slightly darker gray

    //----------------------------------------------------------------------------------------
    // Leader lines, for component vectors projected onto axes

    LEADER_LINES_NON_ACTIVE_STROKE: Color.BLACK, // stroke when the vector isn't active
    LEADER_LINES_ACTIVE_STROKE: Color.BLACK, // stroke when the vector is active

    //----------------------------------------------------------------------------------------
    // Vector color palettes

    BLUE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: BLUE,
      sumFill: '#0a46fa' // darker blue
    } ),

    PINK_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: PINK,
      sumFill: '#a200de' // darker purple
    } ),

    ORANGE_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: '#ff9023', // orange
      sumFill: '#e63c00' // burnt orange
    } ),

    GREEN_COLOR_PALETTE: new VectorColorPalette( {
      mainFill: 'rgb( 5, 200, 0 )', // green
      sumFill: '#058200' // darker green
    } ),

    // Equation screen
    EQUATION_BLUE_COLOR_PALETTE: new VectorColorPalette( merge( {
      mainFill: BLUE
    }, EQUATION_COLOR_PALETTE_OPTIONS ) ),

    EQUATION_PINK_COLOR_PALETTE: new VectorColorPalette( merge( {
      mainFill: PINK
    }, EQUATION_COLOR_PALETTE_OPTIONS ) )
  };

  return vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
} );