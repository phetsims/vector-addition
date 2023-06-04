// Copyright 2019-2023, University of Colorado Boulder

/**
 * OriginManipulator shows the origin on the graph, and can be dragged to reposition the origin.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Color, DragListener } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import Graph from '../model/Graph.js';
import VectorAdditionColors from '../VectorAdditionColors.js';

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

export default class OriginManipulator extends ShadedSphereNode {

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

    super( diameter, merge( { center: origin }, ORIGIN_OPTIONS ) );

    this.touchArea = Shape.circle( 0, 0, diameter );

    // Create a dragBounds to constrain the drag
    const restrictedGraphViewBounds = modelViewTransform.modelToViewBounds(
      graph.graphModelBounds.eroded( ORIGIN_DRAG_MARGIN )
    );

    // Create a Property of to track the view's origin in view coordinates
    const originPositionProperty = new Vector2Property( origin );

    // Add a drag listener. removeInputListener is unnecessary, since this class owns the listener.
    this.addInputListener( new DragListener( {
      positionProperty: originPositionProperty,
      translateNode: false,
      dragBoundsProperty: new Property( restrictedGraphViewBounds ),
      pressCursor: ORIGIN_OPTIONS.cursor
    } ) );

    // Update the origin position.
    // unlink is unnecessary, exists for the lifetime of the simulation.
    originPositionProperty.lazyLink( originPosition => {
      // Tell the model to update the origin
      graph.moveOriginToPoint( graph.modelViewTransformProperty.value.viewToModelPosition( originPosition ) );
    } );

    // Observe when the model view transform changes to update the position of the circle.
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

vectorAddition.register( 'OriginManipulator', OriginManipulator );