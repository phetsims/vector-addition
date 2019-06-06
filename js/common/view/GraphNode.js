// Copyright 2019, University of Colorado Boulder

/**
 * Base type for graphs, displays a 2D grid and axes.
 * The node's origin is at model coordinate (0, 0).
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  // grid
  const GRID_BACKGROUND_OPTIONS = {
    fill: 'white',
    stroke: 'rgb( 192, 192, 192)',
    lineWidth: 1
  };
  const MAJOR_GRID_LINES_OPTIONS = {
    lineWidth: 2,
    stroke: 'rgb( 220, 220, 220 )'
  };
  const MINOR_GRID_LINES_OPTIONS = {
    lineWidth: 1,
    stroke: 'rgb( 230, 230, 230 )'
  };
  const MAJOR_TICK_SPACING = 5;

  // origin circle
  const ORIGIN_CIRCLE_OPTIONS = {
    stroke: 'black',
    fill: 'yellow',
    cursor: 'move'
  };
  // in model coordinates
  const DRAG_PADDING_CONSTRAINT = 5;

  // axis
  const HEAD_WIDTH = 10;
  const HEAD_HEIGHT = 10;
  const TAIL_WIDTH = 3;
  const LINE_EXTENT_X = 20; // how far the line extends past the grid
  const LINE_EXTENT_Y = 15;

  // default options passed to SCENERY_PHET/ArrowNode
  const ARROW_OPTIONS = {
    doubleHead: true,
    tailWidth: TAIL_WIDTH,
    headWidth: HEAD_WIDTH,
    headHeight: HEAD_HEIGHT,
    stroke: null
  };
  // tick length in model coordinates
  const TICK_LENGTH = 1;
  const TICKS_OPTIONS = {
    lineWidth: 1,
    stroke: 'black'
  };
  const ORIGIN_TEXT_OPTIONS = {
    font: new PhetFont( 16 ),
    maxWidth: 30
  };
  const AXIS_LABEL_OPTIONS = {
    font: new MathSymbolFont( 20 ),
    maxWidth: 30
  };

  // strings
  const xString = require( 'string!VECTOR_ADDITION/x' );
  const yString = require( 'string!VECTOR_ADDITION/y' );

  class GraphNode extends Node {
    /**
     * @constructor
     *
     * @param {CommonModel} commonModel - the shared model for all screens
     * between model coordinates and view coordinates
     */
    constructor( commonModel ) {

      // Transform the model grid bounds into the view coordinates.
      // This will stay constant as the background rectangle won't move.
      const gridBounds = commonModel.modelViewTransformProperty.value.modelToViewBounds( commonModel.gridModelBounds );

      // Create a rectangle as the background of the graph.
      const backgroundRectangle = new Rectangle( gridBounds, GRID_BACKGROUND_OPTIONS );

      const xAxisNode = new XAxisNode( commonModel );
      const yAxisNode = new YAxisNode( commonModel );

      super( {
        children: [
          backgroundRectangle,
          new GridLinesNode( commonModel ),
          xAxisNode,
          yAxisNode,
          new OriginCircle( commonModel )
        ]
      } );

      // TODO: remove this as the 1d screen is creating 2 scenes and should toggle
      // visibility of each scene by itself
      // Everything else (2d, lab, etc.) will have everything visible

      // toggle visibility based on different vector orientations
      commonModel.vectorOrientationProperty.link( ( vectorOrientation ) => {
        switch( vectorOrientation ) {
          case VectorOrientation.HORIZONTAL:
            xAxisNode.visible = true;
            yAxisNode.visible = false;
            xAxisNode.setOriginLabelVisibility( true );
            yAxisNode.setOriginLabelVisibility( true );
            break;
          case VectorOrientation.VERTICAL:
            xAxisNode.visible = false;
            yAxisNode.visible = true;
            xAxisNode.setOriginLabelVisibility( true );
            yAxisNode.setOriginLabelVisibility( true );
            break;
          case VectorOrientation.ALL:
            xAxisNode.visible = true;
            yAxisNode.visible = true;
            xAxisNode.setOriginLabelVisibility( false );
            yAxisNode.setOriginLabelVisibility( false );
            break;
          default:
            throw new Error( 'Vector orientation not handled', vectorOrientation );
        }
      } );
    }
  }

  //----------------------------------------------------------------------------------------
  class GridLinesNode extends Node {
    /**
     * @constructor
     * @param {CommonModel} commonModel - the shared model for all screens
     * between model coordinates and view coordinates
     */
    constructor( commonModel ) {

      super();

      // @private {CommonModel}
      this.model = commonModel;

      // @private {Path} the path for the majorGridLines. Initialize it with and an empty shape and set a shape one the
      // modelViewTransformProperty link.
      this.majorGridLinesPath = new Path( new Shape(), MAJOR_GRID_LINES_OPTIONS );

      // @private {Path} the path for the majorGridLines. Initialize it with and an empty shape and set a shape one the
      // modelViewTransformProperty link.
      this.minorGridLinesPath = new Path( new Shape(), MINOR_GRID_LINES_OPTIONS );


      // Update the grid when the modelViewTransform changes (triggered when the origin is moved)
      commonModel.modelViewTransformProperty.link( ( modelViewTransform ) => {
        this.updateGrid( modelViewTransform );
      } );


      this.setChildren( [ this.majorGridLinesPath, this.minorGridLinesPath ] );


    }

    /**
     * The modelViewTransform is changed when the origin is dragged. This method updates the grid based on a
     * modelViewTransform and is called when when a new modelViewTransform is created.
     *
     * @param {ModelViewTransform2} modelViewTransform - the coordinate transform
     * between model coordinates and view coordinates
     *
     * @private
     */
    updateGrid( modelViewTransform ) {

      // convenience variables that get the grid bounds that are updated when the origin is dragged in the model
      const gridMinX = this.model.gridModelBounds.minX;
      const gridMaxX = this.model.gridModelBounds.maxX;
      const gridMinY = this.model.gridModelBounds.minY;
      const gridMaxY = this.model.gridModelBounds.maxY;

      // Create two shapes for the different grid lines.
      const majorGridLinesShape = new Shape();
      const minorGridLinesShape = new Shape();

      // Create the Horizontal Grid Lines
      // Start from the Ceil of the gridMinY to the floor of the gridMaxY because the origin may be dragged so that the
      // minY and maxY are decimal points. With the ceil/floor of this also guarentee that we draw 
      // all the lines visible in the window
      for ( let j = Math.ceil( gridMinY ); j <= Math.floor( gridMaxY ); j++ ) {

        // increment in model coordinates (1 unit)
        const isMajor = j % ( MAJOR_TICK_SPACING ) === 0;

        if ( isMajor ) {
          majorGridLinesShape.moveTo( gridMinX, j ).horizontalLineTo( gridMaxX );
        }
        else {
          minorGridLinesShape.moveTo( gridMinX, j ).horizontalLineTo( gridMaxX );
        }
      }

      // Create the Horizontal Grid Lines
      // Start from the Ceil of the gridMinX to the floor of the gridMaxX because the origin maX be dragged so that the
      // minX and maxX are decimal points. With the ceil/floor of this also guarantees that we draw
      // all the lines visible in the window
      for ( let i = Math.ceil( gridMinX ); i <= Math.floor( gridMaxX ); i++ ) {

        // increment in model coordinates (1 unit)
        const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          majorGridLinesShape.moveTo( i, gridMinY ).verticalLineTo( gridMaxY );
        }
        else {
          minorGridLinesShape.moveTo( i, gridMinY ).verticalLineTo( gridMaxY );
        }
      }

      // Update the grid lines path so that it uses the new shape that is transformed from
      // model coordinates to view coordinates.
      this.majorGridLinesPath.setShape( modelViewTransform.modelToViewShape( majorGridLinesShape ) );
      this.minorGridLinesPath.setShape( modelViewTransform.modelToViewShape( minorGridLinesShape ) );
    }
  }

  //----------------------------------------------------------------------------------------
  class OriginCircle extends Circle {
    /**
     * @constructor
     *
     * @param {CommonModel} commonModel - the shared model for all screens
     *
     */
    constructor( commonModel ) {

      // convenience variable
      const modelViewTransform = commonModel.modelViewTransformProperty.value;

      // the origin in terms of the view;
      const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

      super( 7, _.extend( { center: origin }, ORIGIN_CIRCLE_OPTIONS ) );


      // Create a dragBounds to constrain the drag
      const restrictedGridViewBounds = modelViewTransform.modelToViewBounds(
        commonModel.gridModelBounds.eroded( DRAG_PADDING_CONSTRAINT )
      );

      // Create a property of to track the view's origin in view coordinates
      const originLocationProperty = new Vector2Property( origin );

      this.addInputListener( new DragListener( {
        locationProperty: originLocationProperty,
        translateNode: false,
        dragBoundsProperty: new Property( restrictedGridViewBounds )
      } ) );


      // TODO: wire a reset on originLocationProperty
      originLocationProperty.link( ( originLocation ) => {

        // TODO: abstract snap to grid logic in the model
        const originSnapLocation = modelViewTransform.viewToModelPosition( originLocation ).roundedSymmetric();


        // Update the upperLeftLocation model coordinates
        commonModel.upperLeftPositionProperty.set(
          commonModel.upperLeftPositionProperty.initialValue.minus( originSnapLocation )
        );

        this.center = modelViewTransform.modelToViewPosition( originSnapLocation );

      } );
    }
  }

  //----------------------------------------------------------------------------------------
  class XAxisNode extends Node {
    /**
     * @constructor
     *
     * @param {CommonModel} commonModel - the shared model for all screens
     */
    constructor( commonModel ) {

      super();

      // Create an double arrow that represents the axis that is of length 0 but updated when the modelViewTransform is updated.
      const axisArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );

      // Create a label right side of the axis that labels the axis. This will be moved when the modelViewTransform is updated.
      const axisLabel = new Text( xString, AXIS_LABEL_OPTIONS );

      // Create a path that represents the ticks along the axis with an empty shape which will be updated when the 
      // modelViewTransform is updated.
      const xAxisTicksPath = new Path( new Shape(), TICKS_OPTIONS );

      // @private Create a label for the origin that weill be moved when the modelViewTransform is updated.
      this.xOriginText = new Text( '0', ORIGIN_TEXT_OPTIONS );


      commonModel.modelViewTransformProperty.link( ( modelViewTransform ) => {

        // convenience variables for the position of the origin in view coordinates
        const gridViewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );


        // convenience variables for the grid bounds in view/model coordinates
        const gridModelBounds = commonModel.gridModelBounds;
        const gridViewBounds = modelViewTransform.modelToViewBounds( gridModelBounds );

        // Update the axis double arrow
        axisArrow.setTailAndTip(
          gridViewBounds.minX - LINE_EXTENT_X,
          gridViewOrigin.y,
          gridViewBounds.maxX + LINE_EXTENT_X,
          gridViewOrigin.y
        );

        // Update the label that is to the left of the axis
        axisLabel.left = axisArrow.right + 10;
        axisLabel.centerY = gridViewOrigin.y;

        // create ticks along the axis
        const xAxisTicksShape = new Shape();

        // x-axis ticks, add them on every major ticks
        // Start from the Ceil of the gridMinX to the floor of the gridMaxX because the origin maX be dragged so that the
        // minX and maxX are decimal points. With the ceil/floor of this also guarantees that we draw
        // all the ticks visible in the window.
        for ( let i = Math.ceil( gridModelBounds.minX ); i <= Math.floor( gridModelBounds.maxX ); i++ ) {
          // increment by model coordinates (1 unit)
          const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;

          // the origin has a longer tick
          if ( i === 0 ) {
            xAxisTicksShape.moveTo( i, -TICK_LENGTH ).verticalLineTo( TICK_LENGTH );
          }
          else if ( isMajor ) {
            xAxisTicksShape.moveTo( i, -TICK_LENGTH / 2 ).verticalLineTo( TICK_LENGTH / 2 );
          }
        }

        // Update the axis path
        xAxisTicksPath.setShape( modelViewTransform.modelToViewShape( xAxisTicksShape ) );

        // Update the origin label
        this.xOriginText.centerX = gridViewOrigin.x;
        this.xOriginText.top = gridViewOrigin.y + 20;

      } );

      this.setChildren( [ axisArrow, axisLabel, xAxisTicksPath, this.xOriginText ] );

    }

    /**
     * Set the visibility of the origin label
     * @param {boolean} visible
     * @public
     */
    setOriginLabelVisibility( visible ) {
      this.xOriginText.visible = visible;
    }
  }

  //----------------------------------------------------------------------------------------
  class YAxisNode extends Node {
    /**
     * @constructor
     *
     * @param {CommonModel} commonModel - the shared model for all screens
     */
    constructor( commonModel ) {

      super();

      // Create an double arrow that represents the axis that is of length 0 but updated when the modelViewTransform is updated.
      const axisArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );

      // Create a label right side of the axis that labels the axis. This will be moved when the modelViewTransform is updated.
      const axisLabel = new Text( yString, AXIS_LABEL_OPTIONS );

      // Create a path that represents the ticks along the axis with an empty shape which will be updated when the 
      // modelViewTransform is updated.
      const yAxisTicksPath = new Path( new Shape(), TICKS_OPTIONS );

      // @private Create a label for the origin that weill be moved when the modelViewTransform is updated.
      this.yOriginText = new Text( '0', ORIGIN_TEXT_OPTIONS );


      commonModel.modelViewTransformProperty.link( ( modelViewTransform ) => {

        // convenience variables for the position of the origin in view coordinates
        const gridViewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );


        // convenience variables for the grid bounds in view/model coordinates
        const gridModelBounds = commonModel.gridModelBounds;
        const gridViewBounds = modelViewTransform.modelToViewBounds( gridModelBounds );

        // Update the axis double arrow
        axisArrow.setTailAndTip(
          gridViewOrigin.x,
          gridViewBounds.minY - LINE_EXTENT_Y,
          gridViewOrigin.x,
          gridViewBounds.maxY + LINE_EXTENT_Y
        );

        // Update the label that is to the left of the axis
        axisLabel.centerX = gridViewOrigin.x;
        axisLabel.centerY = axisArrow.top - 10;

        // create ticks along the axis
        const yAxisTicksShape = new Shape();

        // x-axis ticks, add them on every major ticks
        // Start from the Ceil of the gridMinX to the floor of the gridMaxX because the origin maX be dragged so that the
        // minX and maxX are decimal points. With the ceil/floor of this also guarantees that we draw
        // all the ticks visible in the window.
        for ( let i = Math.ceil( gridModelBounds.minY ); i <= Math.floor( gridModelBounds.maxY ); i++ ) {
          // increment by model coordinates (1 unit)
          const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;

          // the origin has a longer tick
          if ( i === 0 ) {
            yAxisTicksShape.moveTo( -TICK_LENGTH, i ).horizontalLineTo( TICK_LENGTH );
          }
          else if ( isMajor ) {
            yAxisTicksShape.moveTo( -TICK_LENGTH / 2, i ).horizontalLineTo( TICK_LENGTH / 2 );
          }
        }

        // Update the axis path
        yAxisTicksPath.setShape( modelViewTransform.modelToViewShape( yAxisTicksShape ) );

        // Update the origin label
        this.yOriginText.centerY = gridViewOrigin.y;
        this.yOriginText.right = gridViewOrigin.x - 20;

      } );

      this.setChildren( [ axisArrow, axisLabel, yAxisTicksPath, this.yOriginText ] );

    }

    /**
     * Set the visibility of the origin label
     * @param {boolean} visible
     * @public
     */
    setOriginLabelVisibility( visible ) {
      this.yOriginText.visible = visible;
    }
  }


  return vectorAddition.register( 'GraphNode', GraphNode );

} );

