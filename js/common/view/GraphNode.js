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
  const Color = require( 'SCENERY/util/Color' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );

  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  // grid
  const GRAPH_OPTIONS = {
    fill: VectorAdditionColors.GRAPH_BACKGROUND
  };
  const MAJOR_GRID_LINES_OPTIONS = {
    lineWidth: 2,
    stroke: VectorAdditionColors.GRAPH_MAJOR_LINE_COLOR
  };
  const MINOR_GRID_LINES_OPTIONS = {
    lineWidth: 1,
    stroke: VectorAdditionColors.GRAPH_MINOR_LINE_COLOR
  };
  const MAJOR_TICK_SPACING = 5;

  // origin circle
  const ORIGIN_CIRCLE_COLOR = Color.toColor( VectorAdditionColors.ORIGIN_DOT_COLOR );
  const ORIGIN_CIRCLE_RADIUS = 15;
  const ORIGIN_CIRCLE_OPTIONS = {
    renderer: 'canvas',
    cursor: 'move',
    fill: ORIGIN_CIRCLE_COLOR.withAlpha( 0.15 ),
    mainColor: ORIGIN_CIRCLE_COLOR,
    highlightColor: Color.WHITE,
    shadowColor: ORIGIN_CIRCLE_COLOR.darkerColor(),
    lineWidth: 1,
    stroke: ORIGIN_CIRCLE_COLOR.darkerColor()
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
    stroke: VectorAdditionColors.TICKS_COLOR
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
  const number0String = '0';

  class GraphNode extends Node {
    /**
     * @constructor
     *
     * @param {Graph} graph - the model graph for the node
     * @param {BooleanProperty} gridVisibilityProperty
     */
    constructor( graph, gridVisibilityProperty ) {

      // Transform the model grid bounds into the view coordinates.
      // This will stay constant as the background rectangle won't move.
      const graphBounds = graph.modelViewTransformProperty.value.modelToViewBounds( graph.graphModelBounds );

      // Create a rectangle as the background of the graph.
      const backgroundRectangle = new Rectangle( graphBounds, GRAPH_OPTIONS );

      const xAxisNode = new XAxisNode( graph );
      const yAxisNode = new YAxisNode( graph );
      const originCircle = new OriginCircle( graph );

      const gridLinesNode = new GridLinesNode( graph );

      // present for the lifetime of the simulation
      gridVisibilityProperty.linkAttribute( gridLinesNode, 'visible' );

      super( {
        children: [
          backgroundRectangle,
          gridLinesNode,
          xAxisNode,
          yAxisNode,
          originCircle
        ]
      } );

      // @private
      this.originCircle = originCircle;

      const vectorOrientation = graph.orientation;

      // toggle visibility based on different vector orientations
      switch( vectorOrientation ) {
        case VectorOrientations.HORIZONTAL:
          xAxisNode.visible = true;
          yAxisNode.visible = false;
          xAxisNode.setOriginLabelVisibility( true );
          yAxisNode.setOriginLabelVisibility( true );
          break;
        case VectorOrientations.VERTICAL:
          xAxisNode.visible = false;
          yAxisNode.visible = true;
          xAxisNode.setOriginLabelVisibility( true );
          yAxisNode.setOriginLabelVisibility( true );
          break;
        case VectorOrientations.TWO_DIMENSIONAL:
          xAxisNode.visible = true;
          yAxisNode.visible = true;
          xAxisNode.setOriginLabelVisibility( false );
          yAxisNode.setOriginLabelVisibility( false );
          break;
        default:
          throw new Error( `Vector orientation not handled: ${vectorOrientation}` );
      }
    }

    // @public
    reset() {
      this.originCircle.reset();
    }
  }

  //----------------------------------------------------------------------------------------
  class GridLinesNode extends Node {
    /**
     * @constructor
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {

      super();

      // @private {graph}
      this.graph = graph;

      // @private {Path} the path for the majorGridLines. Initialize it with and an empty shape and set a shape one the
      // modelViewTransformProperty link.
      this.majorGridLinesPath = new Path( new Shape(), MAJOR_GRID_LINES_OPTIONS );

      // @private {Path} the path for the majorGridLines. Initialize it with and an empty shape and set a shape one the
      // modelViewTransformProperty link.
      this.minorGridLinesPath = new Path( new Shape(), MINOR_GRID_LINES_OPTIONS );

      // Update the grid when the modelViewTransform changes (triggered when the origin is moved)
      // link present for the lifetime of the simulation
      graph.modelViewTransformProperty.link( ( modelViewTransform ) => {
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
      const graphMinX = this.graph.graphModelBounds.minX;
      const graphMaxX = this.graph.graphModelBounds.maxX;
      const graphMinY = this.graph.graphModelBounds.minY;
      const graphMaxY = this.graph.graphModelBounds.maxY;

      // Create two shapes for the different grid lines.
      const majorGridLinesShape = new Shape();
      const minorGridLinesShape = new Shape();

      // Create the Horizontal Grid Lines
      // Start from the Ceil of the graphMinY to the floor of the graphMaxY because the origin may be dragged so that the
      // minY and maxY are decimal points. With the ceil/floor of this also guarantees that we draw
      // all the lines visible in the window
      for ( let j = Math.ceil( graphMinY ); j <= Math.floor( graphMaxY ); j++ ) {

        // increment in model coordinates (1 unit)
        const isMajor = j % ( MAJOR_TICK_SPACING ) === 0;

        if ( isMajor ) {
          majorGridLinesShape.moveTo( graphMinX, j ).horizontalLineTo( graphMaxX );
        }
        else {
          minorGridLinesShape.moveTo( graphMinX, j ).horizontalLineTo( graphMaxX );
        }
      }

      // Create the Horizontal Grid Lines
      // Start from the Ceil of the graphMinX to the floor of the graphMaxX because the origin maX be dragged so that the
      // minX and maxX are decimal points. With the ceil/floor of this also guarantees that we draw
      // all the lines visible in the window
      for ( let i = Math.ceil( graphMinX ); i <= Math.floor( graphMaxX ); i++ ) {

        // increment in model coordinates (1 unit)
        const isMajor = i % ( MAJOR_TICK_SPACING ) === 0;
        if ( isMajor ) {
          majorGridLinesShape.moveTo( i, graphMinY ).verticalLineTo( graphMaxY );
        }
        else {
          minorGridLinesShape.moveTo( i, graphMinY ).verticalLineTo( graphMaxY );
        }
      }

      // Update the grid lines path so that it uses the new shape that is transformed from
      // model coordinates to view coordinates.
      this.majorGridLinesPath.setShape( modelViewTransform.modelToViewShape( majorGridLinesShape ) );
      this.minorGridLinesPath.setShape( modelViewTransform.modelToViewShape( minorGridLinesShape ) );
    }
  }

  //----------------------------------------------------------------------------------------
  class OriginCircle extends ShadedSphereNode {
    /**
     * @constructor
     *
     * @param {Graph} graph - the model for the graph
     *
     */
    constructor( graph ) {

      // convenience variable
      const modelViewTransform = graph.modelViewTransformProperty.value;

      // the origin in terms of the view;
      const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

      super( ORIGIN_CIRCLE_RADIUS, _.extend( { center: origin }, ORIGIN_CIRCLE_OPTIONS ) );

      // Create a dragBounds to constrain the drag
      const restrictedGraphViewBounds = modelViewTransform.modelToViewBounds(
        graph.graphModelBounds.eroded( DRAG_PADDING_CONSTRAINT )
      );

      // @private Create a property of to track the view's origin in view coordinates
      this.originLocationProperty = new Vector2Property( origin );

      this.addInputListener( new DragListener( {
        locationProperty: this.originLocationProperty,
        translateNode: false,
        dragBoundsProperty: new Property( restrictedGraphViewBounds )
      } ) );

      // link present for the lifetime of the simulation
      this.originLocationProperty.link( ( originLocation ) => {

        // TODO: abstract snap to grid logic in the model
        const originSnapLocation = modelViewTransform.viewToModelPosition( originLocation ).roundedSymmetric();

        // Update the upperLeftPosition model coordinates
        graph.upperLeftPositionProperty.value = graph.upperLeftPositionProperty.initialValue.minus( originSnapLocation );

        this.center = modelViewTransform.modelToViewPosition( originSnapLocation );

      } );
    }

    // @public
    reset() {
      this.originLocationProperty.reset();
    }
  }

  //----------------------------------------------------------------------------------------
  class AxisNode extends Node {
    /**
     * @abstract
     * Abstract class that is used as a general axis.
     * This is extended by xAxisNode and yAxisNode which must provide the abstract methods.
     * @constructor
     *
     * @param {Graph} graph - the model for the graph
     * @param {string} axisLabelText - the label for the axis
     */
    constructor( graph, axisLabelText ) {

      super();

      // @public {ArrowNode} axisArrow - Create an double arrow that represents the axis that is of length 0 but updated
      // when the modelViewTransform is updated.
      this.axisArrow = new ArrowNode( 0, 0, 0, 0, ARROW_OPTIONS );

      // @public {Text} axisLabel - Create a label right side of the axis that labels the axis. This will be moved when
      // the modelViewTransform is updated.
      this.axisLabel = new Text( axisLabelText, AXIS_LABEL_OPTIONS );

      // Create a path that represents the ticks along the axis with an empty shape which will be updated when the 
      // modelViewTransform is updated.
      const axisTicksPath = new Path( new Shape(), TICKS_OPTIONS );

      // @public {Text} originText - create a label for the origin that will be moved when the modelViewTransform is updated.
      this.originText = new Text( number0String, ORIGIN_TEXT_OPTIONS );

      // Observe changes to the modelViewTransform and update the axis when changed.
      graph.modelViewTransformProperty.link( ( modelViewTransform ) => {

        // convenience variable for the position of the origin in view coordinates
        const graphViewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

        // convenience variables for the grid bounds in view/model coordinates
        const graphModelBounds = graph.graphModelBounds;
        const graphViewBounds = modelViewTransform.modelToViewBounds( graphModelBounds );

        // Update the axis double arrow
        // updateAxisArrow is an ABSTRACT method and MUST be provided
        this.updateAxisArrow( graphViewBounds, graphViewOrigin );

        // Update the labels of the axis
        // Also a abstract method
        this.updateAxisLabels( graphViewOrigin );

        // get the shape of the ticks along the axis (abstract) in view coordinates
        const newTicksShape = this.getUpdatedTicksShape( graphModelBounds, modelViewTransform );

        // Update the axis path
        axisTicksPath.setShape( newTicksShape );

      } );

      this.setChildren( [ this.axisArrow, this.axisLabel, axisTicksPath, this.originText ] );
    }

    /**
     * Updates the location of the arrow
     * @abstract
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisArrow( graphViewBounds, graphViewOrigin ) {}

    /**
     * Updates the location of the labels (origin label and axis label)
     * @abstract
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisLabels( graphViewOrigin ) {}

    /**
     * Gets a new shape for the updated axis ticks
     * @abstract
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     */
    getUpdatedTicksShape( graphModelBounds, modelViewTransform ) {}

    /**
     * Set the visibility of the origin label
     * @param {boolean} visible
     * @public
     */
    setOriginLabelVisibility( visible ) {
      this.originText.visible = visible;
    }
  }

  //----------------------------------------------------------------------------------------
  class XAxisNode extends AxisNode {
    /**
     * @constructor
     *
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {
      super( graph, xString );
    }

    /**
     * Updates the location of the arrow
     * @abstract
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisArrow( graphViewBounds, graphViewOrigin ) {
      this.axisArrow.setTailAndTip(
        graphViewBounds.minX - LINE_EXTENT_X,
        graphViewOrigin.y,
        graphViewBounds.maxX + LINE_EXTENT_X,
        graphViewOrigin.y
      );
    }

    /**
     * Updates the location of the labels (origin label and axis label)
     * @abstract
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisLabels( graphViewOrigin ) {
      // Update the label that is to the left of the axis
      this.axisLabel.left = this.axisArrow.right + 10;
      this.axisLabel.centerY = graphViewOrigin.y;

      // Update the origin label
      this.originText.centerX = graphViewOrigin.x;
      this.originText.top = graphViewOrigin.y + 20;
    }

    /**
     * Gets a new shape for the updated axis ticks
     * @abstract
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     */
    getUpdatedTicksShape( graphModelBounds, modelViewTransform ) {
      // create ticks along the axis
      const xAxisTicksShape = new Shape();

      // x-axis ticks, add them on every major ticks
      // Start from the Ceil of the graphMinX to the floor of the graphMaxX because the origin maX be dragged so that the
      // minX and maxX are decimal points. With the ceil/floor of this also guarantees that we draw
      // all the ticks visible in the window.
      for ( let i = Math.ceil( graphModelBounds.minX ); i <= Math.floor( graphModelBounds.maxX ); i++ ) {
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

      return modelViewTransform.modelToViewShape( xAxisTicksShape );
    }
  }

  //----------------------------------------------------------------------------------------
  class YAxisNode extends AxisNode {
    /**
     * @constructor
     *
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {
      super( graph, yString );
    }

    /**
     * Updates the location of the arrow
     * @abstract
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisArrow( graphViewBounds, graphViewOrigin ) {
      this.axisArrow.setTailAndTip(
        graphViewOrigin.x,
        graphViewBounds.minY - LINE_EXTENT_Y,
        graphViewOrigin.x,
        graphViewBounds.maxY + LINE_EXTENT_Y
      );
    }

    /**
     * Updates the location of the labels (origin label and axis label)
     * @abstract
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisLabels( graphViewOrigin ) {
      // Update the label that is to the left of the axis
      this.axisLabel.centerX = graphViewOrigin.x;
      this.axisLabel.centerY = this.axisArrow.top - 10;

      // Update the origin label
      this.originText.centerY = graphViewOrigin.y;
      this.originText.right = graphViewOrigin.x - 20;
    }

    /**
     * Gets a new shape for the updated axis ticks
     * @abstract
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     */
    getUpdatedTicksShape( graphModelBounds, modelViewTransform ) {
      // create ticks along the axis
      const yAxisTicksShape = new Shape();

      // y-axis ticks, add them on every major ticks
      // Start from the Ceil of the graphMinY to the floor of the graphMaxY because the origin maxY be dragged so that the
      // minY and maxY are decimal points. With the ceil/floor of this also guarantees that we draw
      // all the ticks visible in the window.
      for ( let i = Math.ceil( graphModelBounds.minY ); i <= Math.floor( graphModelBounds.maxY ); i++ ) {
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

      return modelViewTransform.modelToViewShape( yAxisTicksShape );

    }
  }

  return vectorAddition.register( 'GraphNode', GraphNode );

} );

