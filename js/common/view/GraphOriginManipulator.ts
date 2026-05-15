// Copyright 2019-2026, University of Colorado Boulder

/**
 * GraphOriginManipulator shows the origin on the graph, and can be dragged to reposition the origin.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionFluent from '../../VectorAdditionFluent.js';
import Graph from '../model/Graph.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import GraphOriginDragListener from './GraphOriginDragListener.js';

// the closest the user can drag the origin to the edge of the graph, in model units
const ORIGIN_DRAG_MARGIN = 5;

// origin
const ORIGIN_DIAMETER = 0.8; // in model coordinates

export default class GraphOriginManipulator extends InteractiveHighlighting( ShadedSphereNode ) {

  private readonly graph: Graph;

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
      accessibleName: VectorAdditionFluent.a11y.originManipulator.accessibleNameStringProperty,
      accessibleHelpText: VectorAdditionFluent.a11y.originManipulator.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioFeatured: true,
      phetioInputEnabledPropertyInstrumented: true
    }, AccessibleDraggableOptions );

    super( diameter, options );

    this.graph = graph;
    this.touchArea = Shape.circle( 0, 0, diameter );

    // Create a dragBounds to constrain the drag
    const erodedGraphBounds = modelViewTransform.modelToViewBounds( graph.boundsProperty.value.eroded( ORIGIN_DRAG_MARGIN ) );

    // Create a Property to track the view's origin in view coordinates
    const positionProperty = new Vector2Property( graph.modelViewTransformProperty.value.modelToViewPosition( Vector2.ZERO ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioDocumentation: 'Position of the origin manipulator in view coordinates, relative to the top-left corner of the graph.',
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    // Drag support for pointer and keyboard input, with sound.
    this.addInputListener( new GraphOriginDragListener( positionProperty, erodedGraphBounds, modelViewTransform, {
      end: () => this.describeMoved(),
      tandem: tandem
    } ) );

    // Update the origin position.
    positionProperty.lazyLink( position => {
      if ( !isSettingPhetioStateProperty.value ) {
        graph.moveOriginToPoint( graph.modelViewTransformProperty.value.viewToModelPosition( position ) );
      }
    } );

    // When the modelViewTransform changes, move this manipulator to the new origin of the graph.
    graph.modelViewTransformProperty.link( modelViewTransform => {
      this.center = modelViewTransform.modelToViewPosition( Vector2.ZERO );
    } );

    // When the origin manipulator gets focus, add an accessible object response.
    this.focusedProperty.link( focused => {
      focused && this.describeFocused();
    } );
  }

  /**
   * Describes the manipulator when it gets focus.
   */
  private describeFocused(): void {
    this.addAccessibleFocusObjectResponse( this.getGraphBoundsDescription() );
  }

  /**
   * Describes the manipulator when it is moved. The responses are interruptible so that the user is not spammed with
   * information when pressing the arrow keys repeatedly.
   */
  private describeMoved(): void {
    this.addAccessibleObjectResponse( this.getGraphBoundsDescription(), {
      interruptible: true,
      alertDelay: 1000
    } );
  }

  /**
   * Gets the response that describes the range of the graph's x-axis and y-axis.
   */
  private getGraphBoundsDescription(): string {
    const graphBounds = this.graph.boundsProperty.value;
    return StringUtils.fillIn( VectorAdditionFluent.a11y.originManipulator.accessibleObjectResponseStringProperty.value, {
      minX: graphBounds.minX,
      minY: graphBounds.minY,
      maxX: graphBounds.maxX,
      maxY: graphBounds.maxY
    } );
  }
}
