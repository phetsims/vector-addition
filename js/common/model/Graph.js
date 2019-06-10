// Copyright 2019, University of Colorado Boulder

/**
 * Model for the a graph (a scene). Explore1D has 2 graphs (horizontal and vertical) and the other screens each have one
 * respectively.
 *
 * A Graph can be described by a width and a height (Dimension2) and the coordinate of the upperLeftLocation corner of
 * the graph. With this information, the bounds can be determined.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  // constants

  // The coordinate for the graphNode in view coordinates.
  const UPPER_LEFT_LOCATION = VectorAdditionConstants.UPPER_LEFT_LOCATION;
  const GRAPH_TO_VIEW_SCALE = VectorAdditionConstants.GRAPH_TO_VIEW_SCALE;


  class Graph {
    /**
     * @constructor
     * @param {Dimension2} gridDimension - the dimensions for the graph (width and height)
     * @param {Vector2} upperLeftPosition - the coordinate of the upperLeft corner of the graph.
     * @public
     */
    constructor( gridDimension, upperLeftPosition ) {


      // @public {VectorProperty} - the position (model coordinates) of the top left corner of graph
      this.upperLeftPositionProperty = new Vector2Property( upperLeftPosition );

      // When the GraphNode changes the upperLeftPosition (when origin is dragged) the graph bounds changes
      this.upperLeftPositionProperty.link( ( upperLeftPosition ) => {

        // @public {Bounds2} - the model bounds for the graph
        this.graphModelBounds = new Bounds2(
          upperLeftPosition.x,
          upperLeftPosition.y - gridDimension.height,
          upperLeftPosition.x + gridDimension.width,
          upperLeftPosition.y );

      } );

      // @public {Property.<ModelViewTransform2>} - the coordinate transform between model (graph coordinates) and view
      // coordinates. It is calculated from the upperLeftPosition of both the view and the model.
      this.modelViewTransformProperty = new DerivedProperty(
        [ this.upperLeftPositionProperty ], ( upperLeftPosition ) =>
          ModelViewTransform2.createSinglePointScaleInvertedYMapping(
            upperLeftPosition,
            UPPER_LEFT_LOCATION,
            GRAPH_TO_VIEW_SCALE )
      );

      // @public {ObservableArray.<Vector>} - the vectors that appear on the graph (not including the sum vector)
      this.vectors = new ObservableArray();

      // @public {Vector} the vector sum model
      this.vectorSum = new VectorSum( this.vectors, this.modelViewTransformProperty );

    }

    /**
     * Reset the graph
     * @public
     */
    reset() {
      this.upperLeftPositionProperty.reset();
      this.vectors.reset();
    }
  }

  return vectorAddition.register( 'Graph', Graph );
} );