// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for the vectors that are dragged onto the graph.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import RootVectorNode, { RootVectorArrowNodeOptions, RootVectorNodeOptions } from './RootVectorNode.js';
import VectorAngleNode from './VectorAngleNode.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { VectorTranslationDragListener } from './VectorTranslationDragListener.js';
import VectorScaleRotateDragListener from './VectorScaleRotateDragListener.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';

// options for the vector shadow
const SHADOW_OPTIONS = combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
  fill: Color.BLACK,
  opacity: 0.28
} );

// offsets for vector shadow in view coordinates
const SHADOW_X_OFFSET = 3.2;
const SHADOW_Y_OFFSET = 2.1;

type SelfOptions = EmptySelfOptions;
export type VectorNodeOptions = SelfOptions & RootVectorNodeOptions;

export default class VectorNode extends RootVectorNode {

  public readonly vector: Vector;
  private readonly translationDragListener: DragListener;
  private readonly disposeVectorNode: () => void;

  public constructor( vector: Vector,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions?: VectorNodeOptions ) {

    const options = optionize<VectorNodeOptions, SelfOptions, RootVectorNodeOptions>()( {

      // RootVectorNodeOptions
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>(
        {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
          cursor: 'move',
          fill: vector.vectorColorPalette.vectorFillProperty,
          stroke: vector.vectorColorPalette.vectorStrokeProperty
        } )
    }, providedOptions );

    // To improve readability
    const headWidth = options.arrowOptions.headWidth!;
    affirm( headWidth !== undefined, 'Expected headWidth to be defined.' );
    const headHeight = options.arrowOptions.headHeight!;
    affirm( headWidth !== undefined, 'Expected headHeight to be defined.' );
    const fractionalHeadHeight = options.arrowOptions.fractionalHeadHeight!;
    affirm( fractionalHeadHeight !== undefined, 'Expected fractionalHeadHeight to be defined.' );
    const cursor = options.arrowOptions.cursor!;
    affirm( cursor, 'Expected cursor to be defined.' );

    super( vector,
      modelViewTransformProperty,

      // Show vector value (magnitude) only when 'Values' is checked and the vector is on the graph.
      // See https://github.com/phetsims/vector-addition/issues/330.
      DerivedProperty.and( [ valuesVisibleProperty, vector.isOnGraphProperty ] ),
      selectedVectorProperty,
      options );

    this.vector = vector;

    //----------------------------------------------------------------------------------------
    // Create Nodes
    //----------------------------------------------------------------------------------------

    // Since the tail is (0, 0) for the view, the tip is the delta position of the tip
    const tipDeltaPosition = modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );

    // Create a Node representing the arc of an angle and the numerical display of the angle.
    // dispose is necessary because it observes anglesVisibleProperty.
    const angleNode = new VectorAngleNode( vector, anglesVisibleProperty, modelViewTransformProperty );

    // Create a shadow for the vector, visible when the vector is being dragged around off the graph.
    const vectorShadowNode = new ArrowNode( 0, 0, tipDeltaPosition.x, tipDeltaPosition.y, SHADOW_OPTIONS );

    // Reconfigure z-layering
    this.setChildren( [ vectorShadowNode, this.arrowNode, angleNode, this.labelNode ] );

    //----------------------------------------------------------------------------------------
    // Handle vector translation
    //----------------------------------------------------------------------------------------

    this.translationDragListener = new VectorTranslationDragListener(
      vector,
      selectedVectorProperty,
      graphBoundsProperty,
      this,
      vectorShadowNode,
      modelViewTransformProperty,
      cursor
    );

    // The vector can be translated by dragging the arrow or the label. removeInputListener is required on dispose.
    this.arrowNode.addInputListener( this.translationDragListener );
    this.labelNode.addInputListener( this.translationDragListener );

    // dispose of things related to vector translation
    const disposeTranslate = () => {
      this.arrowNode.removeInputListener( this.translationDragListener );
      this.labelNode.removeInputListener( this.translationDragListener );
      this.translationDragListener.dispose();
    };

    let disposeScaleRotate: () => void;
    if ( vector.isTipDraggable ) {

      //----------------------------------------------------------------------------------------
      // Handle vector scaling & rotation
      //----------------------------------------------------------------------------------------

      // Create an invisible triangle at the head of the vector.
      const headShape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( -headHeight, -headWidth / 2 )
        .lineTo( -headHeight, headWidth / 2 )
        .close();
      const headNode = new Path( headShape, {
        stroke: phet.chipper.queryParameters.dev ? 'red' : null,
        cursor: 'pointer'
      } );
      this.addChild( headNode );

      // The vector can be scaled and rotated by dragging its head.
      const scaleRotateDragListener = new VectorScaleRotateDragListener(
        vector,
        selectedVectorProperty,
        this,
        headNode,
        modelViewTransformProperty
      );
      headNode.addInputListener( scaleRotateDragListener );

      //----------------------------------------------------------------------------------------
      // Transform the head and its pointer areas when the xy-components change.
      //----------------------------------------------------------------------------------------

      // Pointer area shapes for the head, in 3 different sizes.
      // A pair of these is used, based on the magnitude of the vector and whether its head is scale.
      // See below and https://github.com/phetsims/vector-addition/issues/240#issuecomment-544682818
      const largeMouseAreaShape = headShape.getOffsetShape( VectorAdditionConstants.VECTOR_HEAD_MOUSE_AREA_DILATION );
      const largeTouchAreaShape = headShape.getOffsetShape( VectorAdditionConstants.VECTOR_HEAD_TOUCH_AREA_DILATION );
      const mediumMouseAreaShape = createDilatedHead( headWidth, headHeight, VectorAdditionConstants.VECTOR_HEAD_MOUSE_AREA_DILATION );
      const mediumTouchAreaShape = createDilatedHead( headWidth, headHeight, VectorAdditionConstants.VECTOR_HEAD_TOUCH_AREA_DILATION );
      const SMALL_HEAD_SCALE = 0.65; // determined empirically
      const smallMouseAreaShape = createDilatedHead( headWidth, SMALL_HEAD_SCALE * headHeight, VectorAdditionConstants.VECTOR_HEAD_MOUSE_AREA_DILATION );
      const smallTouchAreaShape = createDilatedHead( headWidth, SMALL_HEAD_SCALE * headHeight, VectorAdditionConstants.VECTOR_HEAD_TOUCH_AREA_DILATION );

      // When the vector changes, transform the head and adjust its pointer areas. unlinked is required when disposed.
      const xyComponentsListener = ( xyComponents: Vector2 ) => {

        // Adjust pointer areas. See https://github.com/phetsims/vector-addition/issues/240#issuecomment-544682818
        const SHORT_MAGNITUDE = 3;
        if ( xyComponents.magnitude <= SHORT_MAGNITUDE ) {

          // We have a 'short' vector, so adjust the head's pointer areas so that the tail can still be grabbed.
          const viewComponents = modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );
          const viewMagnitude = viewComponents.magnitude;
          const maxHeadHeight = fractionalHeadHeight * viewMagnitude;

          if ( headHeight > maxHeadHeight ) {

            // head is scaled (see ArrowNode fractionalHeadHeight), use small pointer areas
            headNode.mouseArea = smallMouseAreaShape;
            headNode.touchArea = smallTouchAreaShape;
          }
          else {

            // head is not scaled, use medium pointer areas
            headNode.mouseArea = mediumMouseAreaShape;
            headNode.touchArea = mediumTouchAreaShape;
          }
        }
        else {

          // We have a 'long' vector, so use the large pointer areas.
          headNode.mouseArea = largeMouseAreaShape;
          headNode.touchArea = largeTouchAreaShape;
        }

        // Transform the invisible head to match the position and angle of the actual vector.
        headNode.translation = modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );
        headNode.rotation = -xyComponents.angle;
      };
      vector.xyComponentsProperty.link( xyComponentsListener );

      // dispose of things that are related to optional scale/rotate
      disposeScaleRotate = () => {
        headNode.removeInputListener( scaleRotateDragListener );
        vector.xyComponentsProperty.unlink( xyComponentsListener );
        scaleRotateDragListener.dispose();
      };
    }

    //----------------------------------------------------------------------------------------
    // Appearance
    //----------------------------------------------------------------------------------------

    // Update the appearance of the vector's shadow. Must be disposed.
    const shadowMultilink = Multilink.multilink(
      [ vector.isOnGraphProperty, vector.xyComponentsProperty, this.vector.animateBackProperty ],
      ( isOnGraph, xyComponents, animateBack ) => {
        vectorShadowNode.visible = ( !animateBack && !isOnGraph );
        vectorShadowNode.resetTransform();
        if ( !isOnGraph && vectorShadowNode.getBounds().isValid() ) {
          vectorShadowNode.left = this.arrowNode.left + SHADOW_X_OFFSET;
          vectorShadowNode.top = this.arrowNode.top + SHADOW_Y_OFFSET;
        }
        const tipDeltaPosition = modelViewTransformProperty.value.modelToViewDelta( xyComponents );
        vectorShadowNode.setTip( tipDeltaPosition.x, tipDeltaPosition.y );
      } );

    // Highlight the vector's label when it is selected. unlink is required on dispose.
    const selectedVectorListener = ( selectedVector: Vector | null ) => {
      this.labelNode.setHighlighted( selectedVector === vector );
    };
    selectedVectorProperty.link( selectedVectorListener );

    // Disable interaction when the vector is animating back to the toolbox, where it will be disposed.
    // unlink is required on dispose.
    const animateBackListener = ( animateBack: boolean ) => {
      if ( animateBack ) {
        this.interruptSubtreeInput();
        this.pickable = false;
        this.cursor = 'default';
      }
    };
    this.vector.animateBackProperty.lazyLink( animateBackListener );

    this.disposeVectorNode = () => {

      // Dispose of nodes
      angleNode.dispose();

      // Dispose of transform handling
      disposeTranslate();
      disposeScaleRotate();

      // Dispose of appearance-related listeners
      shadowMultilink.dispose();
      selectedVectorProperty.unlink( selectedVectorListener );
      this.vector.animateBackProperty.unlink( animateBackListener );
    };
  }

  public override dispose(): void {
    this.disposeVectorNode();
    super.dispose();
  }

  /**
   * Forwards an event to translationDragListener. Used for dragging vectors out of the toolbox.
   */
  public forwardEvent( event: PressListenerEvent ): void {
    this.translationDragListener.press( event, this );
  }

  /**
   * Queues an accessible object response when the vector has been translated.
   */
  public doAccessibleObjectResponseTranslate(): void {
    this.addAccessibleObjectResponse( StringUtils.fillIn( VectorAdditionStrings.a11y.vectorNode.body.accessibleObjectResponseStringProperty, {
      tailX: this.vector.tailX,
      tailY: this.vector.tailY,
      tipX: this.vector.tipX,
      tipY: this.vector.tipY
    } ) );
  }

  /**
   * Queues an accessible object response when the vector has been scaled or rotated.
   */
  public doAccessibleObjectResponseScaleRotate(): void {
    this.addAccessibleObjectResponse( StringUtils.fillIn( VectorAdditionStrings.a11y.vectorNode.tip.accessibleObjectResponseStringProperty, {
      tipX: this.vector.tipX,
      tipY: this.vector.tipY
    } ) );
  }
}

/**
 * Creates a dilated shape for the vector's head.  The head is pointing to the right.
 */
function createDilatedHead( headWidth: number, headHeight: number, dilation: number ): Shape {

  // Starting from the upper left and moving clockwise
  return new Shape()
    .moveTo( -headHeight, -headHeight / 2 - dilation )
    .lineTo( 0, -dilation )
    .lineTo( dilation, 0 )
    .lineTo( 0, dilation )
    .lineTo( -headHeight, headWidth / 2 + dilation )
    .close();
}

vectorAddition.register( 'VectorNode', VectorNode );