// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph. Graphs have an unknown amount of VectorSets. Graphs are responsible for the modelViewTransform,
 * which changes when the origin is dragged.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants

  // The graph nodes upper left location. Used in model to determine in the model view transform property value.
  // Since the origin is being dragged, modelViewTransform is in the graph.
  const GRAPH_BOTTOM_LEFT_LOCATION = new Vector2( 29, 590 );
  const MODEL_TO_VIEW_SCALE = 12.5;

  class Graph {
    /**
     * @constructor
     * @param {Bounds2} initialGraphBounds - the graph bounds at the start of the sim
     * @param {GraphOrientations} orientation - the orientation of the graph
     */
    constructor( initialGraphBounds, orientation ) {

      assert && assert( initialGraphBounds instanceof Bounds2, `invalid initialGraphBounds: ${initialGraphBounds}` );
      assert && assert( GraphOrientations.includes( orientation ), `invalid orientation: ${orientation}` );

      //----------------------------------------------------------------------------------------

      // @public {array.<VectorSet>} - the vectorSets for this graph
      this.vectorSets = [];

      // @public (read-only) {GraphOrientations} - orientation for the graph (final variable)
      this.orientation = orientation;

      // @private {Property.<Bounds2>} the property of the graph bounds. To be only set internally. Read access at can
      // be found at get graphModelBounds()
      this.graphModelBoundsProperty = new Property( initialGraphBounds, {
        valueType: Bounds2
      } );

      // Determine the view bounds for the graph
      const graphViewBounds = new Bounds2( GRAPH_BOTTOM_LEFT_LOCATION.x,
        GRAPH_BOTTOM_LEFT_LOCATION.y - MODEL_TO_VIEW_SCALE * initialGraphBounds.height,
        GRAPH_BOTTOM_LEFT_LOCATION.x + MODEL_TO_VIEW_SCALE * initialGraphBounds.width,
        GRAPH_BOTTOM_LEFT_LOCATION.y );

      // @public (read-only) {Property.<ModelViewTransform2>} - the coordinate transform between model
      // (graph coordinates) and view coordinates.
      this.modelViewTransformProperty = new DerivedProperty( [ this.graphModelBoundsProperty ],
        ( graphModelBounds ) => {
          return ModelViewTransform2.createRectangleInvertedYMapping( graphModelBounds, graphViewBounds );
        }, {
          valueType: ModelViewTransform2
        } );

      // @public {Property.<VectorModel|null>} - the active vector. A graph only has one active vector at a time.
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
     * Moves the origin to a point. This just changes the bounds as the scale doesn't change.
     * @param {Vector2} - point
     * @public
     */
    moveOriginToPoint( point ) {
      assert && assert( point instanceof Vector2 && this.graphModelBoundsProperty.value.containsPoint( point ),
        `invalid point: ${point}` );

      // Round the point to only allow transformations to points on a grid intersection
      const roundedPoint = point.roundSymmetric();
      this.graphModelBoundsProperty.value = this.graphModelBounds.shifted( -roundedPoint.x, -roundedPoint.y );
    }

    /**
     * Creates a VectorSet, passing the graph (this) to the vector set
     * @public
     *
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - the sum visible property for this vector set
     * @param {VectorGroups} vectorGroup
     * @param {CoordinateSnapModes} coordinateSnapMode
     * @returns {VectorSet} - the vector set that was created
     */
    createVectorSet( componentStyleProperty, sumVisibleProperty, vectorGroup, coordinateSnapMode ) {
      return new VectorSet( this, componentStyleProperty, sumVisibleProperty, vectorGroup, coordinateSnapMode );
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