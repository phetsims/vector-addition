// Copyright 2019, University of Colorado Boulder

/**
 * Base type for graphs, displays a 2D grid and axes.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  //const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  //const Text = require( 'SCENERY/nodes/Text' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

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

  // spacing of major grid lines in model coordinates
  const MAJOR_TICK_SPACING = 5;

  // constants
  const HEAD_WIDTH = 10;
  const HEAD_HEIGHT = 10;
  const TAIL_WIDTH = 3;
  const LINE_EXTENT = 20; // how far the line extends past the grid

  // default options passed to SCENERY_PHET/ArrowNode
  const ARROW_OPTIONS = {
    doubleHead: true,
    tailWidth: TAIL_WIDTH,
    headWidth: HEAD_WIDTH,
    headHeight: HEAD_HEIGHT,
    stroke: null
  };

  /**
   * @constructor
   */
  class GraphNode extends Node {

    /**
     * @param {Property.<VectorOrientation>} vectorOrientationProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Bounds2} modelBounds
     */
    constructor( vectorOrientationProperty, gridVisibleProperty, modelViewTransform, modelBounds ) {

      super();

      assert && assert( Util.isInteger( modelBounds.minX ) && Util.isInteger( modelBounds.minY ) && //
      Util.isInteger( modelBounds.maxX ) && Util.isInteger( modelBounds.maxY ) );

      const backgroundRectangle = new Rectangle( modelViewTransform.modelToViewBounds( modelBounds ),
        {
          fill: GRID_BACKGROUND_FILL,
          stroke: GRID_BACKGROUND_STROKE_COLOR,
          lineWidth: GRID_BACKGROUND_STROKE_WIDTH
        } );

      const majorGridLinesShape = new Shape();
      const minorGridLinesShape = new Shape();

      // horizontal grid lines, one line for each unit of grid spacing
      for ( let j = modelBounds.minY; j < modelBounds.maxY; j++ ) {
        const isMajor = j % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          majorGridLinesShape.moveTo( modelBounds.minX, j )
            .horizontalLineTo( modelBounds.maxX );
        }
        else {
          minorGridLinesShape.moveTo( modelBounds.minX, j )
            .horizontalLineTo( modelBounds.maxX );
        }
      }

      // vertical grid lines, one line for each unit of grid spacing
      for ( let i = modelBounds.minX; i < modelBounds.maxX; i++ ) {
        const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          majorGridLinesShape.moveTo( i, modelBounds.minY )
            .verticalLineTo( modelBounds.maxY );
        }
        else {
          minorGridLinesShape.moveTo( i, modelBounds.minY )
            .verticalLineTo( modelBounds.maxY );
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


      gridVisibleProperty.link( gridVisible => {
        majorGridLinesPath.visible = gridVisible;
        minorGridLinesPath.visible = gridVisible;
      } );

      // axis
      const minX = modelViewTransform.modelToViewX( modelBounds.minX ) - LINE_EXTENT;
      const minY = modelViewTransform.modelToViewY( modelBounds.minY ) + LINE_EXTENT;
      const maxX = modelViewTransform.modelToViewX( modelBounds.maxX ) + LINE_EXTENT;
      const maxY = modelViewTransform.modelToViewY( modelBounds.maxY ) - LINE_EXTENT;

      const originX = modelViewTransform.modelToViewX( 0 );
      const originY = modelViewTransform.modelToViewY( 0 );

      const horizontalAxis = new ArrowNode( minX, originY, maxX, originY, ARROW_OPTIONS );
      const verticalAxis = new ArrowNode( originX, minY, originX, maxY, ARROW_OPTIONS );

      vectorOrientationProperty.link( vectorOrientation => {
        // eslint-disable-next-line default-case
        switch( vectorOrientation ) {
          case VectorOrientation.HORIZONTAL:
            horizontalAxis.visible = true;
            verticalAxis.visible = false;
            break;
          case VectorOrientation.VERTICAL:
            horizontalAxis.visible = false;
            verticalAxis.visible = true;
            break;
          case VectorOrientation.ALL:
            horizontalAxis.visible = true;
            verticalAxis.visible = true;
            break;
        }
      } );

      this.addChild( backgroundRectangle );
      this.addChild( majorGridLinesPath );
      this.addChild( minorGridLinesPath );

      this.addChild( horizontalAxis );
      this.addChild( verticalAxis );
    }

  }

  return vectorAddition.register( 'GraphNode', GraphNode );
} );

