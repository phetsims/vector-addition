// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph. Each screen can have multiple scenes, but each scene can only have one graph.
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
  const Dimension2 = require( 'DOT/Dimension2' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants

  // The coordinate for the graphNode in view coordinates.
  const MODEL_TO_VIEW_SCALE_FACTOR = VectorAdditionConstants.MODEL_TO_VIEW_SCALE_FACTOR;
  const GRAPH_UPPER_LEFT_LOCATION = VectorAdditionConstants.GRAPH_UPPER_LEFT_LOCATION;


  class Graph {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions for the graph (width and height)
     * @param {Vector2} upperLeftPosition - the coordinate of the upperLeft corner of the graph.
     * @param {Object} [options]
     * @public
     */
    constructor( graphDimension, upperLeftPosition, options ) {

      // check that the arguments are correct types
      assert && assert( graphDimension instanceof Dimension2,
        `invalid graphDimension: ${graphDimension}` );
      assert && assert( upperLeftPosition instanceof Vector2,
        `invalid upperLeftPosition: ${upperLeftPosition}` );

      options = _.extend( {
        orientation: VectorOrientations.TWO_DIMENSIONAL // {VectorOrientations} - the orientation of the graph
      }, options );


      // @public {VectorProperty} - the position (model coordinates) of the top left corner of graph
      this.upperLeftPositionProperty = new Vector2Property( upperLeftPosition );

      // When the GraphNode changes the upperLeftPosition (when origin is dragged) the graph bounds changes
      // Graphs last for the life time of the sim, so no need to unlink the because the origin is is always movable
      this.upperLeftPositionProperty.link( ( upperLeftPosition ) => {

        // @public {Bounds2} - the model bounds for the graph
        this.graphModelBounds = new Bounds2(
          upperLeftPosition.x,
          upperLeftPosition.y - graphDimension.height,
          upperLeftPosition.x + graphDimension.width,
          upperLeftPosition.y );

      } );


      // @public {Property.<ModelViewTransform2>} - the coordinate transform between model (graph coordinates) and view
      // coordinates. It is calculated from the upperLeftPosition of both the view and the model.
      // Graphs last for the life time of the sim, so no need to dispose
      this.modelViewTransformProperty = new DerivedProperty( [ this.upperLeftPositionProperty ],
        upperLeftPosition => ModelViewTransform2.createSinglePointScaleInvertedYMapping(
          upperLeftPosition,
          GRAPH_UPPER_LEFT_LOCATION,
          MODEL_TO_VIEW_SCALE_FACTOR
        ), {
          valueType: ModelViewTransform2
        } );

      // @public (read-only) {VectorOrientations}
      this.orientation = options.orientation;

    }

    /**
     * Reset the graph
     * @public
     */
    reset() {
      this.upperLeftPositionProperty.reset();
    }
  }

  return vectorAddition.register( 'Graph', Graph );
} );