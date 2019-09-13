// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph. A screen can have multiple graphs. Graphs should be subtypes.
 *
 * Graphs are responsible for:
 *   - Keeping track of where the origin is dragged and updating a modelViewTransformProperty.
 *   - Keeping track of the active vector on a graph.
 *   - Controlling vector sets. A graph can have an unknown and varied amount of vector sets.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Property = require( 'AXON/Property' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  //----------------------------------------------------------------------------------------
  // constants

  // Since the origin is being dragged, modelViewTransform is in the model. That being said, it is necessary to know the
  // view coordinates of the graph node's bottom left location to calculate the model view transform.
  // Calculate the default for the grid's bottom left location, in view coordinates.
  const DEFAULT_BOTTOM_LEFT = new Vector2(
    VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minX + VectorAdditionConstants.AXES_ARROW_X_EXTENSION + 10,
    VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxY - VectorAdditionConstants.AXES_ARROW_Y_EXTENSION - 45
  );

  // scale of the coordinate transformation of model coordinates to view coordinates
  const MODEL_TO_VIEW_SCALE = 14.5;

  class Graph {

    /**
     * @param {Bounds2} initialGraphBounds - the model bounds of the graph at the start of the sim
     * @param {CoordinateSnapModes} coordinateSnapMode - the coordinate snap mode of the graph. A graph is either
     *                                                   strictly polar or cartesian.
     * @param {GraphOrientations} orientation - the orientation of the graph. A graph is either strictly horizontal,
     *                                          vertical, or two dimensional.
     * @param {Object} [options]
     */
    constructor( initialGraphBounds, coordinateSnapMode, orientation, options ) {

      assert && assert( initialGraphBounds instanceof Bounds2, `invalid initialGraphBounds: ${initialGraphBounds}` );
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( GraphOrientations.includes( orientation ), `invalid orientation: ${orientation}` );

      options = _.extend( {
         bottomLeft: DEFAULT_BOTTOM_LEFT // bottom left corner of the graph, in view coordinates
      }, options );

      //----------------------------------------------------------------------------------------

      // @public {VectorSet[]} vectorSets - the vectorSets for this graph
      this.vectorSets = [];

      // @public (read-only) {GraphOrientations} orientation - orientation for the graph (final variable)
      this.orientation = orientation;

      // @public (read-only) {CoordinateSnapModes} coordinateSnapMode - coordinate snap mode for the graph
      this.coordinateSnapMode = coordinateSnapMode;

      // @private {Property.<Bounds2>} graphModelBoundsProperty - the Property of the graph bounds. To be set internally
      // only. Read access can be found at get graphModelBounds().
      this.graphModelBoundsProperty = new Property( initialGraphBounds, {
        valueType: Bounds2
      } );

      // Determine the view bounds for the graph, the graph view bounds are constant for the entire sim.
      const graphViewBounds = new Bounds2( options.bottomLeft.x,
        options.bottomLeft.y - MODEL_TO_VIEW_SCALE * initialGraphBounds.height,
        options.bottomLeft.x + MODEL_TO_VIEW_SCALE * initialGraphBounds.width,
        options.bottomLeft.y );

      // @public (read-only) {DerivedProperty.<ModelViewTransform2>} modelViewTransformProperty - Property of the
      // coordinate transform between model (graph coordinates) and view coordinates.
      this.modelViewTransformProperty = new DerivedProperty( [ this.graphModelBoundsProperty ],
        ( graphModelBounds ) => {
          return ModelViewTransform2.createRectangleInvertedYMapping( graphModelBounds, graphViewBounds );
        }, {
          valueType: ModelViewTransform2
        } );

      // @public {Property.<Vector|null>} activeVectorProperty - the active vector. A graph only has one active
      // vector at a time. If null, there are no active vectors at the time. To be set externally.
      this.activeVectorProperty = new Property( null, {
        isValidValue: ( value ) => {
          return value === null || value instanceof Vector;
        }
      } );
    }

    /**
     * Resets the graph. Called when the reset all button is clicked.
     * @public
     */
    reset() {
      this.graphModelBoundsProperty.reset();
      this.erase();
    }

    /**
     * Erases the graph. Called when the eraser button is clicked.
     * @public
     */
    erase() {
      // Reset each vectorSet
      this.vectorSets.forEach( vectorSet => vectorSet.reset() );
      this.activeVectorProperty.reset();
    }

    /**
     * Moves the origin to a point. Solely shifts the bounds to match.
     * Point must be on the graph.
     * @public
     * @param {Vector2} point
     */
    moveOriginToPoint( point ) {
      assert && assert( point instanceof Vector2 && this.graphModelBoundsProperty.value.containsPoint( point ),
        `invalid point: ${point}` );

      // Round the point to only allow transformations to points on a grid intersection
      const roundedPoint = point.roundSymmetric();
      this.graphModelBoundsProperty.value = this.graphModelBounds.shifted( -roundedPoint.x, -roundedPoint.y );
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

  return vectorAddition.register( 'Graph', Graph );
} );