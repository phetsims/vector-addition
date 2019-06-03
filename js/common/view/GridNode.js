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

  // tick length in model coordinates
  const TICK_LENGTH = 0.5;

  // width of the tick lines (in view coordinates)
  const TICK_WIDTH = 1;

  // strings
  const xString = require( 'string!VECTOR_ADDITION/x' );
  const yString = require( 'string!VECTOR_ADDITION/y' );

  // const TEXT_FONT = new PhetFont( FONT_SIZE );

  /**
   * @constructor
   */
  class GridNode extends Node {

    /**
     * @param {CommonModel} commonModel
     * @param {ModelViewTransform2} modelViewTransform,
     */
    constructor( commonModel, modelViewTransform ) {

      super();

      const gridMinX = commonModel.gridModelBounds.minX;
      const gridMaxX = commonModel.gridModelBounds.maxX;
      const gridMinY = commonModel.gridModelBounds.minY;
      const gridMaxY = commonModel.gridModelBounds.maxY;

      const gridViewBounds = modelViewTransform.modelToViewBounds( commonModel.gridModelBounds );

      assert && assert( Util.isInteger( gridMinX ) && Util.isInteger( gridMinY ) && //
      Util.isInteger( gridMaxX ) && Util.isInteger( gridMaxY ) );

      const backgroundRectangle = new Rectangle( gridViewBounds,
        {
          fill: GRID_BACKGROUND_FILL,
          stroke: GRID_BACKGROUND_STROKE_COLOR,
          lineWidth: GRID_BACKGROUND_STROKE_WIDTH
        } );

      const majorGridLinesShape = new Shape();
      const minorGridLinesShape = new Shape();

      // horizontal grid lines, one line for each unit of grid spacing
      for ( let j = gridMinY; j < gridMaxY; j++ ) {
        const isMajor = j % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          majorGridLinesShape.moveTo( gridMinX, j ).horizontalLineTo( gridMaxX );
        }
        else {
          minorGridLinesShape.moveTo( gridMinX, j ).horizontalLineTo( gridMaxX );
        }
      }

      // vertical grid lines, one line for each unit of grid spacing
      for ( let i = gridMinX; i < gridMaxX; i++ ) {
        const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          majorGridLinesShape.moveTo( i, gridMinY ).verticalLineTo( gridMaxY );
        }
        else {
          minorGridLinesShape.moveTo( i, gridMinY ).verticalLineTo( gridMaxY );
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

      commonModel.gridVisibleProperty.link( gridVisible => {
        majorGridLinesPath.visible = gridVisible;
        minorGridLinesPath.visible = gridVisible;
      } );

      // axis
      const axisMinX = modelViewTransform.modelToViewX( gridMinX ) - LINE_EXTENT;
      const axisMinY = modelViewTransform.modelToViewY( gridMinY ) + LINE_EXTENT;
      const axisMaxX = modelViewTransform.modelToViewX( gridMaxX ) + LINE_EXTENT;
      const axisMaxY = modelViewTransform.modelToViewY( gridMaxY ) - LINE_EXTENT;
      const originY = modelViewTransform.modelToViewY( 0 );
      const originX = modelViewTransform.modelToViewX( 0 );


      const xAxisLayerNode = new Node();
      const yAxisLayerNode = new Node();

      // x-axis
      const horizontalAxis = new ArrowNode( axisMinX, originY, axisMaxX, originY, ARROW_OPTIONS );

      // label at positive (right) end
      const xLabel = new RichText( xString,
        { font: MATH_FONT, maxWidth: 30, left: axisMaxX + 10, centerY: originY } );

      // y-axis
      const verticalAxis = new ArrowNode( originX, axisMinY, originX, axisMaxY, ARROW_OPTIONS );

      // label above the y axis
      const yLabel = new RichText( yString,
        { font: MATH_FONT, maxWidth: 30, centerX: originX, bottom: axisMaxY - 10 } );

      xAxisLayerNode.addChild( horizontalAxis );
      xAxisLayerNode.addChild( xLabel );

      yAxisLayerNode.addChild( verticalAxis );
      yAxisLayerNode.addChild( yLabel );

      // origin
      const originCircle = new Circle( 7, { centerX: originX, centerY: originY, stroke: 'black', fill: 'yellow' } );

      // create the origin label for both axis
      const xOriginText = new RichText( '0',
        { font: new PhetFont( 16 ), maxWidth: 30, centerX: originX, top: originY + 20 } );

      const yOriginText = new RichText( '0',
        { font: new PhetFont( 16 ), maxWidth: 30, right: originX - 20, centerY: originY } );

      //----------------------------------------------------------------------------------------------------------------
      // create ticks along the x-axis
      const xAxisTicksShape = new Shape();

      // x-axis ticks, add them on every major ticks
      for ( let i = gridMinX; i <= gridMaxX; i++ ) {
        const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          xAxisTicksShape.moveTo( i, -TICK_LENGTH ).verticalLineTo( TICK_LENGTH );
        }
      }
      const xAxisTicksPath = new Path( modelViewTransform.modelToViewShape( xAxisTicksShape ), {
        lineWidth: TICK_WIDTH,
        stroke: 'black'
      } );

      //----------------------------------------------------------------------------------------------------------------
      // create ticks along the y-axis
      const yAxisTicksShape = new Shape();

      // y-axis ticks, add them on every major ticks
      for ( let j = gridMinY; j <= gridMaxY; j++ ) {
        const isMajor = j % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          yAxisTicksShape.moveTo( -TICK_LENGTH, j ).horizontalLineTo( TICK_LENGTH );
        }
      }

      const yAxisTicksPath = new Path( modelViewTransform.modelToViewShape( yAxisTicksShape ), {
        lineWidth: TICK_WIDTH,
        stroke: 'black'
      } );

      // add the ticks paths to their respective layer
      xAxisLayerNode.addChild( xAxisTicksPath );
      yAxisLayerNode.addChild( yAxisTicksPath );

      // add the origin labels to their respective layer
      xAxisLayerNode.addChild( xOriginText );
      yAxisLayerNode.addChild( yOriginText );

      commonModel.vectorOrientationProperty.link( vectorOrientation => {
        // eslint-disable-next-line default-case
        switch( vectorOrientation ) {
          case VectorOrientation.HORIZONTAL:
            xAxisLayerNode.visible = true;
            yAxisLayerNode.visible = false;
            yOriginText.visible = false;
            xOriginText.visible = true;
            break;
          case VectorOrientation.VERTICAL:
            xAxisLayerNode.visible = false;
            yAxisLayerNode.visible = true;
            yOriginText.visible = true;
            xOriginText.visible = false;
            break;
          case VectorOrientation.ALL:
            xAxisLayerNode.visible = true;
            yAxisLayerNode.visible = true;
            yOriginText.visible = false;
            xOriginText.visible = false;
            break;
        }
      } );

      this.addChild( backgroundRectangle );
      this.addChild( majorGridLinesPath );
      this.addChild( minorGridLinesPath );

      this.addChild( xAxisLayerNode );
      this.addChild( yAxisLayerNode );
      this.addChild( originCircle );
    }

  }

  return vectorAddition.register( 'GridNode', GridNode );
} );

