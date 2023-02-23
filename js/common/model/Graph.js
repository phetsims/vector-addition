// Copyright 2019-2023, University of Colorado Boulder

/**
 * Graph is the base class for graphs, intended to be sub-classed. A screen can have multiple graphs.
 *
 * Graphs are responsible for:
 *   - Keeping track of where the origin is dragged and updating a modelViewTransformProperty.
 *   - Keeping track of the active (selected) vector on a graph.
 *   - Managing one or more VectorSets
 *
 * @author Brandon Li
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import CoordinateSnapModes from './CoordinateSnapModes.js';
import GraphOrientations from './GraphOrientations.js';
import Vector from './Vector.js';

//----------------------------------------------------------------------------------------
// constants

// Since the origin is being dragged, modelViewTransform is in the model. That being said, it is necessary to know the
// view coordinates of the graph node's bottom-left to calculate the model view transform.
// Calculate the default for the grid's bottom-left, in view coordinates.
const DEFAULT_BOTTOM_LEFT = new Vector2(
  VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minX + VectorAdditionConstants.AXES_ARROW_X_EXTENSION + 10,
  VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxY - VectorAdditionConstants.AXES_ARROW_Y_EXTENSION - 45
);

// scale of the coordinate transformation of model coordinates to view coordinates
const MODEL_TO_VIEW_SCALE = 14.5;

export default class Graph {

  /**
   * @param {Bounds2} initialGraphBounds - the model bounds of the graph at the start of the sim
   * @param {CoordinateSnapModes} coordinateSnapMode - the coordinate snap mode of the graph. A graph is either
   *                                                   strictly polar or Cartesian.
   * @param {Object} [options]
   */
  constructor( initialGraphBounds, coordinateSnapMode, options ) {

    assert && assert( initialGraphBounds instanceof Bounds2, `invalid initialGraphBounds: ${initialGraphBounds}` );
    assert && assert( CoordinateSnapModes.enumeration.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );

    options = merge( {
      orientation: GraphOrientations.TWO_DIMENSIONAL,
      bottomLeft: DEFAULT_BOTTOM_LEFT // bottom left corner of the graph, in view coordinates
    }, options );

    //----------------------------------------------------------------------------------------

    // @public {VectorSet[]} the vectorSets for this graph
    this.vectorSets = [];

    // @public (read-only) {GraphOrientations} orientation of the graph
    this.orientation = options.orientation;

    // @public (read-only) {CoordinateSnapModes} coordinate snap mode for the graph, Cartesian or polar
    this.coordinateSnapMode = coordinateSnapMode;

    // @private {Property.<Bounds2>} bounds of the graph, in model coordinates.
    // Use graphModelBounds() to read this.
    this.graphModelBoundsProperty = new Property( initialGraphBounds, {
      valueType: Bounds2
    } );

    // @public (read-only) bounds of the graph in view coordinates, constant for the lifetime of the sim.
    this.graphViewBounds = new Bounds2( options.bottomLeft.x,
      options.bottomLeft.y - MODEL_TO_VIEW_SCALE * initialGraphBounds.height,
      options.bottomLeft.x + MODEL_TO_VIEW_SCALE * initialGraphBounds.width,
      options.bottomLeft.y );

    // @public (read-only) {DerivedProperty.<ModelViewTransform2>} maps graph coordinates between model and view
    // dispose is unnecessary, exists for the lifetime of the sim.
    this.modelViewTransformProperty = new DerivedProperty(
      [ this.graphModelBoundsProperty ],
      graphModelBounds => ModelViewTransform2.createRectangleInvertedYMapping( graphModelBounds, this.graphViewBounds ),
      { valueType: ModelViewTransform2 }
    );

    // @public {Property.<Vector|null>} activeVectorProperty - the active (selected) vector.
    // A graph has at most one active vector. If null, there is no active vector.
    this.activeVectorProperty = new Property( null, {
      isValidValue: value => {
        return ( value === null || value instanceof Vector );
      }
    } );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'Graph is not intended to be disposed' );
  }

  /**
   * Resets the graph.
   * @public
   */
  reset() {
    this.graphModelBoundsProperty.reset();
    this.vectorSets.forEach( vectorSet => vectorSet.reset() );
    this.activeVectorProperty.reset();
  }

  /**
   * Erases the graph.
   * @public
   */
  erase() {
    this.vectorSets.forEach( vectorSet => vectorSet.erase() );
    this.activeVectorProperty.reset();
  }

  /**
   * Moves the origin to a specified point on the graph.
   * @public
   * @param {Vector2} point
   */
  moveOriginToPoint( point ) {
    assert && assert( point instanceof Vector2 && this.graphModelBoundsProperty.value.containsPoint( point ),
      `invalid point: ${point}` );

    // Round to integer
    const roundedPoint = point.roundSymmetric();
    this.graphModelBoundsProperty.value = this.graphModelBounds.shiftedXY( -roundedPoint.x, -roundedPoint.y );
  }

  /**
   * Gets the bounds of the graph
   * @public
   * @returns {Bounds2}
   */
  get graphModelBounds() {
    return this.graphModelBoundsProperty.value;
  }
}

Graph.DEFAULT_BOTTOM_LEFT = DEFAULT_BOTTOM_LEFT;

vectorAddition.register( 'Graph', Graph );