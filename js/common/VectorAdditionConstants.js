// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within the 'Vector Addition' simulation.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );

  //----------------------------------------------------------------------------------------
  // constants
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 12; // horizontal panel margin
  const PANEL_Y_MARGIN = 12; // vertical panel margin

  const VECTOR_TEMPLATE = {
    lineWidth: 0,
    tailWidth: 5,
    headWidth: 9,
    headHeight: 6,
    cursor: 'move'
  };
  const VECTOR_SUM_TEMPLATE = _.extend( _.clone( VECTOR_TEMPLATE ), {
    lineWidth: 1
  } );
  const VECTOR_COMPONENT_TEMPLATE = {
    headWidth: 10.5,
    headHeight: 6,
    tailWidth: 4,
    lineWidth: 0
  };

  const VectorAdditionConstants = {


    // margins for all ScreenView instances
    SCREEN_VIEW_X_MARGIN: 6,
    SCREEN_VIEW_Y_MARGIN: 6,

    // defaults
    DEFAULT_VECTOR_ORIENTATION: VectorOrientations.TWO_DIMENSIONAL,
    EXPLORE_1D_DEFAULT_VECTOR_ORIENTATION: VectorOrientations.HORIZONTAL,
    DEFAULT_COMPONENT_STYLE: ComponentStyles.INVISIBLE,
    DEFAULT_COORDINATE_SNAP_MODE: CoordinateSnapModes.CARTESIAN,

    // Graph

    // The coordinate for the graphNode in view coordinates.
    UPPER_LEFT_LOCATION: new Vector2( 29, 90 ),
    GRAPH_TO_VIEW_SCALE: 12.5,

    // Some

    TITLE_MAX_WIDTH: 140,
    TICK_LABEL_MAX_WIDTH: 50,

    RIGHT_CONTENT_WIDTH: 170,

    // Spacing between panels/boxes/sides of layout bounds
    PANEL_PADDING: 10,

    // Corner radius of our normal panels
    PANEL_CORNER_RADIUS: PANEL_CORNER_RADIUS,


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
    PANEL_FONT: new PhetFont( 25 ),
    PANEL_WIDTH: 135,
    ICON_SPACING: 10,
    // Options for Vector Boxes
    VECTOR_BOX_OPTIONS: {
      cornerRadius: PANEL_CORNER_RADIUS,
      fill: VectorAdditionColors.VECTOR_CREATOR_BACKGROUND,
      xMargin: PANEL_X_MARGIN,
      yMargin: 6
    },

    // Spacing between checkboxes, radio buttons, or other items of that nature
    CHECK_RADIO_SPACING: 7,

    // Alignment groups for the left and right panels/boxes
    LEFT_CONTENT_ALIGN_GROUP: new AlignGroup( { matchVertical: false } ),

    // vector display panel that displays vector attributes at the top of the screen
    VECTOR_DISPLAY_PANEL_LOCATION: {
      left: 195,
      top: 12
    },

    //----------------------------------------------------------------------------------------
    VECTOR_GROUP_1: {
      vectorOptions: _.extend( _.clone( VECTOR_TEMPLATE ), {
        fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.fill
      } ),
      sumOptions: _.extend( _.clone( VECTOR_SUM_TEMPLATE ), {
        fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.sum
      } ),
      componentOptions: _.extend( _.clone( VECTOR_COMPONENT_TEMPLATE ), {
        fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.component
      } )
    },
    VECTOR_GROUP_2: {
      vectorOptions: _.extend( _.clone( VECTOR_TEMPLATE ), {
        fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.fill
      } ),
      sumOptions: _.extend( _.clone( VECTOR_SUM_TEMPLATE ), {
        fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.sum
      } ),
      componentOptions: _.extend( _.clone( VECTOR_COMPONENT_TEMPLATE ), {
        fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.component
      } )
    }
  };

  return vectorAddition.register( 'VectorAdditionConstants', VectorAdditionConstants );
} );
