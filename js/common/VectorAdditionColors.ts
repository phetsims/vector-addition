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
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';

export default class VectorAdditionColors {

  private constructor() {
    // Not intended for instantiation.
  }

  //----------------------------------------------------------------------------------------
  // Screen

  public static readonly screenBackgroundColorProperty = new ProfileColorProperty( vectorAddition, 'screenBackgroundColor', {
    default: '#e5f7fe' // light blue
  } );

  //----------------------------------------------------------------------------------------
  // Graph

  public static readonly graphBackgroundColorProperty = new ProfileColorProperty( vectorAddition, 'graphBackgroundColor', {
    default: Color.WHITE
  } );

  public static readonly graphMajorLineColorProperty = new ProfileColorProperty( vectorAddition, 'graphMajorLineColor', {
    default: Color.grayColor( 212 )
  } );

  public static readonly graphMinorLineColorProperty = new ProfileColorProperty( vectorAddition, 'graphMinorLineColor', {
    default: Color.grayColor( 225 )
  } );

public static readonly graphTickLineColorProperty = new ProfileColorProperty( vectorAddition, 'graphTickLineColor', {
    default: Color.BLACK
  } );

  public static readonly graphTickLabelColorProperty = new ProfileColorProperty( vectorAddition, 'graphTickLabelColor', {
    default: Color.grayColor( 130 )
  } );

  public static readonly eraserButtonBaseColorProperty = new ProfileColorProperty( vectorAddition, 'eraserButtonBaseColor', {
    default: PhetColorScheme.BUTTON_YELLOW
  } );

  //----------------------------------------------------------------------------------------
  // Origin manipulator

  public static readonly originColorProperty = new ProfileColorProperty( vectorAddition, 'originColor', {
    default: Color.grayColor( 150 )
  } );

  public static readonly originHighlightColorProperty = new ProfileColorProperty( vectorAddition, 'originHighlightColor', {
    default: Color.WHITE
  } );

  //----------------------------------------------------------------------------------------
  // Panel-like containers

  public static readonly panelStrokeProperty = new ProfileColorProperty( vectorAddition, 'panelStroke', {
    default: Color.grayColor( 139 )
  } );

  public static readonly panelFillProperty = new ProfileColorProperty( vectorAddition, 'panelFill', {
    default: Color.grayColor( 240 )
  } );

  public static readonly separatorStrokeProperty = new ProfileColorProperty( vectorAddition, 'separatorStroke', {
    default: Color.grayColor( 180 )
  } );

  //----------------------------------------------------------------------------------------
  // RadioButtonGroups

  public static readonly radioButtonBaseColorProperty = new ProfileColorProperty( vectorAddition, 'radioButtonBaseColor', {
    default: Color.WHITE
  } );

  public static readonly radioButtonSelectedStrokeProperty = new ProfileColorProperty( vectorAddition, 'radioButtonSelectedStroke', {
    default: 'rgb( 56, 149, 199 )' // blue
  } );

  public static readonly radioButtonDeselectedStrokeProperty = new ProfileColorProperty( vectorAddition, 'radioButtonDeselectedStroke', {
    default: Color.grayColor( 50 )
  } );

  public static readonly componentStyleIconColorProperty = new ProfileColorProperty( vectorAddition, 'componentStyleIconColor', {
    default: Color.BLACK // see https://github.com/phetsims/vector-addition/issues/314
  } );

  public static readonly eyeIconFillProperty = new ProfileColorProperty( vectorAddition, 'eyeIconFill', {
    default: Color.BLACK
  } );

  //----------------------------------------------------------------------------------------
  // Label background on vectors

  public static readonly selectedVectorLabelBackgroundFillProperty = new ProfileColorProperty( vectorAddition, 'selectedVectorLabelBackgroundFill', {
    default: 'rgba( 240, 240, 100, 0.8 )' // yellow
  } );

  public static readonly selectedVectorLabelBackgroundStrokeProperty = new ProfileColorProperty( vectorAddition, 'selectedVectorLabelBackgroundStroke', {
    default: 'rgba( 151, 151, 23, 0.8 )' // darker yellow
  } );

  public static readonly unselectedVectorLabelBackgroundFillProperty = new ProfileColorProperty( vectorAddition, 'unselectedVectorLabelBackgroundFill', {
    default: 'rgba( 235, 235, 235, 0.5 )' // transparent gray
  } );

  public static readonly unselectedVectorLabelBackgroundStrokeProperty = new ProfileColorProperty( vectorAddition, 'unselectedVectorLabelBackgroundStroke', {
    default: 'rgba( 215, 215, 215, 0.5 )' // slightly darker transparent gray
  } );

  //----------------------------------------------------------------------------------------
  // Leader lines, for component vectors projected onto axes

  public static readonly leaderLinesSelectedStrokeProperty = new ProfileColorProperty( vectorAddition, 'leaderLinesSelectedStroke', {
    default: Color.BLACK
  } );

  public static readonly leaderLinesUnselectedStrokeProperty = new ProfileColorProperty( vectorAddition, 'leaderLinesUnselectedStroke', {
    default: Color.BLACK
  } );

  //----------------------------------------------------------------------------------------
  // Vector color palettes

  // Explore 1D screen, horizontal scene
  public static readonly EXPLORE_1D_HORIZONTAL_COLOR_PALETTE = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.horizontal.vectorFill', {
      default: 'rgb( 64, 150, 242 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.horizontal.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } );

  // Explore 1D screen, vertical scene
  public static readonly EXPLORE_1D_VERTICAL_COLOR_PALETTE = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.vertical.vectorFill', {
      default: 'rgb( 64, 150, 242 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore1D.vertical.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } );

  // Explore 2D screen, Cartesian scene
  public static readonly EXPLORE_2D_CARTESIAN_COLOR_PALETTE = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.cartesian.vectorFill', {
      default: 'rgb( 64, 150, 242 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.cartesian.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } );

  // Explore 2D screen, polar scene
  public static readonly EXPLORE_2D_POLAR_COLOR_PALETTE = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.polar.vectorFill', {
      default: '#f149ff' // pink
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'explore2D.polar.sumFill', {
      default: '#a200de' // darker purple
    } )
  } );

  // Lab scene, Cartesian scene, vector set 1
  public static readonly LAB_CARTESIAN_COLOR_PALETTE_1 = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian1.vectorFill', {
      default: 'rgb( 64, 150, 242 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian1.sumFill', {
      default: '#0a46fa' // darker blue
    } )
  } );

  // Lab scene, Cartesian scene, vector set 2
  public static readonly LAB_CARTESIAN_COLOR_PALETTE_2 = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian2.vectorFill', {
      default: '#e17a14' // orange
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.cartesian2.sumFill', {
      default: '#d20000' // red
    } )
  } );

  // Lab scene, polar scene, vector set 1
  public static readonly LAB_POLAR_COLOR_PALETTE_1 = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar1.vectorFill', {
      default: '#f149ff' // pink
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar1.sumFill', {
      default: '#a200de' // darker purple
    } )
  } );

  // Lab scene, polar scene, vector set 2
  public static readonly LAB_POLAR_COLOR_PALETTE_2 = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar2.vectorFill', {
      default: 'rgb( 82, 166, 43 )' // green
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'lab.polar2.sumFill', {
      default: '#058200' // darker green
    } )
  } );

  // Equations screen, cartesian scene
  public static readonly EQUATIONS_CARTESIAN_COLOR_PALETTE = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'equations.cartesian.vectorFill', {
      default: 'rgb( 64, 150, 242 )' // blue
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'equations.cartesian.sumFill', {
      default: Color.BLACK
    } )
  } );

  // Equations screen, polar scene
  public static readonly EQUATIONS_POLAR_COLOR_PALETTE = new VectorColorPalette( {
    vectorFillProperty: new ProfileColorProperty( vectorAddition, 'equations.polar.vectorFill', {
      default: '#f149ff'
    } ),
    sumFillProperty: new ProfileColorProperty( vectorAddition, 'equations.polar.sumFill', {
      default: Color.BLACK
    } )
  } );
}

vectorAddition.register( 'VectorAdditionColors', VectorAdditionColors );