// Copyright 2019, University of Colorado Boulder

/**
 * Base type for graphs, displays a 2D grid and axes.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  //const Line = require( 'SCENERY/nodes/Line' );
  //const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  //const Text = require( 'SCENERY/nodes/Text' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  // background
  const GRID_BACKGROUND_FILL = VectorAdditionConstants.GRID_BACKGROUND_FILL;
  const GRID_BACKGROUND_STROKE_COLOR = VectorAdditionConstants.GRID_BACKGROUND_STROKE_COLOR;
  const GRID_BACKGROUND_STROKE_WIDTH = VectorAdditionConstants.GRID_BACKGROUND_STROKE_WIDTH;

  // grid
  const MAJOR_GRID_STROKE_WIDTH = VectorAdditionConstants.MAJOR_GRID_STROKE_WIDTH;
  const MAJOR_GRID_STROKE_COLOR = VectorAdditionConstants.MAJOR_GRID_STROKE_COLOR;
  const MINOR_GRID_STROKE_WIDTH = VectorAdditionConstants.MINOR_GRID_STROKE_WIDTH;
  const MINOR_GRID_STROKE_COLOR = VectorAdditionConstants.MINOR_GRID_STROKE_COLOR;

  // dimension of grid in model coordinates
  const GRAPH_MODEL_WIDTH = VectorAdditionConstants.GRAPH_MODEL_WIDTH;
  const GRAPH_MODEL_HEIGHT = VectorAdditionConstants.GRAPH_MODEL_HEIGHT;
  const MAJOR_TICK_SPACING = 5;

  const modelBounds = new Bounds2( 0, 0, 60, 40 );

  /**
   * @constructor
   */
  class GraphNode extends Node {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( modelViewTransform ) {

      super();

      const backgroundRectangle = new Rectangle( modelViewTransform.modelToViewBounds( modelBounds ),
        {
          fill: GRID_BACKGROUND_FILL,
          stroke: GRID_BACKGROUND_STROKE_COLOR,
          lineWidth: GRID_BACKGROUND_STROKE_WIDTH
        } );

      const majorGridLinesShape = new Shape();
      const minorGridLinesShape = new Shape();

      // horizontal grid lines, one line for each unit of grid spacing
      for ( let j = 0; j < GRAPH_MODEL_HEIGHT; j++ ) {
        if ( j !== 0 ) { // skip origin, x axis will live here
          const isMajor = j % ( MAJOR_TICK_SPACING ) === 0;
          if ( isMajor ) {
            majorGridLinesShape.moveTo( 0, j )
              .horizontalLineTo( GRAPH_MODEL_WIDTH );
          }
          else {
            minorGridLinesShape.moveTo( 0, j )
              .horizontalLineTo( GRAPH_MODEL_WIDTH );
          }
        }
      }

      // vertical grid lines, one line for each unit of grid spacing
      for ( let i = 0; i < GRAPH_MODEL_WIDTH; i++ ) {
        if ( i !== 0 ) { // skip origin, y axis will live here
          const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;
          if ( isMajor ) {
            majorGridLinesShape.moveTo( i, 0 )
              .verticalLineTo( GRAPH_MODEL_HEIGHT );
          }
          else {
            minorGridLinesShape.moveTo( i, 0 )
              .verticalLineTo( GRAPH_MODEL_HEIGHT );
          }
        }
      }

      const majorGridLinesPath = new Path( modelViewTransform.modelToViewShape( majorGridLinesShape ), {
        lineWidth: MAJOR_GRID_STROKE_WIDTH,
        stroke: MAJOR_GRID_STROKE_COLOR
      } );
      const minorGridLinesPath = new Path( modelViewTransform.modelToViewShape( minorGridLinesShape ), {
        lineWidth: MINOR_GRID_STROKE_WIDTH,
        stroke: MINOR_GRID_STROKE_COLOR
      } );

      this.addChild( backgroundRectangle );
      this.addChild( majorGridLinesPath );
      this.addChild( minorGridLinesPath );
    }

  }

  return vectorAddition.register( 'GraphNode', GraphNode );
} );

