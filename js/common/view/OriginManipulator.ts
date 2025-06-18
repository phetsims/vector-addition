// Copyright 2019-2025, University of Colorado Boulder

/**
 * OriginManipulator shows the origin on the graph, and can be dragged to reposition the origin.
 *
 * @author Martin Veillette
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';
import Graph from '../model/Graph.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

// the closest the user can drag the origin to the edge of the graph, in model units
const ORIGIN_DRAG_MARGIN = 5;

// origin
const ORIGIN_COLOR = Color.toColor( VectorAdditionColors.ORIGIN_COLOR );
const ORIGIN_DIAMETER = 0.8; // in model coordinates
const ORIGIN_OPTIONS: ShadedSphereNodeOptions = {
  isDisposable: false,
  cursor: 'move',
  mainColor: ORIGIN_COLOR,
  highlightColor: Color.WHITE,
  shadowColor: ORIGIN_COLOR.darkerColor(),
  lineWidth: 1,
  stroke: ORIGIN_COLOR.darkerColor()
};

export default class OriginManipulator extends InteractiveHighlighting( ShadedSphereNode ) {

  public constructor( graph: Graph, tandem: Tandem ) {

    // convenience variable
    const modelViewTransform = graph.modelViewTransformProperty.value;

    // Origin, in view coordinates
    const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // Diameter, view coordinates
    const diameter = modelViewTransform.modelToViewDeltaX( ORIGIN_DIAMETER );

    super( diameter, combineOptions<ShadedSphereNodeOptions>( {}, ORIGIN_OPTIONS, {
      center: origin,
      touchArea: Shape.circle( 2 * diameter ),
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      accessibleName: VectorAdditionStrings.a11y.originManipulator.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.originManipulator.accessibleHelpTextStringProperty,
      tandem: tandem
    } ) );

    this.touchArea = Shape.circle( 0, 0, diameter );

    // Create a dragBounds to constrain the drag
    const restrictedGraphViewBounds = modelViewTransform.modelToViewBounds( graph.boundsProperty.value.eroded( ORIGIN_DRAG_MARGIN ) );

    // Create a Property of to track the view's origin in view coordinates
    const originPositionProperty = new Vector2Property( origin, {
      tandem: tandem.createTandem( 'originPositionProperty' ),
      phetioReadOnly: true
    } );

    // Drag support for pointer and keyboard input, with sound.
    this.addInputListener( new SoundRichDragListener( {
      positionProperty: originPositionProperty,
      translateNode: false,
      dragBoundsProperty: new Property( restrictedGraphViewBounds ),
      tandem: tandem,
      dragListenerOptions: {
        pressCursor: ORIGIN_OPTIONS.cursor
      },
      keyboardDragListenerOptions: {
        dragDelta: modelViewTransform.modelToViewDeltaX( 1 ),
        moveOnHoldInterval: 100
      }
    } ) );

    // Update the origin position.
    originPositionProperty.lazyLink( originPosition => {
      // Tell the model to update the origin
      graph.moveOriginToPoint( graph.modelViewTransformProperty.value.viewToModelPosition( originPosition ) );
    } );

    // Observe when the model view transform changes to update the position of the circle.
    graph.modelViewTransformProperty.link( modelViewTransform => {
      this.center = modelViewTransform.modelToViewPosition( Vector2.ZERO );
    } );

    // When the graph's bounds change, add an accessible object response. This happens repeatedly while dragging the
    // origin manipulator, so use 'interrupt' for the alert behavior, so that we don't hear a response for every
    // intermediate value during a drag.
    graph.boundsProperty.lazyLink( bounds => {
      const response = StringUtils.fillIn( VectorAdditionStrings.a11y.originManipulator.accessibleObjectResponseStringProperty.value, {
        minX: bounds.minX,
        minY: bounds.minY,
        maxX: bounds.maxX,
        maxY: bounds.maxY
      } );
      this.addAccessibleObjectResponse( response, 'interrupt' );
    } );
  }
}

vectorAddition.register( 'OriginManipulator', OriginManipulator );