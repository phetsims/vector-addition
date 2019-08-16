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
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OriginCircle = require( 'VECTOR_ADDITION/common/view/OriginCircle' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
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
  const GRAPH_BACKGROUND = VectorAdditionColors.WHITE;
  const MAJOR_GRID_LINE_WIDTH = 1.8; // view units
  const MAJOR_GRID_LINE_COLOR = VectorAdditionColors.GRAPH_MAJOR_LINE_COLOR;
  const MINOR_GRID_LINE_WIDTH = 1.2; // view units
  const MINOR_GRID_LINE_COLOR = VectorAdditionColors.GRAPH_MINOR_LINE_COLOR;

  // axes
  const AXES_ARROW_X_EXTENSION = 20; // how far the line extends past the grid, view units
  const AXES_ARROW_Y_EXTENSION = 15;
  const AXES_TEXT_OPTIONS = {
    font: new MathSymbolFont( 20 ),
    maxWidth: 30
  };

  // ticks
  const MAJOR_TICK_SPACING = 5; // model units
  const TICK_LENGTH = 1; // model units
  const TICKS_OPTIONS = {
    lineWidth: 1,
    stroke: VectorAdditionColors.BLACK
  };

  // tick labels
  const TICK_TEXT_OPTIONS = {
    font: new PhetFont( 16 ),
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
        new Rectangle( graphViewBounds, { fill: GRAPH_BACKGROUND } ),
        new GridLinesNode( graph, gridVisibilityProperty )
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
     * @param {BooleanProperty} gridVisibilityProperty
     */
    constructor( graph, gridVisibilityProperty ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( gridVisibilityProperty instanceof BooleanProperty,
        `invalid gridVisibilityProperty: ${gridVisibilityProperty}` );

      // Create the path for the major grid lines. Initialize it with and an empty shape to be updated later.
      const majorGridLinesPath = new Path( new Shape(), {
        lineWidth: MAJOR_GRID_LINE_WIDTH,
        stroke: MAJOR_GRID_LINE_COLOR
      } );

      // Create the path for the minor grid lines. Initialize it with and an empty shape to be updated later.
      const minorGridLinesPath = new Path( new Shape(), {
        lineWidth: MINOR_GRID_LINE_WIDTH,
        stroke: MINOR_GRID_LINE_COLOR
      } );

      super( {
        children: [ minorGridLinesPath, majorGridLinesPath ]
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
        majorGridLinesPath.setShape( modelViewTransform.modelToViewShape( majorGridLinesShape ).makeImmutable() );
        minorGridLinesPath.setShape( modelViewTransform.modelToViewShape( minorGridLinesShape ).makeImmutable() );
      } );

      // Observe changes to the grid visibility Property, and update visibility. Link exists throughout the entire sim
      // since graphs last the entire sim and are never disposed.
      gridVisibilityProperty.linkAttribute( this, 'visible' );
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
      const axisTicksPath = new Path( new Shape(), TICKS_OPTIONS );

      const children = [ this.axisArrow, this.axisLabel, axisTicksPath ];

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
        axisTicksPath.setShape( ticksShape.makeImmutable() );
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
      throw new Error( 'abstract method must be implemented' );
    }

    /**
     * Updates the location of the labels (origin label and axis label)
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
     * @abstract
     */
    updateAxisLabels( graphViewOrigin ) {
      throw new Error( 'abstract method must be implemented' );
    }

    /**
     * Gets a new shape for the updated axis ticks
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     * @protected
     * @abstract
     */
    getUpdatedTicksShape( graphModelBounds, modelViewTransform ) {
      throw new Error( 'abstract method must be implemented' );
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
     * @override
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
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
     * @override
     */
    updateAxisLabels( graphViewOrigin ) {

      // Update the label that is to the right of the axis
      this.axisLabel.left = this.axisArrow.right + 10;
      this.axisLabel.centerY = graphViewOrigin.y;

      // Update the origin label
      if ( this.originText ) {
        this.originText.centerX = graphViewOrigin.x;
        this.originText.top = graphViewOrigin.y + 20;
      }
    }

    /**
     * Gets a new shape for the updated axis ticks
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     * @protected
     * @override
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
     * @override
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
     * @param {Vector2} graphViewOrigin - the origin location in view coordinates
     * @protected
     * @override
     */
    updateAxisLabels( graphViewOrigin ) {

      // Update the label that is above the axis
      this.axisLabel.centerX = graphViewOrigin.x;
      this.axisLabel.centerY = this.axisArrow.top - 10;

      // Update the origin label
      if ( this.originText ) {
        this.originText.centerY = graphViewOrigin.y;
        this.originText.right = graphViewOrigin.x - 20;
      }
    }

    /**
     * Gets a new shape for the updated axis ticks
     * @param {Bounds2} graphModelBounds - the bounds of the grid in model coordinates
     * @param {ModelViewTransform2} modelViewTransform - the new modelViewTransform
     * @returns {Shape} the new axis ticks shape in View coordinates
     * @protected
     * @override
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