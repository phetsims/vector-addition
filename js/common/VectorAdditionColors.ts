// Copyright 2019-2025, University of Colorado Boulder

/**
 * Colors for the 'Vector Addition' sim.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import vectorAddition from '../vectorAddition.js';
import VectorColorPalette from './model/VectorColorPalette.js';

// Colors that are used in more than one VectorColorPalette
const BLUE = 'rgb( 10, 170, 250 )';
const PINK = '#f149ff';
const EQUATIONS_SUM_FILL = 'black';

const VectorAdditionColors = {

  //----------------------------------------------------------------------------------------
  // Screen

  screenBackgroundColorProperty: new ProfileColorProperty( vectorAddition, 'screenBackgroundColor', {
    default: '#e5f7fe' // light blue
  } ),

  //----------------------------------------------------------------------------------------
  // Graph

  graphBackgroundColorProperty: new ProfileColorProperty( vectorAddition, 'graphBackgroundColor', {
    default: 'white'
  } ),

  graphMajorLineColorProperty: new ProfileColorProperty( vectorAddition, 'graphMajorLineColor', {
    default: Color.grayColor( 212 )
  } ),

  graphMinorLineColorProperty: new ProfileColorProperty( vectorAddition, 'graphMinorLineColor', {
    default: Color.grayColor( 225 )
  } ),

  //----------------------------------------------------------------------------------------
  // Origin manipulator

  originColorProperty: new ProfileColorProperty( vectorAddition, 'originColor', {
    default: Color.grayColor( 150 )
  } ),

  originHighlightColorProperty: new ProfileColorProperty( vectorAddition, 'originHighlightColor', {
    default: 'white'
  } ),

  //----------------------------------------------------------------------------------------
  // Panel-like containers

  panelStrokeProperty: new ProfileColorProperty( vectorAddition, 'panelStroke', {
    default: Color.grayColor( 190 )
  } ),

  panelFillProperty: new ProfileColorProperty( vectorAddition, 'panelFill', {
    default: Color.grayColor( 240 )
  } ),

  separatorStrokeProperty: new ProfileColorProperty( vectorAddition, 'separatorStroke', {
    default: Color.grayColor( 180 )
  } ),

  //----------------------------------------------------------------------------------------
  // RadioButtonGroups

  radioButtonBaseColorProperty: new ProfileColorProperty( vectorAddition, 'radioButtonBaseColor', {
    default: 'white'
  } ),

  radioButtonSelectedStrokeProperty: new ProfileColorProperty( vectorAddition, 'radioButtonSelectedStroke', {
    default: 'rgb( 65, 154, 201 )' // blue
  } ),

  radioButtonDeselectedStrokeProperty: new ProfileColorProperty( vectorAddition, 'radioButtonDeselectedStroke', {
    default: Color.grayColor( 50 )
  } ),

  //----------------------------------------------------------------------------------------
  // Label background on vectors

  activeVectorLabelBackgroundFillProperty: new ProfileColorProperty( vectorAddition, 'activeVectorLabelBackgroundFill', {
    default: 'rgba( 240, 240, 100, 0.8 )' // yellow
  } ),

  activeVectorLabelBackgroundStrokeProperty: new ProfileColorProperty( vectorAddition, 'activeVectorLabelBackgroundStroke', {
    default: 'rgba( 230, 230, 90, 0.8 )' // slightly darker yellow
  } ),

  inactiveVectorLabelBackgroundFillProperty: new ProfileColorProperty( vectorAddition, 'inactiveVectorLabelBackgroundFill', {
    default: 'rgba( 235, 235, 235, 0.5 )' // transparent gray
  } ),

  inactiveVectorLabelBackgroundStrokeProperty: new ProfileColorProperty( vectorAddition, 'inactiveVectorLabelBackgroundStroke', {
    default: 'rgba( 215, 215, 215, 0.5 )' // slightly darker transparent gray
  } ),

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

  ORANGE_COLOR_PALETTE: new VectorColorPalette( {
    mainFill: '#ff9023', // orange
    sumFill: '#d20000' // red
  } ),

  PINK_COLOR_PALETTE: new VectorColorPalette( {
    mainFill: PINK,
    sumFill: '#a200de' // darker purple
  } ),

  GREEN_COLOR_PALETTE: new VectorColorPalette( {
    mainFill: 'rgb( 5, 200, 0 )', // green
    sumFill: '#058200' // darker green
  } ),

  // Equations screen
  EQUATIONS_BLUE_COLOR_PALETTE: new VectorColorPalette( {
    mainFill: BLUE,
    sumFill: EQUATIONS_SUM_FILL
  } ),

  EQUATIONS_PINK_COLOR_PALETTE: new VectorColorPalette( {
    mainFill: PINK,
    sumFill: EQUATIONS_SUM_FILL
  } )
};

vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
export default VectorAdditionColors;