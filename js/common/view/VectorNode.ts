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
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import RootVectorNode, { RootVectorArrowNodeOptions, RootVectorNodeOptions } from './RootVectorNode.js';
import VectorAngleNode from './VectorAngleNode.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// options for the vector shadow
const SHADOW_OPTIONS = combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
  fill: Color.BLACK,
  opacity: 0.28
} );

// offsets for vector shadow in view coordinates
const SHADOW_OFFSET_X = 3.2;
const SHADOW_OFFSET_Y = 2.1;

type SelfOptions = EmptySelfOptions;
export type VectorNodeOptions = SelfOptions & RootVectorNodeOptions;

export default class VectorNode extends RootVectorNode {

  public readonly vector: Vector;
  private readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;
  private readonly translationDragListener: DragListener; // for translating the vector
  private readonly disposeVectorNode: () => void;

  public constructor( vector: Vector,
                      scene: VectorAdditionScene,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      angleVisibleProperty: TReadOnlyProperty<boolean>,
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
    affirm( headWidth !== undefined );
    const headHeight = options.arrowOptions.headHeight!;
    affirm( headHeight !== undefined );
    const fractionalHeadHeight = options.arrowOptions.fractionalHeadHeight!;
    affirm( fractionalHeadHeight !== undefined );
    const cursor = options.arrowOptions.cursor!;
    affirm( cursor );

    super( vector,
      scene.graph.modelViewTransformProperty,

      // Show vector value (magnitude) only when 'Values' is checked and the vector is on the graph.
      // See https://github.com/phetsims/vector-addition/issues/330.
      DerivedProperty.and( [ valuesVisibleProperty, vector.isOnGraphProperty ] ),
      scene.selectedVectorProperty,
      options );

    this.modelViewTransformProperty = scene.graph.modelViewTransformProperty;
    this.vector = vector;

    //----------------------------------------------------------------------------------------
    // Create Nodes
    //----------------------------------------------------------------------------------------

    // Since the tail is (0, 0) for the view, the tip is the delta position of the tip
    const tipDeltaPosition = this.modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );

    // Create a Node representing the arc of an angle and the numerical display of the angle.
    // dispose is necessary because it observes angleVisibleProperty.
    const angleNode = new VectorAngleNode( vector, angleVisibleProperty, scene.graph.modelViewTransformProperty );

    // Create a shadow for the vector, visible when the vector is being dragged around off the graph.
    const vectorShadowNode = new ArrowNode( 0, 0, tipDeltaPosition.x, tipDeltaPosition.y, SHADOW_OPTIONS );

    // Reconfigure z-layering
    this.setChildren( [ vectorShadowNode, this.arrowNode, angleNode, this.labelNode ] );

    //----------------------------------------------------------------------------------------
    // Handle vector translation
    //----------------------------------------------------------------------------------------

    // Create a Property for the position of the tail of the vector. Used for the tail drag listener.
    const tailPositionProperty = new Vector2Property( this.modelViewTransformProperty.value.modelToViewPosition(
      vector.tail ) );

    this.translationDragListener = new SoundDragListener( {
      pressCursor: cursor,
      targetNode: this,
      positionProperty: tailPositionProperty,

      start: () => {
        affirm( !this.vector.animateBackProperty.value && !this.vector.isAnimating(),
          'body drag listener should be removed when the vector is animating back.' );
        if ( vector.isOnGraphProperty.value ) {
          scene.selectedVectorProperty.value = vector;
        }
      },

      end: () => {

        affirm( !this.vector.animateBackProperty.value && !this.vector.isAnimating(),
          'body drag listener should be removed when the vector is animating back.' );

        // Determine whether to drop the vector on the graph, or animate the vector back to the toolbox.
        if ( !this.vector.isOnGraphProperty.value ) {

          // Get the cursor position as this determines whether the vector is destined for the graph or toolbox.
          // See https://github.com/phetsims/vector-addition/issues/50
          const cursorPosition = this.modelViewTransformProperty.value
            .viewToModelDelta( this.translationDragListener.localPoint ).plus( this.vector.tail );

          // If the cursor is on the graph, drop the vector on the graph.
          if ( scene.graph.bounds.containsPoint( cursorPosition ) ) {

            // Drop the vector where the shadow was positioned
            const shadowOffset = this.modelViewTransformProperty.value.viewToModelDelta( vectorShadowNode.center )
              .minus( vector.xyComponents.timesScalar( 0.5 ) );
            const shadowTailPosition = vector.tail.plus( shadowOffset );
            this.vector.dropOntoGraph( shadowTailPosition );
          }
          else {

            // otherwise, animate the vector back
            this.vector.animateBackProperty.value = true;
          }
        }
      },

      tandem: Tandem.OPT_OUT //TODO https://github.com/phetsims/vector-addition/issues/258
    } );

    // The body can be translated by the arrow or the label. removeInputListener is required on dispose.
    this.arrowNode.addInputListener( this.translationDragListener );
    this.labelNode.addInputListener( this.translationDragListener );

    // Translate when the vector's tail position changes. unlink is required on dispose.
    const tailListener = ( tailPositionView: Vector2 ) => {
      this.updateTailPosition( tailPositionView );
      if ( vector.isRemovableFromGraph ) {
        const tailPositionModel = this.modelViewTransformProperty.value.viewToModelPosition( tailPositionView );

        const cursorPositionModel = this.modelViewTransformProperty.value
          .viewToModelDelta( this.translationDragListener.localPoint ).plus( tailPositionModel );

        if ( vector.isOnGraphProperty.value && !scene.graph.bounds.containsPoint( cursorPositionModel ) ) {
          vector.popOffOfGraph();
        }
      }
    };
    tailPositionProperty.lazyLink( tailListener );

    // dispose of things related to vector translation
    const disposeTranslate = () => {
      this.arrowNode.removeInputListener( this.translationDragListener );
      this.labelNode.removeInputListener( this.translationDragListener );
      this.translationDragListener.dispose();
      tailPositionProperty.unlink( tailListener );
    };

    //----------------------------------------------------------------------------------------
    // Handle vector scaling & rotation
    //----------------------------------------------------------------------------------------

    let disposeScaleRotate: () => void;
    if ( vector.isTipDraggable ) {

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

      // Position of the tip of the vector, relative to the tail.
      const tipPositionProperty = new Vector2Property( tipDeltaPosition );

      // Drag listener to scale/rotate the vector, attached to the invisible head.
      const scaleRotateDragListener = new SoundDragListener( {
        targetNode: headNode,
        positionProperty: tipPositionProperty,
        start: () => {
          affirm( !this.vector.animateBackProperty.value && !this.vector.isAnimating(),
            'tip drag listener should be removed when the vector is animating back.' );
          scene.selectedVectorProperty.value = vector;
        },
        tandem: Tandem.OPT_OUT //TODO https://github.com/phetsims/vector-addition/issues/258
      } );
      headNode.addInputListener( scaleRotateDragListener );

      // Move the tip to match the vector model. unlink is required on dispose.
      const tipListener = ( tipPosition: Vector2 ) => this.updateTipPosition( tipPosition );
      tipPositionProperty.lazyLink( tipListener );

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
          const viewComponents = this.modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );
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
        headNode.translation = this.modelViewTransformProperty.value.modelToViewDelta( vector.xyComponents );
        headNode.rotation = -xyComponents.angle;
      };
      vector.xyComponentsProperty.link( xyComponentsListener );

      // dispose of things that are related to optional scale/rotate
      disposeScaleRotate = () => {
        headNode.removeInputListener( scaleRotateDragListener );
        tipPositionProperty.unlink( tipListener );
        vector.xyComponentsProperty.unlink( xyComponentsListener );
      };
    }

    //----------------------------------------------------------------------------------------
    // Appearance
    //----------------------------------------------------------------------------------------

    // Update the appearance of the vector's shadow. Must be unmultilinked.
    const shadowMultilink = Multilink.multilink(
      [ vector.isOnGraphProperty, vector.xyComponentsProperty, this.vector.animateBackProperty ],
      ( isOnGraph, xyComponents, animateBack ) => {
        vectorShadowNode.visible = ( !animateBack && !isOnGraph );
        vectorShadowNode.resetTransform();
        if ( !isOnGraph && vectorShadowNode.getBounds().isValid() ) {
          vectorShadowNode.left = this.arrowNode.left + SHADOW_OFFSET_X;
          vectorShadowNode.top = this.arrowNode.top + SHADOW_OFFSET_Y;
        }
        const tipDeltaPosition = this.modelViewTransformProperty.value.modelToViewDelta( xyComponents );
        vectorShadowNode.setTip( tipDeltaPosition.x, tipDeltaPosition.y );
      } );

    // Highlight the vector's label when it is selected. unlink is required on dispose.
    const selectedVectorListener = ( selectedVector: Vector | null ) => {
      this.labelNode.setHighlighted( selectedVector === vector );
    };
    scene.selectedVectorProperty.link( selectedVectorListener );

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
      scene.selectedVectorProperty.unlink( selectedVectorListener );
      this.vector.animateBackProperty.unlink( animateBackListener );
    };
  }

  public override dispose(): void {
    this.disposeVectorNode();
    super.dispose();
  }

  /**
   * Updates the vector model, which will then round the new position depending on the coordinate snap mode
   * @param tipPositionView - the drag listener position
   */
  private updateTipPosition( tipPositionView: Vector2 ): void {
    affirm( !this.vector.animateBackProperty.value && !this.vector.isAnimating(),
      'Cannot drag tip when animating back' );

    const tipPositionModel = this.vector.tail
      .plus( this.modelViewTransformProperty.value.viewToModelDelta( tipPositionView ) );

    this.vector.moveTipToPosition( tipPositionModel );
  }

  /**
   * Updates the model vector's tail position. Called when the vector is being translated.
   */
  private updateTailPosition( tailPositionView: Vector2 ): void {
    affirm( !this.vector.animateBackProperty.value && !this.vector.isAnimating(),
      'Cannot drag tail when animating back' );

    const tailPositionModel = this.modelViewTransformProperty.value.viewToModelPosition( tailPositionView );

    if ( !this.vector.isOnGraphProperty.value ) {
      // Allow translation to anywhere if it isn't on the graph.
      this.vector.moveToTailPosition( tailPositionModel );
    }
    else {
      // Update the model tail position, subject to symmetric rounding, and fit inside the graph bounds.
      this.vector.moveTailToPosition( tailPositionModel );
    }
  }

  /**
   * Forwards an event to translationDragListener. Used for dragging vectors out of the toolbox.
   */
  public forwardEvent( event: PressListenerEvent ): void {
    this.translationDragListener.press( event, this );
  }
}

/**
 * Creates a (rough) dilated shape for a vector head.  The head is pointing to the right.
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