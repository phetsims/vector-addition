// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  // shared constants within this file
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 9;
  const PANEL_Y_MARGIN = 10;
  const RIGHT_PANEL_WIDTH = 175; // fixed width of panels and accordion boxes on right side of the screen

  // options for vector arrows (ArrowNode)
  const VECTOR_ARROW_OPTIONS = {
    headWidth: 10,
    headHeight: 12,
    tailWidth: 3.5,
    stroke: null
  };

  // options for component vector arrows (DashedArrowNode)
  const COMPONENT_VECTOR_ARROW_OPTIONS = merge( {}, VECTOR_ARROW_OPTIONS, {
    tailWidth: 3,
    tailDash: [ 6, 3 ]
  } );

  const VectorAdditionConstants = {

    //----------------------------------------------------------------------------------------
    // ScreenViews

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 16,
    SCREEN_VIEW_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

    //----------------------------------------------------------------------------------------
    // Graphs

    DEFAULT_GRAPH_BOUNDS: new Bounds2( -5, -5, 45, 25 ),
    DEFAULT_SUM_VISIBLE: false,
    AXES_ARROW_X_EXTENSION: 20, // how far the x-axis arrow extends past the edge of the graph's grid
    AXES_ARROW_Y_EXTENSION: 15, // how far the y-axis arrow extends past the edge of the graph's grid
    AXES_ARROW_OPTIONS: {
      doubleHead: true,
      tailWidth: 1.5,
      headWidth: 10,
      headHeight: 10,
      fill: Color.BLACK,
      stroke: null
    },

    //----------------------------------------------------------------------------------------
    // Checkboxes

    CHECKBOX_BOX_WIDTH: 18,
    CHECKBOX_ICON_SPACING: 8,

    //----------------------------------------------------------------------------------------
    // RadioButtonGroups

    RADIO_BUTTON_GROUP_OPTIONS: merge( {
      deselectedLineWidth: 1,
      selectedLineWidth: 1.5,
      cornerRadius: 8,
      deselectedButtonOpacity: 0.35,
      buttonContentXMargin: 8,
      buttonContentYMargin: 8,
      orientation: 'horizontal'
    }, VectorAdditionColors.RADIO_BUTTON_GROUP_COLORS ),

    // Space above and below scene radio buttons
    RADIO_BUTTONS_Y_SPACING: 15,

    //----------------------------------------------------------------------------------------
    // Panel-like containers

    PANEL_OPTIONS: merge( {
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN
    }, VectorAdditionColors.PANEL_COLORS ),

    PANEL_X_MARGIN: PANEL_X_MARGIN,
    PANEL_Y_MARGIN: PANEL_Y_MARGIN,
    PANEL_CORNER_RADIUS: PANEL_CORNER_RADIUS,

    // fixed width of each GraphControlPanel
    GRAPH_CONTROL_PANEL_CONTENT_WIDTH: RIGHT_PANEL_WIDTH,
    BASE_VECTORS_ACCORDION_BOX_CONTENT_WIDTH: RIGHT_PANEL_WIDTH,

    // vertical spacing between UI components in each GraphControlPanel
    GRAPH_CONTROL_PANEL_Y_SPACING: 10,

    //----------------------------------------------------------------------------------------
    // Ranges

    COMPONENT_RANGE: new Range( -10, 10 ),
    MAGNITUDE_RANGE: new Range( -10, 10 ),
    ANGLE_RANGE: new Range( -180, 180 ),

    //----------------------------------------------------------------------------------------
    // AccordionBoxes and ToggleBoxes

    ACCORDION_BOX_OPTIONS: merge( {
      cornerRadius: PANEL_CORNER_RADIUS,
      contentXMargin: PANEL_X_MARGIN,
      contentYMargin: PANEL_Y_MARGIN,
      contentXSpacing: PANEL_X_MARGIN,
      contentYSpacing: 1,
      buttonXMargin: PANEL_X_MARGIN,
      buttonYMargin: PANEL_Y_MARGIN,
      titleYMargin: PANEL_Y_MARGIN,
      titleXMargin: PANEL_X_MARGIN,
      titleXSpacing: PANEL_X_MARGIN,
      titleAlignX: 'left',
      expandCollapseButtonOptions: {
        sideLength: 22,
        touchAreaXDilation: 6,
        touchAreaYDilation: 6
      }
    }, VectorAdditionColors.PANEL_COLORS ),

    //----------------------------------------------------------------------------------------
    // NumberPickers

    NUMBER_PICKER_OPTIONS: {
      color: Color.BLACK,
      cornerRadius: 3.5,
      arrowYSpacing: 1.5,
      arrowHeight: 4,
      font: new PhetFont( 17 ),
      xMargin: 4.5,
      yMargin: 3.5
    },

    //----------------------------------------------------------------------------------------
    // Vectors

    // Vector symbols, not translatable. See https://github.com/phetsims/vector-addition/issues/10.
    VECTOR_SYMBOLS_GROUP_1: [ 'a', 'b', 'c' ],
    VECTOR_SYMBOLS_GROUP_2: [ 'd', 'e', 'f' ],

    // Defaults for all vectors
    VECTOR_ARROW_OPTIONS: VECTOR_ARROW_OPTIONS,

    // Defaults for component vectors, DashedArrowNode instances
    COMPONENT_VECTOR_ARROW_OPTIONS: COMPONENT_VECTOR_ARROW_OPTIONS,

    // Defaults for sum vectors
    SUM_VECTOR_ARROW_OPTIONS: VECTOR_ARROW_OPTIONS,

    // Defaults for sum component vectors
    SUM_COMPONENT_VECTOR_ARROW_OPTIONS: COMPONENT_VECTOR_ARROW_OPTIONS,

    // Defaults for base vectors
    BASE_VECTOR_ARROW_OPTIONS: merge( {}, VECTOR_ARROW_OPTIONS, {
      lineWidth: 1.5
    } ),

    // offset of a label from its vector, in model coordinates
    VECTOR_LABEL_OFFSET: 0.45,

    // dilation of vector (arrow) pointer areas
    VECTOR_TOUCH_AREA_DILATION: 3,
    VECTOR_MOUSE_AREA_DILATION: 3,

    // dilation of vector head pointer areas, for vectors that can be scales/rotated
    VECTOR_HEAD_TOUCH_AREA_DILATION: 8,
    VECTOR_HEAD_MOUSE_AREA_DILATION: 6,

    // Interval spacing of vector angle (in degrees) when vector is in polar mode
    POLAR_ANGLE_INTERVAL: 5,

    // When dragging tot translate a vector, the tail of the vector must remain this much inside the
    // bounds of the graph, in model units.
    VECTOR_TAIL_DRAG_MARGIN: 1,

    //----------------------------------------------------------------------------------------
    // Decimal places

    VECTOR_VALUE_DECIMAL_PLACES: 1, // for all vector-related values (magnitude, angle, components)

    //----------------------------------------------------------------------------------------
    // Fonts

    EQUATION_FONT: new PhetFont( 18 ),
    EQUATION_SYMBOL_FONT: new MathSymbolFont( 18 ),
    VECTOR_LABEL_FONT: new PhetFont( 18 ),
    VECTOR_LABEL_SYMBOL_FONT: new MathSymbolFont( 18 ),
    ANGLE_LABEL_FONT: new PhetFont( 13 ),
    TICK_LABEL_FONT: new PhetFont( 14 ),
    AXIS_LABEL_FONT: new MathSymbolFont( 18 ),
    CHECKBOX_FONT: new PhetFont( 16 ),
    TITLE_FONT: new PhetFont( 16 )
  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );