// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating icons that appear in Vector addition Simulation
 *
 * @author Brandon Li
 */
define( function( require ) {
  'use strict';

  // modules
  const ArcArrowNode = require( 'VECTOR_ADDITION/common/view/ArcArrowNode' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants

  // arrow icon constants
  const ARROW_ICON_LENGTH = 28;
  const ARROW_ICON_COLOR = 'rgb( 40, 40, 120 )';

  // number of grid lines on the grid icon
  const GRID_LINES = 3;
  const GRID_SPACING = 7;
  const GRID_LINE_WIDTH = 1;
  const GRID_COLOR = 'rgb( 120, 120, 120 )';

  // angle icon constants
  const ANGLE_ICON_ANGLE = 55;
  const ANGLE_LINE_LENGTH = 20;
  const ANGLE_ICON_CIRCLE_RADIUS = 13;
  const ANGLE_ICON_OPTIONS = {
    arrowheadWidth: 5,
    arrowheadHeight: 3,
    arcOptions: {
      stroke: 'rgb( 50, 50, 50 )'
    }
  };

  // vector icons constants
  const ARROW_LIGHT_COLOR = 'rgb( 100, 100, 100 )';
  const ARROW_DARK_COLOR = 'rgb( 0, 0, 0 )';
  const VECTOR_ICON_HEAD_HEIGHT = 3;
  const VECTOR_ICON_HEAD_WIDTH = 5;
  const VECTOR_ICON_TAIL_WIDTH = 3;

  // the scale on the invisible component icon eye
  const INVISIBLE_COMPONENT_ICON_SCALE = 0.7;

  // the icon size for the component icons
  const COMPONENT_ICON_SIZE = 25;
  const AXIS_ICON_SUBBOX_SIZE = 10;
  const AXIS_ICON_LINE_DASH = [ 2, 2 ];

  // options for light shaded arrow
  const LIGHT_ARROW_OPTIONS = {
    fill: ARROW_LIGHT_COLOR,
    headHeight: VECTOR_ICON_HEAD_HEIGHT,
    headWidth: VECTOR_ICON_HEAD_WIDTH,
    tailWidth: VECTOR_ICON_TAIL_WIDTH
  };

  // options for drak shaded arrow
  const DARK_ARROW_OPTIONS = {
    fill: ARROW_DARK_COLOR,
    headHeight: VECTOR_ICON_HEAD_HEIGHT,
    headWidth: VECTOR_ICON_HEAD_WIDTH,
    tailWidth: VECTOR_ICON_TAIL_WIDTH
  };

// create a object with methods that return icons
  const VectorAdditionIconFactory = {
    // creates an arrow icon node
    createArrowIcon: () => {
      return new ArrowNode( 0, 0, ARROW_ICON_LENGTH, 0, {
        fill: ARROW_ICON_COLOR
      } );
    },

    // creates an icon that shows the grid of a graph
    createGridIcon: () => {
      // create a shape for the grid
      const gridShape = new Shape();

      // start with horizontal grid lines
      for ( let i = 0; i < GRID_LINES; i++ ) {
        gridShape.moveTo( 0, i * ( GRID_SPACING ) + GRID_SPACING )
          .horizontalLineTo( ( GRID_LINES + 1 ) * GRID_SPACING );
      }
      // now vertical lines
      for ( let j = 0; j < GRID_LINES; j++ ) {
        gridShape.moveTo( j * ( GRID_SPACING ) + GRID_SPACING, 0 )
          .verticalLineTo( ( GRID_LINES + 1 ) * GRID_SPACING );
      }
      // return a path as a node
      return new Path( gridShape, {
        lineWidth: GRID_LINE_WIDTH,
        stroke: GRID_COLOR
      } );
    },

    // Creates an icon that shows a angle
    createAngleIcon: () => {
      const icon = new Node();
      // // shape for the outline of the icon
      const wedgeShape = new Shape();

      const angleInRadians = Util.toRadians( ANGLE_ICON_ANGLE );
      // define the origin at the bottom left (tip of the wedge)
      // start from right and move to the left (origin) and then move to the top of the wedge
      wedgeShape.moveTo( ANGLE_LINE_LENGTH, 0 )
        .horizontalLineTo( 0 )
        .lineTo( Math.cos( angleInRadians ) * ANGLE_LINE_LENGTH,
          -1 * Math.sin( angleInRadians ) * ANGLE_LINE_LENGTH );

      const wedgePath = new Path( wedgeShape, {
        stroke: 'black'
      } );

      // subtract 15 because arc arrow uses a subtended angle to caclulate a new angle
      const arcArrow = new ArcArrowNode( ANGLE_ICON_ANGLE, ANGLE_ICON_CIRCLE_RADIUS, ANGLE_ICON_OPTIONS );
      return icon.setChildren( [ wedgePath, arcArrow ] );
    },

    // Creates the icon on the radio button for the invisible component style
    createInvisibleComponentStyleIcon: () => {
      const icon = new FontAwesomeNode( 'eye_close' );
      icon.scale( INVISIBLE_COMPONENT_ICON_SCALE );
      return icon;
    },

    // Creates the icon on the radio button for the Parallelogram component style
    createParallelogramComponentStyleIcon: () => {
      // create a container for the arrow nodes
      const icon = new Node();

      // the icon has 3 arrows, start with the 'dark' version that points to the right and up
      const darkArrow = new ArrowNode( 0, 0, COMPONENT_ICON_SIZE, -1 * COMPONENT_ICON_SIZE, DARK_ARROW_OPTIONS );

      // now add a lighter arrow node that points to the right
      const rightArrow = new ArrowNode( 0, 0, COMPONENT_ICON_SIZE, 0, LIGHT_ARROW_OPTIONS );

      // now add a lighter arrow pointing upwards
      const upArrow = new ArrowNode( 0, 0, 0, -1 * COMPONENT_ICON_SIZE, LIGHT_ARROW_OPTIONS );


      icon.setChildren( [ rightArrow, upArrow, darkArrow ] );
      return icon;
    },

    // Creates the icon on the radio button for the Triangle component style
    createTriangleComponentStyleIcon: () => {
      // create a container for the arrow nodes
      const icon = new Node();

      // the icon has 3 arrows, start with the 'dark' version that points to the right and up
      const darkArrow = new ArrowNode( 0, 0, COMPONENT_ICON_SIZE, -1 * COMPONENT_ICON_SIZE, DARK_ARROW_OPTIONS );

      // now add a lighter arrow node that points to the right
      const rightArrow = new ArrowNode( 0, 0, COMPONENT_ICON_SIZE, 0, LIGHT_ARROW_OPTIONS );

      // now add a lighter arrow pointing upwards but is displaced to the right
      const upArrow = new ArrowNode( COMPONENT_ICON_SIZE, 0, COMPONENT_ICON_SIZE, -1 * COMPONENT_ICON_SIZE,
        LIGHT_ARROW_OPTIONS );

      icon.setChildren( [ rightArrow, upArrow, darkArrow ] );
      return icon;
    },

    // Creates the icon on the radio button for the Triangle component style
    createAxisIconComponentStyleIcon: () => {
      // create a container for the arrow nodes
      const icon = new Node();

      // the icon has 3 arrows, start with the 'dark' version that points to the right and up
      // but starts from the sub box
      const darkArrow = new ArrowNode(
        AXIS_ICON_SUBBOX_SIZE,
        -1 * AXIS_ICON_SUBBOX_SIZE,
        COMPONENT_ICON_SIZE,
        -1 * COMPONENT_ICON_SIZE,
        DARK_ARROW_OPTIONS
      );

      // now add a lighter arrow node that points to the right
      const rightArrow = new ArrowNode( AXIS_ICON_SUBBOX_SIZE, 0, COMPONENT_ICON_SIZE, 0, LIGHT_ARROW_OPTIONS );

      // now add a lighter arrow pointing upwards but is displaced to the right
      const upArrow = new ArrowNode( 0, -1 * AXIS_ICON_SUBBOX_SIZE, 0, -1 * COMPONENT_ICON_SIZE, LIGHT_ARROW_OPTIONS );

      // create a dashed line shape
      const dashedLineShape = new Shape();

      // draw the first 2 lines around the subbox
      dashedLineShape.moveTo( 0, -1 * AXIS_ICON_SUBBOX_SIZE )
        .horizontalLineTo( AXIS_ICON_SUBBOX_SIZE )
        .verticalLineToRelative( AXIS_ICON_SUBBOX_SIZE );

      // draw the lines around the sub icon
      dashedLineShape.moveTo( 0, -1 * COMPONENT_ICON_SIZE )
        .horizontalLineTo( COMPONENT_ICON_SIZE )
        .verticalLineToRelative( COMPONENT_ICON_SIZE );

      // create the shape into a path
      const dashedLinePath = new Path( dashedLineShape, {
        stroke: 'black',
        lineDash: AXIS_ICON_LINE_DASH
      } );

      icon.setChildren( [ rightArrow, upArrow, darkArrow, dashedLinePath ] );
      return icon;
    }
  };

  vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );

  return VectorAdditionIconFactory;

} );
