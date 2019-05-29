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

  // constants

  // number of grid lines on the grid icon
  const GRID_LINES = 3;
  const GRID_SPACING = 7;
  const GRID_LINE_WIDTH = 1;
  // 'eye balled'
  const GRID_COLOR = 'rgb( 120, 120, 120 )';

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
    createGridIcon: function() {
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
    }
  };

  vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );

  return VectorAdditionIconFactory;
} );