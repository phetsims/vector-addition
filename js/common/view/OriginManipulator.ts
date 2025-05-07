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
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';

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
  stroke: ORIGIN_COLOR.darkerColor(),
  isDisposable: false
};

export default class OriginManipulator extends InteractiveHighlighting( ShadedSphereNode ) {

  public constructor( scene: VectorAdditionScene, tandem: Tandem ) {

    // convenience variable
    const modelViewTransform = scene.modelViewTransformProperty.value;

    // Origin, in view coordinates
    const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // Diameter, view coordinates
    const diameter = modelViewTransform.modelToViewDeltaX( ORIGIN_DIAMETER );

    super( diameter, combineOptions<ShadedSphereNodeOptions>( {}, ORIGIN_OPTIONS, {
      center: origin,
      touchArea: Shape.circle( 2 * diameter ),
      tagName: 'div', // for KeyboardDragListener
      focusable: true, // for KeyboardDragListener
      tandem: tandem
    } ) );

    this.touchArea = Shape.circle( 0, 0, diameter );

    // Create a dragBounds to constrain the drag
    const restrictedGraphViewBounds = modelViewTransform.modelToViewBounds( scene.bounds.eroded( ORIGIN_DRAG_MARGIN ) );

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
    // unlink is unnecessary, exists for the lifetime of the simulation.
    originPositionProperty.lazyLink( originPosition => {
      // Tell the model to update the origin
      scene.moveOriginToPoint( scene.modelViewTransformProperty.value.viewToModelPosition( originPosition ) );
    } );

    // Observe when the model view transform changes to update the position of the circle.
    // unlink is unnecessary, exists for the lifetime of the sim.
    scene.modelViewTransformProperty.link( modelViewTransform => {
      this.center = modelViewTransform.modelToViewPosition( Vector2.ZERO );
    } );
  }
}

vectorAddition.register( 'OriginManipulator', OriginManipulator );