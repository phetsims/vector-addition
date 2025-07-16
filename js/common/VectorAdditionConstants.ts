// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionConstants is the set of constants used throughout the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Color from '../../../scenery/js/util/Color.js';
import { RectangularRadioButtonGroupOptions } from '../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import vectorAddition from '../vectorAddition.js';
import VectorAdditionColors from './VectorAdditionColors.js';
import VectorAdditionQueryParameters from './VectorAdditionQueryParameters.js';
import VectorAdditionSymbols from './VectorAdditionSymbols.js';
import { RootVectorArrowNodeOptions } from './view/RootVectorNode.js';
import { PreferencesControlOptions } from '../../../joist/js/preferences/PreferencesControl.js';
import { AccordionBoxOptions } from '../../../sun/js/AccordionBox.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import { ArrowNodeOptions } from '../../../scenery-phet/js/ArrowNode.js';
import { PanelOptions } from '../../../sun/js/Panel.js';
import { NumberPickerOptions } from '../../../sun/js/NumberPicker.js';

const PANEL_X_MARGIN = 9;
const PANEL_Y_MARGIN = 10;
const PANEL_CORNER_RADIUS = 5;
const RIGHT_PANEL_WIDTH = 175; // fixed width of panels and accordion boxes on right side of the screen

export default class VectorAdditionConstants {

  private constructor() {
    // Not intended for instantiation.
  }

  // Shared by vector-addition-main.js and its derivatives (vector-addition-equations-main.js)
  // See https://github.com/phetsims/vector-addition/issues/98
  public static readonly CREDITS: CreditsData = {
    leadDesign: 'Michael Dubson, Amy Rouinfar',
    softwareDevelopment: 'Brandon Li, Martin Veillette, Chris Malley (PixelZoom, Inc.)',
    team: 'Diana L\u00f3pez Tavares, Amanda McGarry, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Jaspe Arias, Logan Bray, Megan Lai, Matthew Moore, Ashton Morris, Liam Mulhall, Jacob Romero, Nancy Salpepi, Kathryn Woessner'
  };

  //----------------------------------------------------------------------------------------
  // ScreenViews

  public static readonly SCREEN_VIEW_BOUNDS = ScreenView.DEFAULT_LAYOUT_BOUNDS;
  public static readonly SCREEN_VIEW_X_MARGIN = 20;
  public static readonly SCREEN_VIEW_Y_MARGIN = 16;

  // Space between the VectorCreatorPanel and the scene radio buttons.
  public static readonly SPACE_BELOW_VECTOR_CREATOR_PANEL = 15;

  //----------------------------------------------------------------------------------------
  // Graphs

  public static readonly DEFAULT_GRAPH_BOUNDS = new Bounds2( -5, -5, 45, 25 );
  public static readonly AXES_ARROW_X_EXTENSION = 20; // how far the x-axis arrow extends past the edge of the graph's grid
  public static readonly AXES_ARROW_Y_EXTENSION = 15; // how far the y-axis arrow extends past the edge of the graph's grid
  public static readonly AXES_ARROW_OPTIONS: ArrowNodeOptions = {
    doubleHead: true,
    tailWidth: 1.5,
    headWidth: 10,
    headHeight: 10,
    fill: Color.BLACK,
    stroke: null
  };

  public static readonly GRAPH_CONTROLS_Y_SPACING = 8;

  //----------------------------------------------------------------------------------------
  // Checkboxes

  public static readonly CHECKBOX_BOX_WIDTH = 18;

  //----------------------------------------------------------------------------------------
  // RadioButtonGroups

  public static readonly RADIO_BUTTON_GROUP_OPTIONS: RectangularRadioButtonGroupOptions = {
    orientation: 'horizontal',
    radioButtonOptions: {
      baseColor: VectorAdditionColors.radioButtonBaseColorProperty,
      cornerRadius: 8,
      xMargin: 8,
      yMargin: 8,
      buttonAppearanceStrategyOptions: {
        selectedLineWidth: 1.5,
        deselectedLineWidth: 1,
        deselectedButtonOpacity: 0.35,
        selectedStroke: VectorAdditionColors.radioButtonSelectedStrokeProperty,
        deselectedStroke: VectorAdditionColors.radioButtonDeselectedStrokeProperty
      }
    }
  };

  //----------------------------------------------------------------------------------------
  // Panel-like containers

  public static readonly PANEL_OPTIONS: PanelOptions = {
    cornerRadius: PANEL_CORNER_RADIUS,
    xMargin: PANEL_X_MARGIN,
    yMargin: PANEL_Y_MARGIN,
    fill: VectorAdditionColors.panelFillProperty,
    stroke: VectorAdditionColors.panelStrokeProperty
  };

  // fixed width of each GraphControlPanel
  public static readonly GRAPH_CONTROL_PANEL_CONTENT_WIDTH = RIGHT_PANEL_WIDTH;
  public static readonly BASE_VECTORS_ACCORDION_BOX_CONTENT_WIDTH = RIGHT_PANEL_WIDTH;

  // vertical spacing between UI components in each GraphControlPanel
  public static readonly GRAPH_CONTROL_PANEL_Y_SPACING = 10;

  //----------------------------------------------------------------------------------------
  // Ranges

  public static readonly XY_COMPONENT_RANGE = new Range( -10, 10 );
  public static readonly MAGNITUDE_RANGE = new Range( -10, 10 );
  public static readonly SIGNED_ANGLE_RANGE = new Range( -180, 180 );
  public static readonly UNSIGNED_ANGLE_RANGE = new Range( 0, 360 );

  //----------------------------------------------------------------------------------------
  // AccordionBoxes

  public static readonly ACCORDION_BOX_OPTIONS: AccordionBoxOptions = {
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
    },
    fill: VectorAdditionColors.panelFillProperty,
    stroke: VectorAdditionColors.panelStrokeProperty
  };

  //----------------------------------------------------------------------------------------
  // NumberPickers

  public static readonly NUMBER_PICKER_OPTIONS: NumberPickerOptions = {
    color: Color.BLACK,
    cornerRadius: 3.5,
    arrowYSpacing: 1.5,
    arrowHeight: 4,
    font: new PhetFont( 17 ),
    xMargin: 4.5,
    yMargin: 3.5
  };

  //----------------------------------------------------------------------------------------
  // Vectors

  public static readonly VECTOR_SYMBOL_PROPERTIES_GROUP_1 = [
    VectorAdditionSymbols.aStringProperty,
    VectorAdditionSymbols.bStringProperty,
    VectorAdditionSymbols.cStringProperty
  ];

  public static readonly VECTOR_SYMBOL_PROPERTIES_GROUP_2 = [
    VectorAdditionSymbols.dStringProperty,
    VectorAdditionSymbols.eStringProperty,
    VectorAdditionSymbols.fStringProperty
  ];

  // Defaults for all vectors
  public static readonly VECTOR_ARROW_OPTIONS: RootVectorArrowNodeOptions = {
    headWidth: VectorAdditionQueryParameters.headWidth,
    headHeight: VectorAdditionQueryParameters.headHeight,
    tailWidth: VectorAdditionQueryParameters.tailWidth,
    stroke: null,
    isHeadDynamic: true,
    fractionalHeadHeight: 0.5
  };

  // Defaults for component vectors, DashedArrowNode instances
  public static readonly COMPONENT_VECTOR_ARROW_OPTIONS = combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
    tailWidth: 3,
    tailDash: [ 6, 3 ]
  } );

  // Defaults for sum vectors
  public static readonly SUM_VECTOR_ARROW_OPTIONS = VectorAdditionConstants.VECTOR_ARROW_OPTIONS;

  // Defaults for sum component vectors
  public static readonly SUM_COMPONENT_VECTOR_ARROW_OPTIONS = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS;

  // Defaults for base vectors
  public static readonly BASE_VECTOR_ARROW_OPTIONS = combineOptions<RootVectorArrowNodeOptions>(
    {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
      lineWidth: 1.5
    } );

  // offset of a label from its vector, in model coordinates
  public static readonly VECTOR_LABEL_OFFSET = 0.45;

  // dilation of vector (arrow) pointer areas
  public static readonly VECTOR_TOUCH_AREA_DILATION = 3;
  public static readonly VECTOR_MOUSE_AREA_DILATION = 3;

  // dilation of vector head pointer areas, for vectors that can be scales/rotated
  public static readonly VECTOR_HEAD_TOUCH_AREA_DILATION = 8;
  public static readonly VECTOR_HEAD_MOUSE_AREA_DILATION = 6;

  // Interval spacing of vector angle (in degrees) when vector is in polar mode
  public static readonly POLAR_ANGLE_INTERVAL = 5;

  // When dragging tot translate a vector, the tail of the vector must remain this much inside the
  // bounds of the graph, in model units.
  public static readonly VECTOR_TAIL_DRAG_MARGIN = 1;

  // vector components or magnitudes smaller than this value are treated as effectively zero
  public static readonly ZERO_THRESHOLD = 1E-10;

  //----------------------------------------------------------------------------------------
  // Decimal places

  // for all vector-related values (magnitude, angle, components)
  public static readonly VECTOR_VALUE_DECIMAL_PLACES = 1;

  //----------------------------------------------------------------------------------------
  // Fonts

  public static readonly EQUATION_FONT = new PhetFont( 18 );
  public static readonly EQUATION_SYMBOL_FONT = new MathSymbolFont( 18 );
  public static readonly INTERACTIVE_EQUATION_FONT = new PhetFont( 20 );// for interactive equation in Equations screen
  public static readonly INTERACTIVE_EQUATION_SYMBOL_FONT = new MathSymbolFont( 20 ); // for interactive equation in Equations screen
  public static readonly VECTOR_LABEL_FONT = new PhetFont( 18 );
  public static readonly VECTOR_LABEL_SYMBOL_FONT = new MathSymbolFont( 18 );
  public static readonly ANGLE_LABEL_FONT = new PhetFont( 13 );
  public static readonly TICK_LABEL_FONT = new PhetFont( 14 );
  public static readonly AXIS_LABEL_FONT = new MathSymbolFont( 18 );
  public static readonly CHECKBOX_FONT = new PhetFont( 16 );
  public static readonly TITLE_FONT = new PhetFont( 16 );

  //----------------------------------------------------------------------------------------
  // Preferences

  public static readonly PREFERENCES_CONTROL_OPTIONS: PreferencesControlOptions = {
    isDisposable: false,
    labelSpacing: 20,
    visiblePropertyOptions: {
      phetioFeatured: true
    }
  };
}

vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );