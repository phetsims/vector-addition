// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating icons that appear in this sim.
 *
 * @author Brandon Li
 */
define( function( require ) {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const Vector2 = require( 'DOT/Vector2' );
  const Util = require( 'DOT/Util' );
  // constants

  // number of grid lines on the grid icon
  const GRID_LINES = 3;
  const GRID_SPACING = 7;
  const GRID_LINE_WIDTH = 1;
  // 'eye balled'
  const GRID_COLOR = 'rgb( 120, 120, 120 )';

  const ANGLE_ICON_ANGLE = Util.toRadians( 55 );
  const ANGLE_LINE_LENGTH = 20;
  const ANGLE_ICON_CIRCLE_RADIUS = 13;
  const ARROWHEAD_WIDTH = 5;
  const ARC_PATH_COLOR = 'rgb( 50, 50, 50 )';

  // create a object with methods that return icons
  const VectorAdditionIconFactory = {
    /**
     * Creates an arrow icon node
     * @param {number} length is the length of the arrow (horizontal)
     * @param {string} fill is the stroke of the arrow node
     * @constructor
     */
    createArrowIcon: ( length, fill ) => {
      return new ArrowNode( 0, 0, length, 0, {
        fill: fill
      } );
    },

    // Creates an icon that shows the grid of a graph
    createGridIcon: () => {
      const gridShape = new Shape();

      // start with horizontal
      for ( let i = 0; i < GRID_LINES; i++ ) {
        gridShape.moveTo( 0, i * ( GRID_SPACING ) + GRID_SPACING )
          .horizontalLineTo( ( GRID_LINES + 1 ) * GRID_SPACING );
      }
      // now vertical lines
      for ( let j = 0; j < GRID_LINES; j++ ) {
        gridShape.moveTo( j * ( GRID_SPACING ) + GRID_SPACING, 0 )
          .verticalLineTo( ( GRID_LINES + 1 ) * GRID_SPACING );
      }

      return new Path( gridShape, {
        lineWidth: GRID_LINE_WIDTH,
        stroke: GRID_COLOR
      } );
    },

    // Creates an icon that shows a angle
    createAngleIcon: () => {
      // shape for the outline of the icon
      const wedgeShape = new Shape();

      // define the origin at the bottom left (tip of the wedge)
      // start from right and move to the left (origin)
      wedgeShape.moveTo( ANGLE_LINE_LENGTH, 0 );
      wedgeShape.horizontalLineTo( 0 );

      // move to top of the wedge
      wedgeShape.lineTo(
        Math.cos( ANGLE_ICON_ANGLE ) * ANGLE_LINE_LENGTH,
        -1 * Math.sin( ANGLE_ICON_ANGLE ) * ANGLE_LINE_LENGTH );

      // create a shape for the arc inside the wedge
      const arcShape = Shape.arc(
        0,
        0,
        ANGLE_ICON_CIRCLE_RADIUS,
        0,
        // negative angle since the y-axis is pointing down
        -1 * ANGLE_ICON_ANGLE,
        true
      );

      // create the arrowhead shape of the arc
      const arrowheadShape = new Shape();

      // the height of the equilateral triangle 
      const arrowheadHeight = Math.sin( Util.toRadians( 60 ) ) * ARROWHEAD_WIDTH;

      // define the top point of the triangle at (0, 0), the triangle will be translated/rotated later
      arrowheadShape.moveTo( 0, 0 );
      arrowheadShape.lineTo( -1 * ARROWHEAD_WIDTH / 2, arrowheadHeight );
      arrowheadShape.lineTo( ARROWHEAD_WIDTH / 2, arrowheadHeight );
      arrowheadShape.close();

      // create the paths for each shape respectively
      const wedgePath = new Path( wedgeShape, {
        stroke: 'black'
      } );
      const arcPath = new Path( arcShape, {
        stroke: ARC_PATH_COLOR
      } );
      const arrowheadPath = new Path( arrowheadShape, {
        fill: 'black',
        // now transform the arrowhead to fit inside the circle
        rotation: -1 * ANGLE_ICON_ANGLE,
        translation: new Vector2(
          Math.cos( ANGLE_ICON_ANGLE ) * ANGLE_ICON_CIRCLE_RADIUS,
          -1 * Math.sin( ANGLE_ICON_ANGLE ) * ANGLE_ICON_CIRCLE_RADIUS )
      } );

      // add the paths together
      return wedgePath.setChildren( [ arcPath, arrowheadPath ] );
    }
  };

  vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );

  return VectorAdditionIconFactory;
} );