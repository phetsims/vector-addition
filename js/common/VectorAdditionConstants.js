// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  //----------------------------------------------------------------------------------------
  // for all panel-like containers
  const PANEL_CORNER_RADIUS = 7;
  const PANEL_X_MARGIN = 12;
  const PANEL_Y_MARGIN = 12;
  const PANEL_WIDTH = 140; // fixed size

  const VectorAdditionConstants = {

    //----------------------------------------------------------------------------------------
    // Margins for all ScreenView instances
    SCREEN_VIEW_X_MARGIN: 10,
    SCREEN_VIEW_Y_MARGIN: 14,

    //----------------------------------------------------------------------------------------
    // Defaults for all Panel instances
    PANEL_OPTIONS: {
      align: 'left',
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
      fill: VectorAdditionColors.PANEL_BACKGROUND,
      stroke: VectorAdditionColors.PANEL_STROKE_COLOR,
      minWidth: PANEL_WIDTH,
      maxWidth: PANEL_WIDTH,
      width: PANEL_WIDTH,
      contentWidth: PANEL_WIDTH - 2 * PANEL_X_MARGIN
    },
    PANEL_FONT: new PhetFont( 15 ),

    //----------------------------------------------------------------------------------------
    // Defaults for all check boxes
    CHECKBOX_OPTIONS: {
      boxWidth: 18,
      spacing: 7.5
    },

    //----------------------------------------------------------------------------------------
    // Defaults for all radio buttons
    RADIO_BUTTON_OPTIONS: _.extend( {
      deselectedLineWidth: 0.8,
      selectedLineWidth: 1.5,
      cornerRadius: PANEL_CORNER_RADIUS,
      deselectedButtonOpacity: 0.4,
      yMargin: 4.5,
      xMargin: 4.5
    }, VectorAdditionColors.RADIO_BUTTON_COLORS ),

    //----------------------------------------------------------------------------------------
    // Defaults for graphs
    GRAPH_DIMENSION: new Dimension2( 60, 40 ),
    GRAPH_UPPER_LEFT_COORDINATE: new Vector2( -5, 35 ),

    //----------------------------------------------------------------------------------------
    // Defaults for all vector arrow nodes
    VECTOR_OPTIONS: {
      lineWidth: 0,
      tailWidth: 5,
      headWidth: 9,
      headHeight: 6,
      cursor: 'move'
    },

    // Default vector group for Explore1D, Explore2D and Equation.
    DEFAULT_VECTOR_GROUP: VectorGroups.ONE,

    // side length of the arrow when initially dropped onto the graph.
    INITIAL_ARROW_SIDE_LENGTH: 5,

    //----------------------------------------------------------------------------------------
    // Rounding: TODO add more here
    ANGLE_ROUNDING: 1 // in decimal points, used in inspectVectorPanel and vectorAngleNode

  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );