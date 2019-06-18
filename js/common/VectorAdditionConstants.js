// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Vector2 = require( 'DOT/Vector2' );

  //----------------------------------------------------------------------------------------
  // for all panel-like containers
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 12;
  const PANEL_Y_MARGIN = 12;

  const VectorAdditionConstants = {

    //----------------------------------------------------------------------------------------
    // Margins for all ScreenView instances
    SCREEN_VIEW_X_MARGIN: 6,
    SCREEN_VIEW_Y_MARGIN: 6,

    //----------------------------------------------------------------------------------------
    // Defaults for all Panel instances
    PANEL_OPTIONS: {
      align: 'left',
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
      fill: VectorAdditionColors.PANEL_BACKGROUND,
      stroke: VectorAdditionColors.PANEL_STROKE_COLOR
    },
    PANEL_FONT: new PhetFont( 18 ),
    PANEL_WIDTH: 135,
    ICON_SPACING: 10,

    //----------------------------------------------------------------------------------------
    // Vector Creator Panels
    VECTOR_CREATOR_PANEL_OPTIONS: {
      fill: VectorAdditionColors.VECTOR_CREATOR_BACKGROUND,
      xMargin: 8,
      yMargin: 4
    },

    //----------------------------------------------------------------------------------------
    // Defaults for graph location
    GRAPH_DIMENSION: new Dimension2( 60, 40 ),
    GRAPH_UPPER_LEFT_COORDINATE: new Vector2( -30, 20 ),

    //----------------------------------------------------------------------------------------
    // Defaults for all vector arrow nodes
    VECTOR_OPTIONS: {
      lineWidth: 0,
      tailWidth: 5,
      headWidth: 9,
      headHeight: 6,
      cursor: 'move'
    },

    //----------------------------------------------------------------------------------------
    // Default vector type for Explore1D, Explore2D and Equation.
    VECTOR_TYPE: VectorTypes.ONE

  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );
