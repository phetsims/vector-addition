// Copyright 2019-2025, University of Colorado Boulder

/**
 * GraphNode draws the graph, including its grid, axes, ticks, and origin manipulator.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionSymbols from '../VectorAdditionSymbols.js';
import OriginManipulator from './OriginManipulator.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Graph from '../model/Graph.js';

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
  stroke: VectorAdditionColors.graphTickLineColorProperty
};

// tick labels
const TICK_LABEL_OPTIONS = {
  font: VectorAdditionConstants.TICK_LABEL_FONT,
  fill: VectorAdditionColors.graphTickLabelColorProperty,
  maxWidth: 30
};
const TICK_LABEL_SPACING = 10; // model units
const TICK_LABEL_X_OFFSET = 15; // from x = 0, view units
const TICK_LABEL_Y_OFFSET = 15; // from y = 0, view units

export default class GraphNode extends Node {

  // Public for pdomOrder at ScreenView level.
  public readonly originManipulator: Node;

  public constructor( scene: VectorAdditionScene, gridVisibilityProperty: Property<boolean>, tandem: Tandem ) {

    const graph = scene.graph;

    const graphViewBounds = graph.viewBounds;

    const background = new Rectangle( graphViewBounds, {
      fill: VectorAdditionColors.graphBackgroundColorProperty,
      stroke: VectorAdditionColors.graphMinorLineColorProperty,
      lineWidth: MINOR_GRID_LINE_WIDTH
    } );

    const children = [
      background,
      new MajorAndMinorGridLines( graph, graphViewBounds, gridVisibilityProperty ),
      new TicksNode( scene.graph )
    ];

    // Create axes as needed, based on scene orientation
    if ( graph.orientation !== 'vertical' ) {
      children.push( new XAxisNode( graph, graphViewBounds ) );
    }
    if ( graph.orientation !== 'horizontal' ) {
      children.push( new YAxisNode( graph, graphViewBounds ) );
    }

    const originManipulator = new OriginManipulator( graph, tandem.createTandem( 'originManipulator' ) );
    children.push( originManipulator );

    super( {
      isDisposable: false,
      children: children,
      tandem: tandem
    } );

    this.originManipulator = originManipulator;

    // Clicking on the graph clears the active (selected) vector.
    // Use a raw 'down' listener so that this doesn't impact the ability to touch snag vectors and origin manipulator.
    // See https://github.com/phetsims/vector-addition/issues/243
    background.addInputListener( {
      down: () => { scene.activeVectorProperty.value = null; }
    } );

    this.addLinkedElement( scene.graph );
  }
}

/**
 * Draws the major and minor grid lines.  Handles visibility of the grid.
 */
class MajorAndMinorGridLines extends Node {

  public constructor( graph: Graph, graphViewBounds: Bounds2, gridVisibilityProperty: Property<boolean> ) {

    const majorGridLines = new GridLines( graph, graphViewBounds, {
      spacing: MAJOR_TICK_SPACING,
      lineWidth: MAJOR_GRID_LINE_WIDTH,
      stroke: VectorAdditionColors.graphMajorLineColorProperty
    } );

    const minorGridLinesPath = new GridLines( graph, graphViewBounds, {
      spacing: MINOR_TICK_SPACING,
      lineWidth: MINOR_GRID_LINE_WIDTH,
      stroke: VectorAdditionColors.graphMinorLineColorProperty
    } );

    super( {
      isDisposable: false,
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

type GridLinesSelfOptions = {
  spacing?: number;
};

type GridLinesOptions = GridLinesSelfOptions & PickOptional<PathOptions, 'lineWidth' | 'stroke'>;

class GridLines extends Path {

  private readonly viewBounds: Bounds2;

  public constructor( graph: Graph, viewBounds: Bounds2, providedOptions?: GridLinesOptions ) {

    const options = optionize<GridLinesOptions, GridLinesSelfOptions, PathOptions>()( {

      // GridLinesSelfOptions
      spacing: 1,

      // PathOptions
      isDisposable: false,
      lineWidth: 1,
      stroke: 'black'
    }, providedOptions );

    super( new Shape(), options );

    this.viewBounds = viewBounds;

    // Update when the modelViewTransform changes, triggered when the origin is moved.
    graph.modelViewTransformProperty.link( modelViewTransform => {

      // Convenience variables
      const graphBounds = graph.bounds;
      const graphMinX = graphBounds.minX;
      const graphMaxX = graphBounds.maxX;
      const graphMinY = graphBounds.minY;
      const graphMaxY = graphBounds.maxY;

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
   */
  public override computeShapeBounds(): Bounds2 {
    return this.viewBounds;
  }
}

/**
 * Draws the x-axis.
 */
class XAxisNode extends Node {

  public constructor( graph: Graph, graphViewBounds: Bounds2 ) {

    const arrowNode = new ArrowNode(
      graphViewBounds.minX - AXES_ARROW_X_EXTENSION, 0,
      graphViewBounds.maxX + AXES_ARROW_X_EXTENSION, 0,
      VectorAdditionConstants.AXES_ARROW_OPTIONS
    );

    const axisLabel = new Text( VectorAdditionSymbols.xStringProperty, {
      font: VectorAdditionConstants.AXIS_LABEL_FONT,
      maxWidth: 22,
      left: arrowNode.right + 6,
      centerY: arrowNode.centerY
    } );

    // Center the label on the axis.
    axisLabel.localBoundsProperty.link( () => {
      axisLabel.left = arrowNode.right + 6;
      axisLabel.centerY = arrowNode.centerY;
    } );

    super( {
      isDisposable: false,
      children: [ arrowNode, axisLabel ],
      pickable: false
    } );

    // When the origin moves, adjust the position of the axis.
    graph.modelViewTransformProperty.link( modelViewTransform => {
      this.y = modelViewTransform.modelToViewY( 0 );
    } );
  }
}

/**
 * Draws the y-axis.
 */
class YAxisNode extends Node {

  public constructor( graph: Graph, graphViewBounds: Bounds2 ) {

    const arrowNode = new ArrowNode(
      0, graphViewBounds.minY - AXES_ARROW_Y_EXTENSION,
      0, graphViewBounds.maxY + AXES_ARROW_Y_EXTENSION,
      VectorAdditionConstants.AXES_ARROW_OPTIONS
    );

    const axisLabel = new Text( VectorAdditionStrings.symbol.yStringProperty, {
      font: VectorAdditionConstants.AXIS_LABEL_FONT,
      maxWidth: 30
    } );

    // Center the label on the axis.
    axisLabel.localBoundsProperty.link( () => {
      axisLabel.centerX = arrowNode.centerX;
      axisLabel.bottom = arrowNode.top - 3;
    } );

    super( {
      isDisposable: false,
      children: [ arrowNode, axisLabel ],
      pickable: false
    } );

    // When the origin moves, adjust the position of the axis.
    graph.modelViewTransformProperty.link( modelViewTransform => {
      this.x = modelViewTransform.modelToViewX( 0 );
    } );
  }
}

/**
 * Draws the tick marks and labels.
 */
class TicksNode extends Node {

  public constructor( graph: Graph ) {

    const tickMarksPath = new Path( new Shape(), TICK_MARK_OPTIONS );
    const tickLabelsParent = new Node();
    const originLabel = new Text( '0', TICK_LABEL_OPTIONS );

    super( {
      isDisposable: false,
      children: [ tickMarksPath, tickLabelsParent ],
      pickable: false
    } );

    // Update ticks when the scene's origin moves.
    // unlink is unnecessary, exists for the lifetime of the sim.
    graph.modelViewTransformProperty.link( modelViewTransform => {

      const viewOrigin = modelViewTransform.modelToViewPosition( Vector2.ZERO );
      const tickMarksShape = new Shape();
      const tickLabels = [];

      if ( graph.orientation !== 'vertical' ) {

        // x tick marks
        const firstXTick = graph.bounds.minX - ( graph.bounds.minX % MAJOR_TICK_SPACING );
        for ( let xValue = firstXTick; xValue <= graph.bounds.maxX; xValue = xValue + MAJOR_TICK_SPACING ) {
          const tickLength = ( xValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH; // origin tick is different
          tickMarksShape.moveTo( xValue, -tickLength / 2 ).verticalLineTo( tickLength / 2 );
        }

        // x tick labels
        const firstXLabel = graph.bounds.minX - ( graph.bounds.minX % TICK_LABEL_SPACING );
        for ( let xValue = firstXLabel; xValue <= graph.bounds.maxX; xValue = xValue + TICK_LABEL_SPACING ) {
          if ( xValue !== 0 ) {
            const tickLabel = new Text( xValue, TICK_LABEL_OPTIONS );
            tickLabel.centerX = modelViewTransform.modelToViewX( xValue );
            tickLabel.top = viewOrigin.y + TICK_LABEL_Y_OFFSET;
            tickLabels.push( tickLabel );
          }
        }
      }

      if ( graph.orientation !== 'horizontal' ) {

        // y tick marks
        const firstYTick = graph.bounds.minY - ( graph.bounds.minY % MAJOR_TICK_SPACING );
        for ( let yValue = firstYTick; yValue <= graph.bounds.maxY; yValue = yValue + MAJOR_TICK_SPACING ) {
          const tickLength = ( yValue === 0 ) ? ORIGIN_TICK_LENGTH : TICK_LENGTH; // origin tick is different
          tickMarksShape.moveTo( -tickLength / 2, yValue ).horizontalLineTo( tickLength / 2 );
        }

        // y tick labels
        const firstYLabel = graph.bounds.minY - ( graph.bounds.minY % TICK_LABEL_SPACING );
        for ( let yValue = firstYLabel; yValue <= graph.bounds.maxY; yValue = yValue + TICK_LABEL_SPACING ) {
          if ( yValue !== 0 ) {
            const tickLabel = new Text( yValue, TICK_LABEL_OPTIONS );
            tickLabel.right = viewOrigin.x - TICK_LABEL_X_OFFSET;
            tickLabel.centerY = modelViewTransform.modelToViewY( yValue );
            tickLabels.push( tickLabel );
          }
        }
      }

      // Origin tick label
      if ( graph.orientation !== 'twoDimensional' ) {

        tickLabels.push( originLabel );

        if ( graph.orientation === 'horizontal' ) {
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