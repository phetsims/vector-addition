// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph. A screen can have multiple graphs. E.g. explore1D has a horizontal and a vertical graph.
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
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  //----------------------------------------------------------------------------------------
  // constants

  // Since the origin is being dragged, modelViewTransform is in the model. That being said,
  // it is necessary to know the view coordinates of the graph node's bottom left location to calculate
  // the model view transform. To calculate the bottom left coordinate, access to the information about
  // the screen view is necessary.
  const SCREEN_VIEW_BOUNDS = VectorAdditionConstants.SCREEN_VIEW_BOUNDS;
  const SCREEN_VIEW_X_MARGIN = VectorAdditionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

  // References to how far the axes arrow extends past the graph.
  const AXES_ARROW_X_EXTENSION = VectorAdditionConstants.AXES_ARROW_X_EXTENSION;
  const AXES_ARROW_Y_EXTENSION = VectorAdditionConstants.AXES_ARROW_Y_EXTENSION;
 
  // See https://user-images.githubusercontent.com/42391580/60772856-89096900-a0b9-11e9-8e74-31aa667ab0cb.png
  // Calculate the bottom left location, constant for all graph nodes.
  const GRAPH_BOTTOM_LEFT_LOCATION = new Vector2(
    SCREEN_VIEW_BOUNDS.minX + SCREEN_VIEW_X_MARGIN + AXES_ARROW_X_EXTENSION,
    SCREEN_VIEW_BOUNDS.maxY - SCREEN_VIEW_Y_MARGIN - AXES_ARROW_Y_EXTENSION );

  // Scale of the coordinate transformation of model coordinates to view coordinates
  const MODEL_TO_VIEW_SCALE = 12.45;


  class Graph {
    /**
     * @constructor
     *
     * @param {Bounds2} initialGraphBounds - the graph bounds at the start of the sim
     * @param {CoordinateSnapModes} coordinateSnapMode - the coordinate snap mode of the graph. A graph is either
     *                                                   entirely polar or cartesian.
     * @param {GraphOrientations} orientation - the orientation of the graph
     */
    constructor( initialGraphBounds, coordinateSnapMode, orientation ) {

      assert && assert( initialGraphBounds instanceof Bounds2, `invalid initialGraphBounds: ${initialGraphBounds}` );
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( GraphOrientations.includes( orientation ), `invalid orientation: ${orientation}` );

      //----------------------------------------------------------------------------------------

      // @public {array.<VectorSet>} - the vectorSets for this graph
      this.vectorSets = [];

      // @public (read-only) {GraphOrientations} - orientation for the graph (final variable)
      this.orientation = orientation;

      // @private {CoordinateSnapModes} - coordinate snap mode for the graph (final variable)
      this.coordinateSnapMode = coordinateSnapMode;

      // @private {Property.<Bounds2>} the property of the graph bounds. To be set internally only. Read access can
      // be found at get graphModelBounds()
      this.graphModelBoundsProperty = new Property( initialGraphBounds, {
        valueType: Bounds2
      } );

      // Determine the view bounds for the graph, the graph view bounds are for the entire sim.
      const graphViewBounds = new Bounds2( GRAPH_BOTTOM_LEFT_LOCATION.x,
        GRAPH_BOTTOM_LEFT_LOCATION.y - MODEL_TO_VIEW_SCALE * initialGraphBounds.height,
        GRAPH_BOTTOM_LEFT_LOCATION.x + MODEL_TO_VIEW_SCALE * initialGraphBounds.width,
        GRAPH_BOTTOM_LEFT_LOCATION.y );

      // @public (read-only) {DerivedProperty.<ModelViewTransform2>} - the coordinate transform between model
      // (graph coordinates) and view coordinates.
      this.modelViewTransformProperty = new DerivedProperty( [ this.graphModelBoundsProperty ],
        ( graphModelBounds ) => {
          return ModelViewTransform2.createRectangleInvertedYMapping( graphModelBounds, graphViewBounds );
        }, {
          valueType: ModelViewTransform2
        } );

      // @public {Property.<VectorModel|null>} - the active vector. A graph only has one active vector at a time.
      // If null, there are no active vectors at the time. To be set externally.
      this.activeVectorProperty = new Property( null, {
        isValidValue: ( value ) => {
          return value === null || value instanceof VectorModel;
        }
      } );
    }

    /**
     * Resets the graph. Called when the reset all button is clicked.
     * @public
     */
    reset() {
      this.erase();
      this.graphModelBoundsProperty.reset();
    }

    /**
     * Erases the graph by resetting the vectorSets. Called when the eraser button is clicked.
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
     *
     * @param {Vector2} - point
     */
    moveOriginToPoint( point ) {
      assert && assert( point instanceof Vector2 && this.graphModelBoundsProperty.value.containsPoint( point ),
        `invalid point: ${point}` );

      // Round the point to only allow transformations to points on a grid intersection
      const roundedPoint = point.roundSymmetric();
      this.graphModelBoundsProperty.value = this.graphModelBounds.shifted( -roundedPoint.x, -roundedPoint.y );
    }

    /**
     * Creates a VectorSet. This will not add a vector set to the graph as a side effect.
     * @public
     *
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - the sum visible property for this vector set
     * @param {VectorGroups} vectorGroup
     * @returns {VectorSet} - the vector set that was created
     */
    createVectorSet( componentStyleProperty, sumVisibleProperty, vectorGroup ) {
      return new VectorSet( this, componentStyleProperty, sumVisibleProperty, vectorGroup, this.coordinateSnapMode );
    }

    /**
     * Gets the bounds of the graph
     * @public
     */
    get graphModelBounds() {
      return this.graphModelBoundsProperty.value;
    }
  }

  return vectorAddition.register( 'Graph', Graph );
} );