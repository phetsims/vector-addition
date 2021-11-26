// Copyright 2019-2021, University of Colorado Boulder

/**
 * GraphNode draws the graph, including its grid, axes, ticks, and origin manipulator.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import vectorAdditionStrings from '../../vectorAdditionStrings.js';
import Graph from '../model/Graph.js';
import GraphOrientations from '../model/GraphOrientations.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import OriginManipulator from './OriginManipulator.js';

//----------------------------------------------------------------------------------------
// constants

// grid
const MAJOR_GRID_LINE_WIDTH = 1.5; // view units
const MINOR_GRID_LINE_WIDTH = 1; // view units

// axes
const AXES_ARROW_X_EXTENSION = VectorAdditionConstants.AXES_ARROW_X_EXTENSION;
const AXES_ARROW_Y_EXTENSION = VectorAdditionConstants.AXES_ARROW_Y_EXTENSION;

// tick marks
const MAJOR_TICK_SPACING = 5; // model units
const MINOR_TICK_SPACING = 1; // model units
const TICK_LENGTH = 1; // model units
const ORIGIN_TICK_LENGTH = 2; // model units
const TICK_MARK_OPTIONS = {
  lineWidth: 1,
  stroke: Color.BLACK
};

// tick labels
const TICK_LABEL_OPTIONS = {
  font: VectorAdditionConstants.TICK_LABEL_FONT,
  fill: 'rgb( 130, 130, 130 )',
  maxWidth: 30
};
const TICK_LABEL_SPACING = 10; // model units
const TICK_LABEL_X_OFFSET = 15; // from x = 0, view units
const TICK_LABEL_Y_OFFSET = 15; // from y = 0, view units

//----------------------------------------------------------------------------------------

class GraphNode extends Node {

  /**
   * @param {Graph} graph - the model graph for the node
   * @param {BooleanProperty} gridVisibilityProperty
   */
  constructor( graph, gridVisibilityProperty ) {

    assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
    assert && assert( gridVisibilityProperty instanceof BooleanProperty, `invalid gridVisibilityProperty: ${gridVisibilityProperty}` );

    const graphViewBounds = graph.graphViewBounds;

    const background = new Rectangle( graphViewBounds, {
      fill: VectorAdditionColors.GRAPH_BACKGROUND_COLOR,
      stroke: VectorAdditionColors.GRAPH_MINOR_LINE_COLOR,
      lineWidth: MINOR_GRID_LINE_WIDTH
    } );

    const children = [
      background,
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

    children.push( new OriginManipulator( graph ) );

    super( {
      children: children
    } );

    // Clicking in the graph clears the active (selected) vector.
    // Use a raw 'down' listener so that this doesn't impact the ability to touch snag vectors and origin manipulator.
    // See https://github.com/phetsims/vector-addition/issues/243
    // No need to remove, exists for the lifetime of the sim.
    background.addInputListener( {
      down: () => { graph.activeVectorProperty.value = null; }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'GraphNode is not intended to be disposed' );
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
      children: [ minorGridLinesPath, majorGridLines ],
      pickable: false
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

    options = merge( {
      spacing: 1,
      lineWidth: 1,
      stroke: 'black'
    }, options );

    super( new Shape(), options );

    // @private
    this.graphViewBounds = graphViewBounds;

    // Update when the modelViewTransform changes, triggered when the origin is moved.
    // unlink is unnecessary, exists for the lifetime of the sim.
    graph.modelViewTransformProperty.link( modelViewTransform => {

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

    const axisLabel = new Text( vectorAdditionStrings.symbol.x, {
      font: VectorAdditionConstants.AXIS_LABEL_FONT,
      maxWidth: 22,
      left: arrowNode.right + 6,
      centerY: arrowNode.centerY
    } );

    super( {
      children: [ arrowNode, axisLabel ],
      pickable: false
    } );

    // When the origin moves, adjust the position of the axis.
    // unlink is unnecessary, exists for the lifetime of the sim.
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

    const axisLabel = new Text( vectorAdditionStrings.symbol.y, {
      font: VectorAdditionConstants.AXIS_LABEL_FONT,
      maxWidth: 30,
      centerX: arrowNode.centerX,
      bottom: arrowNode.top - 3
    } );

    super( {
      children: [ arrowNode, axisLabel ],
      pickable: false
    } );

    // When the origin moves, adjust the position of the axis.
    // unlink is unnecessary, exists for the lifetime of the sim.
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

    const tickMarksPath = new Path( new Shape(), TICK_MARK_OPTIONS );
    const tickLabelsParent = new Node();
    const originLabel = new Text( '0', TICK_LABEL_OPTIONS );

    super( {
      children: [ tickMarksPath, tickLabelsParent ],
      pickable: false
    } );

    // Update ticks when the graph's origin moves.
    // unlink is unnecessary, exists for the lifetime of the sim.
    graph.modelViewTransformProperty.link( modelViewTransform => {

      const viewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );
      const tickMarksShape = new Shape();
      const tickLabels = [];

      if ( graph.orientation !== GraphOrientations.VERTICAL ) {

        // x tick marks
        const firstXTick = graph.graphModelBounds.minX - ( graph.graphModelBounds.minX % MAJOR_TICK_SPACING );
        for ( let xValue = firstXTick; xValue <= graph.graphModelBounds.maxX; xValue = xValue + MAJOR_TICK_SPACING ) {
          const tickLength = ( xValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH; // origin tick is different
          tickMarksShape.moveTo( xValue, -tickLength / 2 ).verticalLineTo( tickLength / 2 );
        }

        // x tick labels
        const firstXLabel = graph.graphModelBounds.minX - ( graph.graphModelBounds.minX % TICK_LABEL_SPACING );
        for ( let xValue = firstXLabel; xValue <= graph.graphModelBounds.maxX; xValue = xValue + TICK_LABEL_SPACING ) {
          if ( xValue !== 0 ) {
            const tickLabel = new Text( xValue, TICK_LABEL_OPTIONS );
            tickLabel.centerX = modelViewTransform.modelToViewX( xValue );
            tickLabel.top = viewOrigin.y + TICK_LABEL_Y_OFFSET;
            tickLabels.push( tickLabel );
          }
        }
      }

      if ( graph.orientation !== GraphOrientations.HORIZONTAL ) {

        // y tick marks
        const firstYTick = graph.graphModelBounds.minY - ( graph.graphModelBounds.minY % MAJOR_TICK_SPACING );
        for ( let yValue = firstYTick; yValue <= graph.graphModelBounds.maxY; yValue = yValue + MAJOR_TICK_SPACING ) {
          const tickLength = ( yValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH; // origin tick is different
          tickMarksShape.moveTo( -tickLength / 2, yValue ).horizontalLineTo( tickLength / 2 );
        }

        // y tick labels
        const firstYLabel = graph.graphModelBounds.minY - ( graph.graphModelBounds.minY % TICK_LABEL_SPACING );
        for ( let yValue = firstYLabel; yValue <= graph.graphModelBounds.maxY; yValue = yValue + TICK_LABEL_SPACING ) {
          if ( yValue !== 0 ) {
            const tickLabel = new Text( yValue, TICK_LABEL_OPTIONS );
            tickLabel.right = viewOrigin.x - TICK_LABEL_X_OFFSET;
            tickLabel.centerY = modelViewTransform.modelToViewY( yValue );
            tickLabels.push( tickLabel );
          }
        }
      }

      // Origin tick label
      if ( graph.orientation !== GraphOrientations.TWO_DIMENSIONAL ) {

        tickLabels.push( originLabel );

        if ( graph.orientation === GraphOrientations.HORIZONTAL ) {
          originLabel.centerX = viewOrigin.x;
          originLabel.top = viewOrigin.y + TICK_LABEL_Y_OFFSET;
        }
        else {
          originLabel.right = viewOrigin.x - TICK_LABEL_X_OFFSET;
          originLabel.centerY = viewOrigin.y;
        }
      }

      tickMarksPath.shape = modelViewTransform.modelToViewShape( tickMarksShape );
      tickLabelsParent.children = tickLabels;
    } );
  }
}

vectorAddition.register( 'GraphNode', GraphNode );
export default GraphNode;