// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph. Graphs have an unknown amount of VectorSets.
 *
 * A Graph can be described by a width and a height (Dimension2) and the coordinate of the upperLeftLocation corner of
 * the graph. With this information, the bounds (Bounds2) can be determined.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants

  // The view coordinates for the graph node location
  const GRAPH_UPPER_LEFT_LOCATION = new Vector2( 29, 90 );

  // Scale conversion factor from model to view coordinates
  const MODEL_TO_VIEW_SCALE_FACTOR = 12.5;

  class Graph {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions for the graph (width and height)
     * @param {Vector2} upperLeftPosition - the coordinate of the upperLeft corner of the graph.
     * @param {GraphOrientations} orientation - the orientation of the graph
     */
    constructor( graphDimension, upperLeftPosition, orientation ) {

      assert && assert( graphDimension instanceof Dimension2, `invalid graphDimension: ${graphDimension}` );
      assert && assert( upperLeftPosition instanceof Vector2, `invalid upperLeftPosition: ${upperLeftPosition}` );
      assert && assert( GraphOrientations.includes( orientation ), `invalid orientation: ${orientation}` );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {array.<VectorSet>} - the vectorSets for this graph
      this.vectorSets = [];

      // @public (read-only) {GraphOrientations}
      this.orientation = orientation;

      // @public {VectorProperty} - the position (model coordinates) of the top left corner of graph
      this.upperLeftPositionProperty = new Vector2Property( upperLeftPosition );

      // When the GraphNode changes the upperLeftPosition (when origin is dragged) the graph bounds changes
      // Graphs last for the life time of the sim, so no need to unlink (the origin is is always movable)
      this.upperLeftPositionProperty.link( ( upperLeftPosition ) => {

        // @public (read-only) {Bounds2} - the model bounds for the graph
        this.graphModelBounds = new Bounds2(
          upperLeftPosition.x,
          upperLeftPosition.y - graphDimension.height,
          upperLeftPosition.x + graphDimension.width,
          upperLeftPosition.y );

      } );

      // @public (read-only) {Property.<ModelViewTransform2>} - the coordinate transform between model
      // (graph coordinates) and view coordinates. It is calculated from the upperLeftPosition of both the view and the
      // model. Graphs last for the life time of the sim, so this will never need to be disposed.
      this.modelViewTransformProperty = new DerivedProperty( [ this.upperLeftPositionProperty ],
        upperLeftPosition => ModelViewTransform2.createSinglePointScaleInvertedYMapping(
          upperLeftPosition,
          GRAPH_UPPER_LEFT_LOCATION,
          MODEL_TO_VIEW_SCALE_FACTOR
        ), {
          valueType: ModelViewTransform2
        } );
    }

    /**
     * Adds a VectorSet to the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - the sum visible property for this vector set
     * @param {VectorGroups} vectorGroup
     * @returns {VectorSet} - the vector set that was added
     * @public
     */
    addVectorSet( componentStyleProperty, sumVisibleProperty, vectorGroup, coordinateSnapMode ) {

      // Keep a reference
      const newVectorSet = new VectorSet(
        this,
        componentStyleProperty,
        sumVisibleProperty,
        vectorGroup,
        coordinateSnapMode );

      this.vectorSets.push( newVectorSet );
      return newVectorSet;
    }

    /**
     * Resets the graph. Called when the reset all button is clicked.
     * @public
     */
    reset() {
      this.erase();
      this.upperLeftPositionProperty.reset();
    }

    /**
     * 'Erases' the graph by resetting the vectorSets. Called when the eraser button is clicked.
     * @public
     */
    erase() {
      // Reset each vectorSet
      this.vectorSets.forEach( vectorSet => vectorSet.reset() );
    }
  }

  return vectorAddition.register( 'Graph', Graph );
} );