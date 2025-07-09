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
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';
import Graph from '../model/Graph.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// the closest the user can drag the origin to the edge of the graph, in model units
const ORIGIN_DRAG_MARGIN = 5;

// origin
const ORIGIN_DIAMETER = 0.8; // in model coordinates

export default class OriginManipulator extends InteractiveHighlighting( ShadedSphereNode ) {

  public constructor( graph: Graph, tandem: Tandem ) {

    // convenience variable
    const modelViewTransform = graph.modelViewTransformProperty.value;

    // Origin, in view coordinates
    const origin = modelViewTransform.modelToViewPosition( Vector2.ZERO );

    // Diameter, in view coordinates
    const diameter = modelViewTransform.modelToViewDeltaX( ORIGIN_DIAMETER );

    const options = combineOptions<ShadedSphereNodeOptions>( {
      isDisposable: false,
      cursor: 'move',
      mainColor: VectorAdditionColors.originColorProperty,
      highlightColor: VectorAdditionColors.originHighlightColorProperty,
      shadowColor: new DerivedProperty( [ VectorAdditionColors.originColorProperty ], originColor => originColor.darkerColor() ),
      stroke: new DerivedProperty( [ VectorAdditionColors.originColorProperty ], originColor => originColor.darkerColor() ),
      lineWidth: 1,
      center: origin,
      touchArea: Shape.circle( 2 * diameter ),
      accessibleName: VectorAdditionStrings.a11y.originManipulator.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionStrings.a11y.originManipulator.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true
    }, AccessibleDraggableOptions );

    super( diameter, options );

    this.touchArea = Shape.circle( 0, 0, diameter );

    // Create a dragBounds to constrain the drag
    const restrictedGraphViewBounds = modelViewTransform.modelToViewBounds( graph.boundsProperty.value.eroded( ORIGIN_DRAG_MARGIN ) );

    // Create a Property to track the view's origin in view coordinates
    const positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioDocumentation: 'Position of the origin manipulator in view coordinates, relative to the top-left corner of the graph.',
      phetioReadOnly: true
    } );

    // Adds an accessible object response that describes the graph's bounds.
    const addGraphBoundsResponse = () => {
      const graphBounds = graph.boundsProperty.value;
      const response = StringUtils.fillIn( VectorAdditionStrings.a11y.originManipulator.accessibleObjectResponseStringProperty.value, {
        minX: graphBounds.minX,
        minY: graphBounds.minY,
        maxX: graphBounds.maxX,
        maxY: graphBounds.maxY
      } );
      this.addAccessibleObjectResponse( response, 'interrupt' );
    };

    // Drag support for pointer and keyboard input, with sound.
    this.addInputListener( new SoundRichDragListener( {
      positionProperty: positionProperty,
      translateNode: false,
      dragBoundsProperty: new Property( restrictedGraphViewBounds ),
      end: () => addGraphBoundsResponse(),
      tandem: tandem,
      keyboardDragListenerOptions: {
        dragDelta: modelViewTransform.modelToViewDeltaX( 1 ),
        moveOnHoldInterval: 100
      }
    } ) );

    // Update the origin position.
    positionProperty.lazyLink( position => graph.moveOriginToPoint( graph.modelViewTransformProperty.value.viewToModelPosition( position ) ) );

    // Observe when the model view transform changes to update the position of the circle.
    graph.modelViewTransformProperty.link( modelViewTransform => {
      this.center = modelViewTransform.modelToViewPosition( Vector2.ZERO );
    } );

    // When the origin manipulator gets focus, add an accessible object response.
    this.focusedProperty.link( focused => {
      if ( focused ) {
        addGraphBoundsResponse();
      }
    } );
  }
}

vectorAddition.register( 'OriginManipulator', OriginManipulator );