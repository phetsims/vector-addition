// Copyright 2019, University of Colorado Boulder

/**
 * OriginManipulator shows the origin on the graph, and can be dragged to reposition the origin.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Property = require( 'AXON/Property' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  // constants

  // the closest the user can drag the origin to the edge of the graph, in model units
  const ORIGIN_DRAG_MARGIN = 5;

  // origin
  const ORIGIN_COLOR = Color.toColor( VectorAdditionColors.ORIGIN_COLOR );
  const ORIGIN_DIAMETER = 0.8; // in model coordinates
  const ORIGIN_OPTIONS = {
    cursor: 'move',
    fill: ORIGIN_COLOR.withAlpha( 0.15 ),
    mainColor: ORIGIN_COLOR,
    highlightColor: Color.WHITE,
    shadowColor: ORIGIN_COLOR.darkerColor(),
    lineWidth: 1,
    stroke: ORIGIN_COLOR.darkerColor()
  };

  class OriginManipulator extends ShadedSphereNode {

    /**
     * @param {Graph} graph - the model for the graph
     */
    constructor( graph ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );

      // convenience variable
      const modelViewTransform = graph.modelViewTransformProperty.value;

      // Origin, in view coordinates
      const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

      // Diameter, view coordinates
      const diameter = modelViewTransform.modelToViewDeltaX( ORIGIN_DIAMETER );

      super( diameter, _.extend( { center: origin }, ORIGIN_OPTIONS ) );

      this.touchArea = Shape.circle( 0, 0, diameter );

      // Create a dragBounds to constrain the drag
      const restrictedGraphViewBounds = modelViewTransform.modelToViewBounds(
        graph.graphModelBounds.eroded( ORIGIN_DRAG_MARGIN )
      );

      // Create a Property of to track the view's origin in view coordinates
      const originLocationProperty = new Vector2Property( origin );

      // Add a drag listener. removeInputListener is unnecessary, since this class owns the listener.
      this.addInputListener( new DragListener( {
        locationProperty: originLocationProperty,
        translateNode: false,
        dragBoundsProperty: new Property( restrictedGraphViewBounds ),
        pressCursor: ORIGIN_OPTIONS.cursor
      } ) );

      // Update the origin location.
      // unlink is unnecessary, exists for the lifetime of the simulation.
      originLocationProperty.lazyLink( originLocation => {
        // Tell the model to update the origin
        graph.moveOriginToPoint( graph.modelViewTransformProperty.value.viewToModelPosition( originLocation ) );
      } );

      // Observe when the models model view transform changes to update the location of the circle.
      // unlink is unnecessary, exists for the lifetime of the sim.
      graph.modelViewTransformProperty.link( modelViewTransform => {
        this.center = modelViewTransform.modelToViewPosition( Vector2.ZERO );
      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'OriginManipulator is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'OriginManipulator', OriginManipulator );
} );