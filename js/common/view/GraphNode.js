// Copyright 2019, University of Colorado Boulder

/**
 * View for the graph, including its axes, grid, and origin dot. The origin dot is draggable, which changes the
 * modelViewTransformProperty of the graph.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OriginCircle = require( 'VECTOR_ADDITION/common/view/OriginCircle' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // strings
  const symbolXString = require( 'string!VECTOR_ADDITION/symbol.x' );
  const symbolYString = require( 'string!VECTOR_ADDITION/symbol.y' );

  //----------------------------------------------------------------------------------------
  // constants

  // grid
  const MAJOR_GRID_LINE_WIDTH = 1.8; // view units
  const MINOR_GRID_LINE_WIDTH = 1.2; // view units

  // axes
  const AXES_ARROW_X_EXTENSION = 15; // how far the line extends past the grid, view units
  const AXES_ARROW_Y_EXTENSION = 15;
  const AXES_TEXT_OPTIONS = {
    font: VectorAdditionConstants.AXIS_LABEL_FONT,
    maxWidth: 30
  };

  // ticks
  const MAJOR_TICK_SPACING = 5; // model units
  const MINOR_TICK_SPACING = 1; // model units
  const TICK_LENGTH = 1; // model units
  const ORIGIN_TICK_LENGTH = 2; // model units
  const TICKS_OPTIONS = {
    lineWidth: 1,
    stroke: VectorAdditionColors.BLACK
  };

  // tick labels
  const TICK_TEXT_OPTIONS = {
    font: VectorAdditionConstants.TICK_LABEL_FONT,
    maxWidth: 30
  };

  //----------------------------------------------------------------------------------------

  class GraphNode extends Node {

    /**
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

      const children = [
        new Rectangle( graphViewBounds, {
          fill: VectorAdditionColors.WHITE,
          stroke: VectorAdditionColors.GRAPH_MINOR_LINE_COLOR,
          lineWidth: MINOR_GRID_LINE_WIDTH
        } ),
        new GridLinesNode( graph, graphViewBounds, gridVisibilityProperty )
      ];

      // Create axes as needed, based on graph orientation
      if ( graph.orientation !== GraphOrientations.VERTICAL ) {
        children.push( new XAxisNode( graph ) );
      }
      if ( graph.orientation !== GraphOrientations.HORIZONTAL ) {
        children.push( new YAxisNode( graph ) );
      }

      children.push( new OriginCircle( graph ) );

      super( {
        children: children
      } );
    }
  }

  class GridLinesNode extends Node {

    /**
     * @param {Graph} graph - the model graph for the node
     * @param {Bounds2} graphViewBounds
     * @param {BooleanProperty} gridVisibilityProperty
     */
    constructor( graph, graphViewBounds, gridVisibilityProperty ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( gridVisibilityProperty instanceof BooleanProperty,
        `invalid gridVisibilityProperty: ${gridVisibilityProperty}` );

      const majorGridLines = new GridLines( graph, graphViewBounds, {
        spacing: MAJOR_TICK_SPACING,
        lineWidth: MAJOR_GRID_LINE_WIDTH,
        stroke: VectorAdditionColors.GRAPH_MAJOR_LINE_COLOR
      } );

      const minorGridLinesPath = new GridLines( graph, graphViewBounds, {
        spacing: MINOR_TICK_SPACING,
        lineWidth: MINOR_GRID_LINE_WIDTH,
        stroke: VectorAdditionColors.GRAPH_MINOR_LINE_COLOR
      } );

      super( {
        children: [ minorGridLinesPath, majorGridLines ]
      } );

      // Observe changes to the grid visibility Property, and update visibility.
      // No need to unlink since GraphNodes exist for the lifetime of the sim.
      gridVisibilityProperty.linkAttribute( this, 'visible' );
    }
  }

  /**
   * Draws grid lines at some spacing. Used to draw major and minor grid lines.
   * Optimized to take advantage of constant view bounds.
   */
  class GridLines extends Path {

    /**
     * @param {Graph} graph - the model graph for the node
     * @param {Bounds2} graphViewBounds
     * @param {Object} [options]
     */
    constructor( graph, graphViewBounds, options ) {

      options = _.extend( {
        spacing: 1,
        lineWidth: 1,
        stroke: 'black'
      }, options );

      super( new Shape(), options );

      // @private
      this.graphViewBounds = graphViewBounds;

      // Update when the modelViewTransform changes, triggered when the origin is moved.
      // No need to unlink since GraphNodes exist for the lifetime of the sim.
      graph.modelViewTransformProperty.link( ( modelViewTransform ) => {

        // Convenience variables
        const graphMinX = graph.graphModelBounds.minX;
        const graphMaxX = graph.graphModelBounds.maxX;
        const graphMinY = graph.graphModelBounds.minY;
        const graphMaxY = graph.graphModelBounds.maxY;

        const shape = new Shape();

        // Vertical lines
        const firstX = graphMinX - ( graphMinX % options.spacing );
        for ( let xValue = firstX; xValue <= graphMaxX; xValue += options.spacing ) {
          shape.moveTo( xValue, graphMinY ).verticalLineTo( graphMaxY );
        }

        // Horizontal lines
        const firstY = graphMinY - ( graphMinY % options.spacing );
        for ( let yValue = firstY; yValue <= graphMaxY; yValue += options.spacing ) {
          shape.moveTo( graphMinX, yValue ).horizontalLineTo( graphMaxX );
        }

        this.setShape( modelViewTransform.modelToViewShape( shape ) );
      } );
    }

    /**
     * Performance optimization, since the grid's view bounds are constant.
     * @public
     * @override
     * @returns {Bounds2}
     */
    computeShapeBounds() {
       return this.graphViewBounds;
    }
  }

  /**
   * Abstract base class for axes.
   */
  class AxisNode extends Node {

    /**
     * @param {Graph} graph - the model for the graph
     * @param {string} axisLabelString - the label for the axis
     */
    constructor( graph, axisLabelString ) {

      super();

      // @protected {ArrowNode} axisArrow - Create an double arrow that represents the axis. Arbitrary length since the
      // positioning and extent is different for xAxis and yAxis.
      this.axisArrow = new ArrowNode( 0, 0, 1, 1, VectorAdditionConstants.AXES_ARROW_OPTIONS );

      // @protected {Text} axisLabel - Create a label next to the axis arrow. Label positioning is different for the
      // different axes.
      this.axisLabel = new Text( axisLabelString, AXES_TEXT_OPTIONS );

      // Create a path that represents the ticks along the axis with an empty shape which will be updated when the
      // modelViewTransform is updated.
      const tickMarksPath = new Path( new Shape(), TICKS_OPTIONS );

      const children = [ this.axisArrow, this.axisLabel, tickMarksPath ];

      // If the graph is not 2 dimensional, label the origin
      this.originText = null;
      if ( graph.orientation !== GraphOrientations.TWO_DIMENSIONAL ) {

        // @public {Text} originText - create a label for the origin that will be moved when the modelViewTransform is
        // updated.
        this.originText = new Text( '0', TICK_TEXT_OPTIONS );
        children.push( this.originText );
      }

      this.setChildren( children );

      // Observe changes to the modelViewTransform and update the axis when changed.
      graph.modelViewTransformProperty.link( ( modelViewTransform ) => {

        // Graph bounds in view coordinates
        const graphViewBounds = modelViewTransform.modelToViewBounds( graph.graphModelBounds );
        
        // Position of the origin in view coordinates
        const graphViewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

        // Update the axis
        this.updateAxisArrow( graphViewBounds, graphViewOrigin );

        // Update labels on the axis
        this.updateAxisLabels( graphViewOrigin );

        // Update tick marks
        tickMarksPath.setShape( this.createTicksShape( graph.graphModelBounds, modelViewTransform ).makeImmutable() );
      } );
    }

    /**
     * Updates the location of the arrow
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
     * @abstract
     */
    updateAxisArrow( graphViewBounds, graphViewOrigin ) {
      throw new Error( 'abstract method must be implemented by subclass' );
    }

    /**
     * Updates the location of the labels (axis label and origin tick label)
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
     * @abstract
     */
    updateAxisLabels( graphViewOrigin ) {
      throw new Error( 'abstract method must be implemented by subclass' );
    }

    /**
     * Gets a new shape for the updated axis ticks
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     * @protected
     * @abstract
     */
    createTicksShape( graphModelBounds, modelViewTransform ) {
      throw new Error( 'abstract method must be implemented by subclass' );
    }
  }

  class XAxisNode extends AxisNode {

    /**
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {
      super( graph, symbolXString );
    }

    /**
     * Updates the location of the arrow
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
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
     * Updates the location of the labels
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
     */
    updateAxisLabels( graphViewOrigin ) {

      // Update the label that is to the right of the axis
      this.axisLabel.left = this.axisArrow.right + 6;
      this.axisLabel.centerY = graphViewOrigin.y;

      // Update the origin label
      if ( this.originText ) {
        this.originText.centerX = graphViewOrigin.x;
        this.originText.top = graphViewOrigin.y + 20;
      }
    }

    /**
     * Creates the Shape for the x-axis tick marks.
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     * @protected
     */
    createTicksShape( graphModelBounds, modelViewTransform ) {

      // Create ticks along the axis
      const xAxisTicksShape = new Shape();

      const firstTick = graphModelBounds.minX - ( graphModelBounds.minX % MAJOR_TICK_SPACING );
      
      // x-axis major ticks
      for ( let xValue = firstTick; xValue <= graphModelBounds.maxX; xValue = xValue + MAJOR_TICK_SPACING ) {

        // The origin has a longer tick
        const tickLength = ( xValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH;

        xAxisTicksShape.moveTo( xValue, -tickLength / 2 ).verticalLineTo( tickLength / 2 );
      }

      return modelViewTransform.modelToViewShape( xAxisTicksShape );
    }
  }

  class YAxisNode extends AxisNode {
    
    /**
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {
      super( graph, symbolYString );
    }

    /**
     * Updates the location of the arrow
     * @param {Bounds2} graphViewBounds - the bounds of the grid in view coordinates
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
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
     * Updates the location of the labels
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
     */
    updateAxisLabels( graphViewOrigin ) {

      // Update the label that is above the axis
      this.axisLabel.centerX = graphViewOrigin.x;
      this.axisLabel.bottom = this.axisArrow.top - 3;

      // Update the origin label
      if ( this.originText ) {
        this.originText.centerY = graphViewOrigin.y;
        this.originText.right = graphViewOrigin.x - 20;
      }
    }

    /**
     * Creates the Shape for the y-axis tick marks.
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     * @protected
     */
    createTicksShape( graphModelBounds, modelViewTransform ) {

      // create ticks along the axis
      const yAxisTicksShape = new Shape();

      const firstTick = graphModelBounds.minY - ( graphModelBounds.minY % MAJOR_TICK_SPACING );

      // y-axis major ticks
      for ( let yValue = firstTick; yValue <= graphModelBounds.maxY; yValue = yValue + MAJOR_TICK_SPACING ) {

        // The origin has a longer tick
        const tickLength = ( yValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH;

        yAxisTicksShape.moveTo( -tickLength / 2, yValue ).horizontalLineTo( tickLength / 2 );
      }

      return modelViewTransform.modelToViewShape( yAxisTicksShape );
    }
  }

  return vectorAddition.register( 'GraphNode', GraphNode );
} );