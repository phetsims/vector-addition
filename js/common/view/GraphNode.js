// Copyright 2019, University of Colorado Boulder

/**
 * Base type for graphs, displays a 2D grid and axes.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
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

  const MATH_FONT = new MathSymbolFont( 20 );
  const TICK_LENGTH = 12;

  // strings
  const xString = require( 'string!VECTOR_ADDITION/x' );
  const yString = require( 'string!VECTOR_ADDITION/y' );

  // const TEXT_FONT = new PhetFont( FONT_SIZE );

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
      const originY = modelViewTransform.modelToViewY( 0 );
      const originX = modelViewTransform.modelToViewX( 0 );


      const xAxisLayerNode = new Node();
      const yAxisLayerNode = new Node();


      // x-axis
      const horizontalAxis = new ArrowNode( minX, originY, maxX, originY, ARROW_OPTIONS );

      // label at positive (right) end
      const xLabel = new RichText( xString,
        { font: MATH_FONT, maxWidth: 30, left: maxX + 10, centerY: originY } );


      // y-axis
      const verticalAxis = new ArrowNode( originX, minY, originX, maxY, ARROW_OPTIONS );

      // label above the y axis
      const yLabel = new RichText( yString,
        { font: MATH_FONT, maxWidth: 30, centerX: originX, bottom: maxY - 10 } );

      xAxisLayerNode.addChild( horizontalAxis );
      xAxisLayerNode.addChild( xLabel );

      yAxisLayerNode.addChild( verticalAxis );
      yAxisLayerNode.addChild( yLabel );

      // origin
      const originCircle = new Circle( 7, { centerX: originX, centerY: originY, stroke: 'black', fill: 'yellow' } );


      const xAxisOriginLayerNode = new Node();
      const yAxisOriginLayerNode = new Node();

      const xOriginText = new RichText( '0',
        { font: new PhetFont( 16 ), maxWidth: 30, centerX: originX, top: originY + 20 } );
      const xOriginTick = new Line( originX, originY - TICK_LENGTH, originX, originY + TICK_LENGTH, {
        stroke: 'black'
      } );

      const yOriginText = new RichText( '0',
        { font: new PhetFont( 16 ), maxWidth: 30, right: originX - 20, centerY: originY } );
      const yOriginTick = new Line( originX - TICK_LENGTH, originY, originX + TICK_LENGTH, originY, {
        stroke: 'black'
      } );

      xAxisOriginLayerNode.addChild( xOriginText );
      xAxisOriginLayerNode.addChild( xOriginTick );
      yAxisOriginLayerNode.addChild( yOriginText );
      yAxisOriginLayerNode.addChild( yOriginTick );

      vectorOrientationProperty.link( vectorOrientation => {
        // eslint-disable-next-line default-case
        switch( vectorOrientation ) {
          case VectorOrientation.HORIZONTAL:
            xAxisLayerNode.visible = true;
            yAxisLayerNode.visible = false;
            xAxisOriginLayerNode.visible = true;
            yAxisOriginLayerNode.visible = false;
            break;
          case VectorOrientation.VERTICAL:
            xAxisLayerNode.visible = false;
            yAxisLayerNode.visible = true;
            xAxisOriginLayerNode.visible = false;
            yAxisOriginLayerNode.visible = true;
            break;
          case VectorOrientation.ALL:
            xAxisLayerNode.visible = true;
            yAxisLayerNode.visible = true;
            xAxisOriginLayerNode.visible = false;
            yAxisOriginLayerNode.visible = false;
            break;
        }
      } );

      this.addChild( backgroundRectangle );
      this.addChild( majorGridLinesPath );
      this.addChild( minorGridLinesPath );

      this.addChild( xAxisOriginLayerNode );
      this.addChild( yAxisOriginLayerNode );

      this.addChild( xAxisLayerNode );
      this.addChild( yAxisLayerNode );
      this.addChild( originCircle );
    }

  }

  return vectorAddition.register( 'GraphNode', GraphNode );
} );

