// Copyright 2019, University of Colorado Boulder

/**
 * View for the graph, including its axes, grid, and origin dot. The origin dot is draggable, which changes the
 * modelViewTransformProperty of the graph.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
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

  // strings
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );
  const number0String = '0';

  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  // the furthest the user can drag the origin is 5 model units off of the edge of the graph
  const ORIGIN_DRAG_PADDING_CONSTRAINT = 5;

  // grid
  const GRAPH_BACKGROUND = VectorAdditionColors.WHITE;
  const MAJOR_GRID_LINE_WIDTH = 1.8; // model units
  const MAJOR_GRID_LINE_COLOR = VectorAdditionColors.GRAPH_MAJOR_LINE_COLOR;
  const MINOR_GRID_LINE_WIDTH = 1.2;
  const MINOR_GRID_LINE_COLOR = VectorAdditionColors.GRAPH_MINOR_LINE_COLOR;
  const MAJOR_TICK_SPACING = 5; // model units

  // origin
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
  const ORIGIN_TEXT_OPTIONS = {
    font: new PhetFont( 16 ),
    maxWidth: 30
  };

  // axes
  const AXES_ARROW_X_EXTENSION = 20; // how far the line extends past the grid
  const AXES_ARROW_Y_EXTENSION = 15;
  const AXES_ARROW_OPTIONS = {
    doubleHead: true,
    tailWidth: 3,
    headWidth: 10,
    headHeight: 10,
    stroke: null
  };
  const AXES_TEXT_OPTIONS = {
    font: new MathSymbolFont( 20 ),
    maxWidth: 30
  };

  // ticks
  const TICK_LENGTH = 1; // model coordinate
  const TICKS_OPTIONS = {
    lineWidth: 1,
    stroke: VectorAdditionColors.TICKS_COLOR
  };

  //----------------------------------------------------------------------------------------
  class GraphNode extends Node {
    /**
     * @constructor
     * @param {Graph} graph - the model graph for the node
     * @param {BooleanProperty} gridVisibilityProperty
     */
    constructor( graph, gridVisibilityProperty ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( gridVisibilityProperty instanceof BooleanProperty,
        `invalid gridVisibilityProperty: ${gridVisibilityProperty}` );

      // Transform the model grid bounds into the view coordinates. This will stay constant as the background rectangle
      // won't move, even though the model view transform will change
      const graphViewBounds = graph.modelViewTransformProperty.value.modelToViewBounds( graph.graphModelBounds );

      super( {
        children: [
          // background
          new Rectangle( graphViewBounds, { fill: GRAPH_BACKGROUND } ),
          new GridLinesNode( graph, gridVisibilityProperty ),
          new XAxisNode( graph ),
          new YAxisNode( graph ),
          new OriginCircle( graph )
        ]
      } );
    }
  }

  class GridLinesNode extends Node {
    /**
     * @constructor
     * @param {Graph} graph - the model graph for the node
     * @param {BooleanProperty} gridVisibilityProperty
     */
    constructor( graph, gridVisibilityProperty ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( gridVisibilityProperty instanceof BooleanProperty,
        `invalid gridVisibilityProperty: ${gridVisibilityProperty}` );

      super();

      // Create he path for the major grid lines. Initialize it with and an empty shape to be updated later.
      const majorGridLinesPath = new Path( new Shape(), {
        lineWidth: MAJOR_GRID_LINE_WIDTH,
        stroke: MAJOR_GRID_LINE_COLOR
      } );

      // Create the path for the minor grid lines. Initialize it with and an empty shape to be updated later.
      const minorGridLinesPath = new Path( new Shape(), {
        lineWidth: MINOR_GRID_LINE_WIDTH,
        stroke: MINOR_GRID_LINE_COLOR
      } );

      // Update the grid when the modelViewTransform changes (triggered when the origin is moved)
      // Link present for the lifetime of the simulation since graph nodes are never disposed and exists the entire sim.
      graph.modelViewTransformProperty.link( ( modelViewTransform ) => {

        // Convenience variables
        const graphMinX = graph.graphModelBounds.minX;
        const graphMaxX = graph.graphModelBounds.maxX;
        const graphMinY = graph.graphModelBounds.minY;
        const graphMaxY = graph.graphModelBounds.maxY;

        // Create two shapes for the different grid lines.
        const majorGridLinesShape = new Shape();
        const minorGridLinesShape = new Shape();

        //----------------------------------------------------------------------------------------
        // Create the Horizontal Grid Lines.
        for ( let yValue = graphMinY; yValue <= graphMaxY; yValue++ ) {

          const isMajor = yValue % ( MAJOR_TICK_SPACING ) === 0;
          if ( isMajor ) {
            majorGridLinesShape.moveTo( graphMinX, yValue ).horizontalLineTo( graphMaxX );
          }
          else {
            minorGridLinesShape.moveTo( graphMinX, yValue ).horizontalLineTo( graphMaxX );
          }
        }

        //----------------------------------------------------------------------------------------
        // Create the Vertical Grid Lines
        for ( let xValue = graphMinX; xValue <= graphMaxX; xValue++ ) {

          const isMajor = xValue % ( MAJOR_TICK_SPACING ) === 0;
          if ( isMajor ) {
            majorGridLinesShape.moveTo( xValue, graphMinY ).verticalLineTo( graphMaxY );
          }
          else {
            minorGridLinesShape.moveTo( xValue, graphMinY ).verticalLineTo( graphMaxY );
          }
        }
        majorGridLinesPath.setShape( modelViewTransform.modelToViewShape( majorGridLinesShape ) );
        minorGridLinesPath.setShape( modelViewTransform.modelToViewShape( minorGridLinesShape ) );
      } );

      this.setChildren( [ minorGridLinesPath, majorGridLinesPath ] );

      // Observe changes to the grid visibility property, and update visibility. Link exists throughout the entire sim
      // since graphs last the entire sim and are never disposed.
      gridVisibilityProperty.linkAttribute( this, 'visible' );
    }
  }

  class OriginCircle extends ShadedSphereNode {
    /**
     * @constructor
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );

      // convenience variable
      const modelViewTransform = graph.modelViewTransformProperty.value;

      // Get the origin in view coordinates
      const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

      super( ORIGIN_CIRCLE_RADIUS, _.extend( { center: origin }, ORIGIN_CIRCLE_OPTIONS ) );

      //----------------------------------------------------------------------------------------

      // Create a dragBounds to constrain the drag
      const restrictedGraphViewBounds = modelViewTransform.modelToViewBounds(
        graph.graphModelBounds.eroded( ORIGIN_DRAG_PADDING_CONSTRAINT )
      );

      // Create a property of to track the view's origin in view coordinates
      const originLocationProperty = new Vector2Property( origin );

      // Add a drag listener, doesn't need to be removed since the graph exists throughout the entire sim
      this.addInputListener( new DragListener( {
        locationProperty: originLocationProperty,
        translateNode: false,
        dragBoundsProperty: new Property( restrictedGraphViewBounds )
      } ) );

      // Observe the drag listener location. Link present for the lifetime of the simulation since graphs aren't removed
      originLocationProperty.lazyLink( ( originLocation ) => {
        // Tell the model to update the origin
        graph.moveOriginToPoint( graph.modelViewTransformProperty.value.viewToModelPosition( originLocation ) );
      } );

      //----------------------------------------------------------------------------------------
      // Observe when the models model view transform changes to update the location of the circle. This is never
      // unlinked since graphs exists throughout the entire sim. 
      graph.modelViewTransformProperty.link( modelViewTransform => {
        this.center = modelViewTransform.modelToViewPosition( Vector2.ZERO );
      } );
    }
  }

  //----------------------------------------------------------------------------------------
  // Axes nodes
  //----------------------------------------------------------------------------------------

  class AxisNode extends Node {
    /**
     * Abstract class that is used as a general axis.
     * This is extended by xAxisNode and yAxisNode which must provide the abstract methods.
     * @constructor
     *
     * @param {Graph} graph - the model for the graph
     * @param {string} axisLabelText - the label for the axis
     */
    constructor( graph, axisLabelText ) {

      super();

      // @protected {ArrowNode} axisArrow - Create an double arrow that represents the axis. Arbitrary length since the
      // positioning and extent is different for xAxis and yAxis.
      this.axisArrow = new ArrowNode( 0, 0, 1, 1, AXES_ARROW_OPTIONS );

      // @protected {Text} axisLabel - Create a label next to the axis arrow. Label positioning is different for the
      // different axes.
      this.axisLabel = new Text( axisLabelText, AXES_TEXT_OPTIONS );

      // @public {Text} originText - create a label for the origin that will be moved when the modelViewTransform is
      // updated.
      this.originText = new Text( number0String, ORIGIN_TEXT_OPTIONS );

      // Create a path that represents the ticks along the axis with an empty shape which will be updated when the 
      // modelViewTransform is updated.
      const axisTicksPath = new Path( new Shape(), TICKS_OPTIONS );

      // Observe changes to the modelViewTransform and update the axis when changed.
      graph.modelViewTransformProperty.link( ( modelViewTransform ) => {

        // Convenience variable for the position of the origin in view coordinates
        const graphViewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

        // Convenience variables for the grid bounds in view/model coordinates
        const graphModelBounds = graph.graphModelBounds;
        const graphViewBounds = modelViewTransform.modelToViewBounds( graphModelBounds );

        // Update the axis double arrow calling an abstract method
        this.updateAxisArrow( graphViewBounds, graphViewOrigin );

        // Update the labels of the axis calling an abstract method
        this.updateAxisLabels( graphViewOrigin );

        // Get the shape of the ticks along the axis (abstract) in view coordinates
        const ticksShape = this.getUpdatedTicksShape( graphModelBounds, modelViewTransform );

        // Update the axis path
        axisTicksPath.setShape( ticksShape );
      } );
      this.setChildren( [ this.axisArrow, this.axisLabel, axisTicksPath, this.originText ] );
    }

    /**
     * Updates the location of the arrow
     * @abstract
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisArrow( graphViewBounds, graphViewOrigin ) {
      assert && assert( false, 'abstract methods must be implemented' );
    }

    /**
     * Updates the location of the labels (origin label and axis label)
     * @abstract
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisLabels( graphViewOrigin ) { assert && assert( false, 'abstract methods must be implemented' ); }

    /**
     * Gets a new shape for the updated axis ticks
     * @abstract
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     */
    getUpdatedTicksShape( graphModelBounds, modelViewTransform ) {
      assert && assert( false, 'abstract methods must be implemented' );
    }
  }

  class XAxisNode extends AxisNode {
    /**
     * @constructor
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {
      super( graph, symbolXString );

      // Toggle visibility based on different vector orientations
      switch( graph.orientation ) {
        case GraphOrientations.HORIZONTAL:
          this.visible = true;
          this.originText.visible = true;
          break;
        case GraphOrientations.VERTICAL:
          this.visible = false;
          this.originText.visible = false;
          break;
        case GraphOrientations.TWO_DIMENSIONAL:
          this.visible = true;
          this.originText.visible = false;
          break;
        default:
          throw new Error( `Graph orientation not handled: ${graph.orientation}` );
      }
    }

    /**
     * Updates the location of the arrow
     * @abstract
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     */
    updateAxisArrow( graphViewBounds, graphViewOrigin ) {
      this.axisArrow.setTailAndTip(
        graphViewBounds.minX - AXES_ARROW_X_EXTENSION,
        graphViewOrigin.y,
        graphViewBounds.maxX + AXES_ARROW_X_EXTENSION,
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
      // Create ticks along the axis
      const xAxisTicksShape = new Shape();

      // x-axis ticks, add them on every major tick
      for ( let xValue = graphModelBounds.minX; xValue <= graphModelBounds.maxX; xValue++ ) {
        const isMajor = xValue % ( MAJOR_TICK_SPACING ) === 0;

        // The origin has a longer tick
        if ( xValue === 0 ) {
          xAxisTicksShape.moveTo( xValue, -TICK_LENGTH ).verticalLineTo( TICK_LENGTH );
        }
        else if ( isMajor ) {
          xAxisTicksShape.moveTo( xValue, -TICK_LENGTH / 2 ).verticalLineTo( TICK_LENGTH / 2 );
        }
      }
      return modelViewTransform.modelToViewShape( xAxisTicksShape );
    }
  }

  class YAxisNode extends AxisNode {
    /**
     * @constructor
     *
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {
      super( graph, symbolYString );

      // Toggle visibility based on different vector orientations
      switch( graph.orientation ) {
        case GraphOrientations.HORIZONTAL:
          this.visible = false;
          this.originText.visible = false;
          break;
        case GraphOrientations.VERTICAL:
          this.visible = true;
          this.originText.visible = true;
          break;
        case GraphOrientations.TWO_DIMENSIONAL:
          this.visible = true;
          this.originText.visible = false;
          break;
        default:
          throw new Error( `Graph orientation not handled: ${graph.orientation}` );
      }
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
        graphViewBounds.minY - AXES_ARROW_Y_EXTENSION,
        graphViewOrigin.x,
        graphViewBounds.maxY + AXES_ARROW_Y_EXTENSION
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

      // y-axis ticks, add them on every major tick.
      for ( let yValue = graphModelBounds.minY; yValue <= graphModelBounds.maxY; yValue++ ) {
        const isMajor = yValue % ( MAJOR_TICK_SPACING ) === 0;

        // the origin has a longer tick
        if ( yValue === 0 ) {
          yAxisTicksShape.moveTo( -TICK_LENGTH, yValue ).horizontalLineTo( TICK_LENGTH );
        }
        else if ( isMajor ) {
          yAxisTicksShape.moveTo( -TICK_LENGTH / 2, yValue ).horizontalLineTo( TICK_LENGTH / 2 );
        }
      }

      return modelViewTransform.modelToViewShape( yAxisTicksShape );
    }
  }

  return vectorAddition.register( 'GraphNode', GraphNode );
} );