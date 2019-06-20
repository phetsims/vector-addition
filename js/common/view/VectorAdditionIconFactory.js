// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating icons that appear in this project
 *
 * @author Brandon Li
 */
define( function( require ) {
  'use strict';

  // modules
  const ArcArrowNode = require( 'VECTOR_ADDITION/common/view/ArcArrowNode' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  //----------------------------------------------------------------------------------------
  // constants

  // arrow icons
  const ARROW_ICON_SIZE = 25;
  // template for other arrow
  const ARROW_ICON_OPTIONS = {
    fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.fill,
    stroke: VectorAdditionColors.VECTOR_ICON_STROKE_COLOR,
    lineWidth: 0.5,
    headHeight: 5,
    headWidth: 9,
    tailWidth: 4,
    opacity: 1
  };
  // semi opaque arrow for the components
  const OPAQUE_ARROW_OPTIONS = _.extend( _.clone( ARROW_ICON_OPTIONS ), {
    opacity: 0.4
  } );
  // sum icon
  const SUM_ARROW_GROUP_ONE_OPTIONS = _.extend( _.clone( ARROW_ICON_OPTIONS ), {
    fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.sum,
    lineWidth: 0.5
  } );
  const SUM_ARROW_GROUP_TWO_OPTIONS = _.extend( _.clone( ARROW_ICON_OPTIONS ), {
    fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.sum,
    lineWidth: 0.5
  } );

  // Cartesian Black Arrow
  const CARTESIAN_DARK_ARROW_OPTIONS = _.extend(
    _.clone( ARROW_ICON_OPTIONS ),
    {
      fill: VectorAdditionColors.CARTESIAN_ICON_COLOR,
      tailWidth: 2,
      lineWidth: 0
    }
  );
  // Polar arrow
  const POLAR_ARROW_OPTIONS = _.extend( _.clone( ARROW_ICON_OPTIONS ), {
    fill: VectorAdditionColors.POLAR_ICON_VECTOR_COLOR,
    lineWidth: 0
  } );

  //----------------------------------------------------------------------------------------
  // grid constants
  // number of grid lines on the grid icon
  const GRID_LINES = 3;
  const GRID_SPACING = 7;
  const GRID_ICON_OPTIONS = {
    lineWidth: 1,
    stroke: VectorAdditionColors.GRID_ICON_COLOR
  };

  //----------------------------------------------------------------------------------------
  // angle icon constants
  const ANGLE_ICON_ANGLE = 55; // degrees
  const ANGLE_LINE_LENGTH = 20;
  const ANGLE_ICON_CIRCLE_RADIUS = 13;
  const ANGLE_ICON_OPTIONS = {
    arrowheadWidth: 5,
    arrowheadHeight: 3,
    arcOptions: {
      stroke: VectorAdditionColors.ANGLE_ICON_COLOR
    }
  };
  //----------------------------------------------------------------------------------------
  // on axis icon
  const AXIS_ICON_SUBBOX_SIZE = 10;
  const AXIS_ICON_LINE_DASH = [ 2, 2 ];

  // strings
  const oneString = require( 'string!VECTOR_ADDITION/one' );

  class VectorAdditionIconFactory {
    // Creates an arrow icon node
    static createSumIcon( vectorType ) {
      let arrowOptions;
      switch( vectorType ) {
        case VectorTypes.ONE:
          arrowOptions = SUM_ARROW_GROUP_ONE_OPTIONS;
          break;
        case VectorTypes.TWO:
          arrowOptions = SUM_ARROW_GROUP_TWO_OPTIONS;
          break;
        default:
          throw new Error( 'vector type not handled' );

      }
      return new ArrowNode( 0, 0, ARROW_ICON_SIZE, 0, arrowOptions );
    }

    // Creates an icon that shows the grid of a graph
    static createGridIcon() {
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
      return new Path( gridShape, GRID_ICON_OPTIONS );
    }

    // Creates an icon that shows a angle
    static createAngleIcon() {
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

      // subtract 15 because arc arrow uses a subtended angle to calculate a new angle
      const arcArrow = new ArcArrowNode( ANGLE_ICON_ANGLE, ANGLE_ICON_CIRCLE_RADIUS, ANGLE_ICON_OPTIONS );
      return icon.setChildren( [ wedgePath, arcArrow ] );
    }

    // Creates the icon on the radio button for the invisible component style
    static createInvisibleComponentStyleIcon() {
      const icon = new FontAwesomeNode( 'eye_close', {
        maxWidth: ARROW_ICON_SIZE // same size as the other component icons
      } );
      return icon;
    }

    // Creates the icon on the radio button for the Parallelogram component style
    static createParallelogramComponentStyleIcon() {
      // create a container for the arrow nodes
      const icon = new Node();

      // the icon has 3 arrows, start with a arrow, the 2 opaque arrows
      const darkArrow = new ArrowNode( 0, 0, ARROW_ICON_SIZE, -ARROW_ICON_SIZE, ARROW_ICON_OPTIONS );

      // now add a lighter arrow node that points to the right
      const rightArrow = new ArrowNode( 0, 0, ARROW_ICON_SIZE, 0, OPAQUE_ARROW_OPTIONS );

      // now add a lighter arrow pointing upwards
      const upArrow = new ArrowNode( 0, 0, 0, -1 * ARROW_ICON_SIZE, OPAQUE_ARROW_OPTIONS );

      icon.setChildren( [ rightArrow, upArrow, darkArrow ] );
      return icon;
    }

    // Creates the icon on the radio button for the Triangle component style
    static createTriangleComponentStyleIcon() {
      // create a container for the arrow nodes
      const icon = new Node();

      // the icon has 3 arrows, start with the 'dark' version that points to the right and up
      const darkArrow = new ArrowNode( 0, 0, ARROW_ICON_SIZE, -1 * ARROW_ICON_SIZE, ARROW_ICON_OPTIONS );

      // now add a lighter arrow node that points to the right
      const rightArrow = new ArrowNode( 0, 0, ARROW_ICON_SIZE, 0, OPAQUE_ARROW_OPTIONS );

      // now add a lighter arrow pointing upwards but is displaced to the right
      const upArrow = new ArrowNode( ARROW_ICON_SIZE, 0, ARROW_ICON_SIZE, -1 * ARROW_ICON_SIZE,
        OPAQUE_ARROW_OPTIONS );

      icon.setChildren( [ rightArrow, upArrow, darkArrow ] );
      return icon;
    }

    // Creates the icon on the radio button for the Triangle component style
    static createAxisIconComponentStyleIcon() {
      // create a container for the arrow nodes
      const icon = new Node();

      // the icon has 3 arrows, start with the 'dark' version that points to the right and up
      // but starts from the sub box
      const darkArrow = new ArrowNode(
        AXIS_ICON_SUBBOX_SIZE,
        -1 * AXIS_ICON_SUBBOX_SIZE,
        ARROW_ICON_SIZE,
        -1 * ARROW_ICON_SIZE,
        ARROW_ICON_OPTIONS
      );

      // now add a lighter arrow node that points to the right
      const rightArrow = new ArrowNode( AXIS_ICON_SUBBOX_SIZE, 0, ARROW_ICON_SIZE, 0, OPAQUE_ARROW_OPTIONS );

      // now add a lighter arrow pointing upwards but is displaced to the right
      const upArrow = new ArrowNode( 0, -1 * AXIS_ICON_SUBBOX_SIZE, 0, -1 * ARROW_ICON_SIZE, OPAQUE_ARROW_OPTIONS );

      // create a dashed line shape
      const dashedLineShape = new Shape();

      // draw the first 2 lines around the sub box
      dashedLineShape.moveTo( 0, -1 * AXIS_ICON_SUBBOX_SIZE )
        .horizontalLineTo( AXIS_ICON_SUBBOX_SIZE )
        .verticalLineToRelative( AXIS_ICON_SUBBOX_SIZE );

      // draw the lines around the sub icon
      dashedLineShape.moveTo( 0, -1 * ARROW_ICON_SIZE )
        .horizontalLineTo( ARROW_ICON_SIZE )
        .verticalLineToRelative( ARROW_ICON_SIZE );

      // create the shape into a path
      const dashedLinePath = new Path( dashedLineShape, {
        stroke: 'black',
        lineDash: AXIS_ICON_LINE_DASH
      } );

      icon.setChildren( [ rightArrow, upArrow, darkArrow, dashedLinePath ] );
      return icon;
    }

    // Creates the icon on the radio button for the Triangle component style
    static createCartesianIcon() {

      // create a container for the arrow nodes
      const icon = new Node();

      // the icon has 3 arrows, start with the vector then draw the black vectors as components
      const darkArrowRight = new ArrowNode( 0, 0, ARROW_ICON_SIZE, 0, CARTESIAN_DARK_ARROW_OPTIONS );

      const darkArrowUp = new ArrowNode(
        ARROW_ICON_SIZE, 0, ARROW_ICON_SIZE, -ARROW_ICON_SIZE, CARTESIAN_DARK_ARROW_OPTIONS );

      const cartesianArrow = new ArrowNode( 0, 0, ARROW_ICON_SIZE, -ARROW_ICON_SIZE, ARROW_ICON_OPTIONS );

      // create a label
      const label = new Text( oneString, {
        font: new PhetFont( { size: 8, family: 'Times' } )
      } );

      label.center = darkArrowUp.center;
      label.left = darkArrowUp.right - 2;

      icon.setChildren( [ darkArrowRight, darkArrowUp, cartesianArrow, label ] );
      return icon;
    }

    // Creates the icon on the radio button for the Triangle component style
    static createPolarIcon() {
      // create a container for the arrow nodes
      const icon = new Node();

      // create an arrow
      const arrow = new ArrowNode( 0, 0, ARROW_ICON_SIZE, -ARROW_ICON_SIZE, POLAR_ARROW_OPTIONS );

      // create an arc arrow
      const arcArrow = new ArcArrowNode( 45, ANGLE_ICON_CIRCLE_RADIUS, ANGLE_ICON_OPTIONS );

      // create a baseline
      const line = new Line( 0, 0, ARROW_ICON_SIZE, 0, {
        stroke: 'black'
      } );

      icon.setChildren( [ arrow, arcArrow, line ] );
      return icon;
    }
  }

  vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );

  return VectorAdditionIconFactory;

} );
