// Copyright 2019, University of Colorado Boulder

/**
 * GraphNode draws the graph, including its grid, axes, ticks, and origin dot.
 * The origin dot is draggable, which changes the modelViewTransformProperty of the graph.
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
        new MajorAndMinorGridLines( graph, graphViewBounds, gridVisibilityProperty ),
        new TicksNode( graph )
      ];

      // Create axes as needed, based on graph orientation
      if ( graph.orientation !== GraphOrientations.VERTICAL ) {
        children.push( new XAxisNode( graph, graphViewBounds ) );
      }
      if ( graph.orientation !== GraphOrientations.HORIZONTAL ) {
        children.push( new YAxisNode( graph, graphViewBounds ) );
      }

      children.push( new OriginCircle( graph ) );

      super( {
        children: children
      } );
    }
  }

  /**
   * Draws the major and minor grid lines.  Handles visibility of the grid.
   */
  class MajorAndMinorGridLines extends Node {

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
   * Draws grid lines at some spacing. Used to draw one type of grid line (major or minor).
   * Updates when the origin changes. Optimized to take advantage of constant view bounds.
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
   * Draws the x axis.
   */
  class XAxisNode extends Node {

    /**
     * @param {Graph} graph
     * @param {Bounds2} graphViewBounds
     */
    constructor( graph, graphViewBounds ) {

      const arrowNode = new ArrowNode(
        graphViewBounds.minX - AXES_ARROW_X_EXTENSION, 0,
        graphViewBounds.maxX + AXES_ARROW_X_EXTENSION, 0,
        VectorAdditionConstants.AXES_ARROW_OPTIONS
      );

      const axisLabel = new Text( symbolXString, _.extend( {}, AXES_TEXT_OPTIONS, {
        left: arrowNode.right + 6,
        centerY: arrowNode.centerY
      } ) );

      super( {
        children: [ arrowNode, axisLabel ]
      } );

      // When the origin moves, adjust the position of the axis.
      // No need to unlink since GraphNodes exist for the lifetime of the sim.
      graph.modelViewTransformProperty.link( modelViewTransform => {
        this.y = modelViewTransform.modelToViewY( 0 );
      } );
    }
  }

  /**
   * Draws the y axis.
   */
  class YAxisNode extends Node {

    /**
     * @param {Graph} graph
     * @param {Bounds2} graphViewBounds
     */
    constructor( graph, graphViewBounds ) {

      const arrowNode = new ArrowNode(
        0, graphViewBounds.minY - AXES_ARROW_Y_EXTENSION,
        0, graphViewBounds.maxY + AXES_ARROW_Y_EXTENSION,
        VectorAdditionConstants.AXES_ARROW_OPTIONS
      );

      const axisLabel = new Text( symbolYString, _.extend( {}, AXES_TEXT_OPTIONS, {
        centerX: arrowNode.centerX,
        bottom: arrowNode.top - 3
      } ) );

      super( {
        children: [ arrowNode, axisLabel ]
      } );

      // When the origin moves, adjust the position of the axis.
      // No need to unlink since GraphNodes exist for the lifetime of the sim.
      graph.modelViewTransformProperty.link( modelViewTransform => {
        this.x = modelViewTransform.modelToViewX( 0 );
      } );
    }
  }

  /**
   * Draws the tick marks and labels.
   */
  class TicksNode extends Node {

    /**
     * @param {Graph} graph
     */
    constructor( graph ) {

      const tickMarksPath = new Path( new Shape(), TICKS_OPTIONS );
      const tickLabelsParent = new Node();
      const originLabel = new Text( '0', TICK_TEXT_OPTIONS );

      super( {
        children: [ tickMarksPath, tickLabelsParent ]
      } );

      graph.modelViewTransformProperty.link( modelViewTransform => {

        const shape = new Shape();

        // x-axis ticks
        if ( graph.orientation !== GraphOrientations.VERTICAL ) {
          const firstXTick = graph.graphModelBounds.minX - ( graph.graphModelBounds.minX % MAJOR_TICK_SPACING );
          for ( let xValue = firstXTick; xValue <= graph.graphModelBounds.maxX; xValue = xValue + MAJOR_TICK_SPACING ) {
            const tickLength = ( xValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH; // origin tick is different
            shape.moveTo( xValue, -tickLength / 2 ).verticalLineTo( tickLength / 2 );
          }
        }

        // y-axis ticks
        if ( graph.orientation !== GraphOrientations.HORIZONTAL ) {
          const firstYTick = graph.graphModelBounds.minY - ( graph.graphModelBounds.minY % MAJOR_TICK_SPACING );
          for ( let yValue = firstYTick; yValue <= graph.graphModelBounds.maxY; yValue = yValue + MAJOR_TICK_SPACING ) {
            const tickLength = ( yValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH; // origin tick is different
            shape.moveTo( -tickLength / 2, yValue ).horizontalLineTo( tickLength / 2 );
          }
        }

        tickMarksPath.shape = modelViewTransform.modelToViewShape( shape );

        // Origin tick label
        tickLabelsParent.removeAllChildren();
        if ( graph.orientation !== GraphOrientations.TWO_DIMENSIONAL ) {

          const viewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

          tickLabelsParent.addChild( originLabel );
          if ( graph.orientation === GraphOrientations.HORIZONTAL ) {
            originLabel.centerX = viewOrigin.x;
            originLabel.top = viewOrigin.y + 20;
          }
          else {
            originLabel.right = viewOrigin.x - 20;
            originLabel.centerY = viewOrigin.y;
          }
        }
      } );
    }
  }

  return vectorAddition.register( 'GraphNode', GraphNode );
} );