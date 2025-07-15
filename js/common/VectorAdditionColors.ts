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

const VectorAdditionColors = {

  //----------------------------------------------------------------------------------------
  // Screen

  screenBackgroundColorProperty: new ProfileColorProperty( vectorAddition, 'screenBackgroundColor', {
    default: '#e5f7fe' // light blue
  } ),

  //----------------------------------------------------------------------------------------
  // Graph

  graphBackgroundColorProperty: new ProfileColorProperty( vectorAddition, 'graphBackgroundColor', {
    default: Color.WHITE
  } ),

  graphMajorLineColorProperty: new ProfileColorProperty( vectorAddition, 'graphMajorLineColor', {
    default: Color.grayColor( 212 )
  } ),

  graphMinorLineColorProperty: new ProfileColorProperty( vectorAddition, 'graphMinorLineColor', {
    default: Color.grayColor( 225 )
  } ),

  graphTickLineColorProperty: new ProfileColorProperty( vectorAddition, 'graphTickLineColor', {
    default: Color.BLACK
  } ),

  graphTickLabelColorProperty: new ProfileColorProperty( vectorAddition, 'graphTickLabelColor', {
    default: Color.grayColor( 130 )
  } ),

  //----------------------------------------------------------------------------------------
  // Origin manipulator

  originColorProperty: new ProfileColorProperty( vectorAddition, 'originColor', {
    default: Color.grayColor( 150 )
  } ),

  originHighlightColorProperty: new ProfileColorProperty( vectorAddition, 'originHighlightColor', {
    default: Color.WHITE
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
    default: Color.WHITE
  } ),

  radioButtonSelectedStrokeProperty: new ProfileColorProperty( vectorAddition, 'radioButtonSelectedStroke', {
    default: 'rgb( 65, 154, 201 )' // blue
  } ),

  radioButtonDeselectedStrokeProperty: new ProfileColorProperty( vectorAddition, 'radioButtonDeselectedStroke', {
    default: Color.grayColor( 50 )
  } ),

  componentStyleIconColorProperty: new ProfileColorProperty( vectorAddition, 'componentStyleIconColor', {
    default: Color.BLACK // see https://github.com/phetsims/vector-addition/issues/314
  } ),

  eyeIconFillProperty: new ProfileColorProperty( vectorAddition, 'eyeIconFill', {
    default: Color.BLACK
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

  leaderLinesActiveStrokeProperty: new ProfileColorProperty( vectorAddition, 'leaderLinesActiveStroke', {
    default: Color.BLACK
  } ),

  leaderLinesInactiveStrokeProperty: new ProfileColorProperty( vectorAddition, 'leaderLinesInactiveStroke', {
    default: Color.BLACK
  } ),

  //----------------------------------------------------------------------------------------
  // Vector color palettes

  // Explore 1D screen, horizontal scene
  EXPLORE_1D_HORIZONTAL_COLOR_PALETTE: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.horizontal.vectorFill', {
      default: 'rgb( 10, 170, 250 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.horizontal.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } ),

  // Explore 1D screen, vertical scene
  EXPLORE_1D_VERTICAL_COLOR_PALETTE: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.vertical.vectorFill', {
      default: 'rgb( 10, 170, 250 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.vertical.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } ),

  // Explore 2D screen, Cartesian scene
  EXPLORE_2D_CARTESIAN_COLOR_PALETTE: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.cartesian.vectorFill', {
      default: 'rgb( 10, 170, 250 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.cartesian.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } ),

  // Explore 2D screen, polar scene
  EXPLORE_2D_POLAR_COLOR_PALETTE: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.polar.vectorFill', {
      default: '#f149ff' // pink
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.polar.sumFill', {
      default: '#a200de' // darker purple
    } )
  } ),

  // Lab scene, Cartesian scene, vector set 1
  LAB_CARTESIAN_COLOR_PALETTE_1: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian1.vectorFill', {
      default: 'rgb( 10, 170, 250 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian1.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } ),

  // Lab scene, Cartesian scene, vector set 2
  LAB_CARTESIAN_COLOR_PALETTE_2: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian2.vectorFill', {
      default: '#ff9023' // orange
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian2.sumFill', {
      default: '#d20000' // red
    } )
  } ),

  // Lab scene, polar scene, vector set 1
  LAB_POLAR_COLOR_PALETTE_1: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar1.vectorFill', {
      default: '#f149ff' // pink
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar1.sumFill', {
      default: '#a200de' // darker purple
    } )
  } ),

  // Lab scene, polar scene, vector set 2
  LAB_POLAR_COLOR_PALETTE_2: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar2.vectorFill', {
      default: 'rgb( 5, 200, 0 )' // green
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar2.sumFill', {
      default: '#058200' // darker green
    } )
  } ),

  // Equations screen, cartesian scene
  EQUATIONS_CARTESIAN_COLOR_PALETTE: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'equations.cartesian.vectorFill', {
      default: 'rgb( 10, 170, 250 )'
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'equations.cartesian.sumFill', {
      default: Color.BLACK
    } )
  } ),

  // Equations screen, polar scene
  EQUATIONS_POLAR_COLOR_PALETTE: new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'equations.polar.vectorFill', {
      default: '#f149ff'
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'equations.polar.sumFill', {
      default: Color.BLACK
    } )
  } )
};

vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );
export default VectorAdditionColors;