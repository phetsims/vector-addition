// Copyright 2019-2023, University of Colorado Boulder

/**
 * View for the vectors that are dragged onto the graph. These vectors are created in VectorCreatorPanelSlot.js and
 * support tip dragging and tail translation dragging as well as removing and animating vector back to the creator.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Color, DragListener, Path, SceneryEvent } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import Graph from '../model/Graph.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import RootVectorNode from './RootVectorNode.js';
import VectorAngleNode from './VectorAngleNode.js';

// constants

// options for the vector shadow
const SHADOW_OPTIONS = merge( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
  fill: Color.BLACK,
  opacity: 0.28
} );

// offsets for vector shadow in view coordinates
const SHADOW_OFFSET_X = 3.2;
const SHADOW_OFFSET_Y = 2.1;

export default class VectorNode extends RootVectorNode {

  /**
   * @param {Vector} vector- the vector model
   * @param {Graph} graph - the graph the vector belongs to
   * @param {BooleanProperty} valuesVisibleProperty
   * @param {BooleanProperty} angleVisibleProperty
   * @param {Object} [options]
   */
  constructor( vector, graph, valuesVisibleProperty, angleVisibleProperty, options ) {

    assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
    assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
    assert && assert( valuesVisibleProperty instanceof BooleanProperty, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
    assert && assert( angleVisibleProperty instanceof BooleanProperty, `invalid angleVisibleProperty: ${angleVisibleProperty}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    //----------------------------------------------------------------------------------------

    options = merge( {
      arrowOptions: merge( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        cursor: 'move',
        fill: vector.vectorColorPalette.mainFill,
        stroke: vector.vectorColorPalette.mainStroke
      } )
    }, options );

    super( vector,
      graph.modelViewTransformProperty,
      valuesVisibleProperty,
      graph.activeVectorProperty,
      options );

    // @private
    this.modelViewTransformProperty = graph.modelViewTransformProperty;
    this.vector = vector;

    //----------------------------------------------------------------------------------------
    // Create Nodes
    //----------------------------------------------------------------------------------------

    // Since the tail is (0, 0) for the view, the tip is the delta position of the tip
    const tipDeltaPosition = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );

    // Create a scenery node representing the arc of an angle and the numerical display of the angle.
    // dispose is necessary because it observes angleVisibleProperty.
    const angleNode = new VectorAngleNode( vector, angleVisibleProperty, graph.modelViewTransformProperty );

    // Create a shadow for the vector, visible when the vector is being dragged around off the graph.
    const vectorShadowNode = new ArrowNode( 0, 0, tipDeltaPosition.x, tipDeltaPosition.y, SHADOW_OPTIONS );

    // Reconfigure scene graph z-layering
    this.setChildren( [ vectorShadowNode, this.arrowNode, angleNode, this.labelNode ] );

    //----------------------------------------------------------------------------------------
    // Handle vector translation
    //----------------------------------------------------------------------------------------

    // Create a Property for the position of the tail of the vector. Used for the tail drag listener.
    const tailPositionProperty = new Vector2Property( this.modelViewTransformProperty.value.modelToViewPosition(
      vector.tail ) );

    // @private drag listener for translating the vector
    this.translationDragListener = new DragListener( {
      pressCursor: options.arrowOptions.cursor,
      targetNode: this,
      positionProperty: tailPositionProperty,

      start: () => {
        assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
          'body drag listener should be removed when the vector is animating back.' );
        if ( vector.isOnGraphProperty.value ) {
          graph.activeVectorProperty.value = vector;
        }
      },

      end: () => {

        assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
          'body drag listener should be removed when the vector is animating back.' );

        // Determine whether to drop the vector on the graph, or animate the vector back to the toolbox.
        if ( !this.vector.isOnGraphProperty.value ) {

          // Get the cursor position as this determines whether the vector is destined for the graph or toolbox.
          // See https://github.com/phetsims/vector-addition/issues/50
          const cursorPosition = this.modelViewTransformProperty.value
            .viewToModelDelta( this.translationDragListener.localPoint ).plus( this.vector.tail );

          // If the cursor is on the graph, drop the vector on the graph
          if ( graph.graphModelBounds.containsPoint( cursorPosition ) ) {

            // Drop the vector where the shadow was positioned
            const shadowOffset = this.modelViewTransformProperty.value.viewToModelDelta( vectorShadowNode.center )
              .minus( vector.vectorComponents.timesScalar( 0.5 ) );
            const shadowTailPosition = vector.tail.plus( shadowOffset );
            this.vector.dropOntoGraph( shadowTailPosition );
          }
          else {

            // otherwise, animate the vector back
            this.vector.animateBackProperty.value = true;
          }
        }
      }
    } );

    // The body can be translated by the arrow or the label. removeInputListener is required on dispose.
    this.arrowNode.addInputListener( this.translationDragListener );
    this.labelNode.addInputListener( this.translationDragListener );

    // Translate when the vector's tail position changes. unlink is required on dispose.
    const tailListener = tailPositionView => {
      this.updateTailPosition( tailPositionView );
      if ( vector.isRemovable ) {
        const tailPositionModel = this.modelViewTransformProperty.value.viewToModelPosition( tailPositionView );

        const cursorPositionModel = this.modelViewTransformProperty.value
          .viewToModelDelta( this.translationDragListener.localPoint ).plus( tailPositionModel );

        if ( vector.isOnGraphProperty.value && !graph.graphModelBounds.containsPoint( cursorPositionModel ) ) {
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

    let disposeScaleRotate = null;
    if ( vector.isTipDraggable ) {

      // To improve readability
      const headWidth = options.arrowOptions.headWidth;
      const headHeight = options.arrowOptions.headHeight;
      const headTouchAreaDilation = VectorAdditionConstants.VECTOR_HEAD_TOUCH_AREA_DILATION;
      const headMouseAreaDilation = VectorAdditionConstants.VECTOR_HEAD_MOUSE_AREA_DILATION;

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
      const scaleRotateDragListener = new DragListener( {
        targetNode: headNode,
        positionProperty: tipPositionProperty,
        start: () => {
          assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
            'tip drag listener should be removed when the vector is animating back.' );
          graph.activeVectorProperty.value = vector;
        }
      } );
      headNode.addInputListener( scaleRotateDragListener );

      // Move the tip to match the vector model. unlink is required on dispose.
      const tipListener = tipPosition => {
        this.updateTipPosition( tipPosition );
      };
      tipPositionProperty.lazyLink( tipListener );

      // Pointer area shapes for the head, in 3 different sizes.
      // A pair of these is used, based on the magnitude of the vector and whether its head is scale.
      // See below and https://github.com/phetsims/vector-addition/issues/240#issuecomment-544682818
      const largeMouseAreaShape = headShape.getOffsetShape( headMouseAreaDilation );
      const largeTouchAreaShape = headShape.getOffsetShape( headTouchAreaDilation );
      const mediumMouseAreaShape = createDilatedHead( headWidth, headHeight, headMouseAreaDilation );
      const mediumTouchAreaShape = createDilatedHead( headWidth, headHeight, headTouchAreaDilation );
      const SMALL_HEAD_SCALE = 0.65; // determined empirically
      const smallMouseAreaShape = createDilatedHead( headWidth, SMALL_HEAD_SCALE * headHeight, headMouseAreaDilation );
      const smallTouchAreaShape = createDilatedHead( headWidth, SMALL_HEAD_SCALE * headHeight, headTouchAreaDilation );

      // When the vector changes, transform the head and adjust its pointer areas. unlinked is required when disposed.
      const vectorComponentsListener = vectorComponents => {

        // Adjust pointer areas. See https://github.com/phetsims/vector-addition/issues/240#issuecomment-544682818
        const SHORT_MAGNITUDE = 3;
        if ( vectorComponents.magnitude <= SHORT_MAGNITUDE ) {

          // We have a 'short' vector, so adjust the head's pointer areas so that the tail can still be grabbed.
          const viewComponents = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );
          const viewMagnitude = viewComponents.magnitude;
          const maxHeadHeight = options.arrowOptions.fractionalHeadHeight * viewMagnitude;

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
        headNode.translation = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );
        headNode.rotation = -vectorComponents.angle;
      };
      vector.vectorComponentsProperty.link( vectorComponentsListener );

      // dispose of things that are related to optional scale/rotate
      disposeScaleRotate = () => {
        headNode.removeInputListener( scaleRotateDragListener );
        tipPositionProperty.unlink( tipListener );
        vector.vectorComponentsProperty.unlink( vectorComponentsListener );
      };
    }

    //----------------------------------------------------------------------------------------
    // Appearance
    //----------------------------------------------------------------------------------------

    // Update the appearance of the vector's shadow. Must be unmultilinked.
    const shadowMultilink = Multilink.multilink(
      [ vector.isOnGraphProperty, vector.vectorComponentsProperty, this.vector.animateBackProperty ],
      ( isOnGraph, vectorComponents, animateBack ) => {
        vectorShadowNode.visible = ( !animateBack && !isOnGraph );
        vectorShadowNode.resetTransform();
        if ( !isOnGraph && vectorShadowNode.getBounds().isValid() ) {
          vectorShadowNode.left = this.arrowNode.left + SHADOW_OFFSET_X;
          vectorShadowNode.top = this.arrowNode.top + SHADOW_OFFSET_Y;
        }
        const tipDeltaPosition = this.modelViewTransformProperty.value.modelToViewDelta( vectorComponents );
        vectorShadowNode.setTip( tipDeltaPosition.x, tipDeltaPosition.y );
      } );

    // Show the vector's label when it's on the graph. Must be unlinked.
    const isOnGraphListener = isOnGraph => ( this.labelNode.visible = isOnGraph );
    vector.isOnGraphProperty.link( isOnGraphListener );

    // Highlight the vector's label when it is selected. Must be unlinked.
    const activeVectorListener = activeVector => {
      this.labelNode.setHighlighted( activeVector === vector );
    };
    graph.activeVectorProperty.link( activeVectorListener );

    // Disable interaction when the vector is animating back to the toolbox, where it will be disposed.
    // unlink is required on dispose.
    const animateBackListener = animateBack => {
      if ( animateBack ) {
        this.interruptSubtreeInput();
        this.pickable = false;
        this.cursor = 'default';
      }
    };
    this.vector.animateBackProperty.lazyLink( animateBackListener );

    // @private
    this.disposeVectorNode = () => {

      // Dispose of nodes
      angleNode.dispose();

      // Dispose of transform handling
      disposeTranslate();
      disposeScaleRotate && disposeScaleRotate();

      // Dispose of appearance-related listeners
      Multilink.unmultilink( shadowMultilink );
      vector.isOnGraphProperty.unlink( isOnGraphListener );
      graph.activeVectorProperty.unlink( activeVectorListener );
      this.vector.animateBackProperty.unlink( animateBackListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeVectorNode();
    super.dispose();
  }

  /**
   * Updates the vector model, which will then round the new position depending on the coordinate snap mode
   * @param {Vector2} tipPositionView - the drag listener position
   * @private
   */
  updateTipPosition( tipPositionView ) {
    assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
      'Cannot drag tip when animating back' );

    const tipPositionModel = this.vector.tail
      .plus( this.modelViewTransformProperty.value.viewToModelDelta( tipPositionView ) );

    this.vector.moveTipToPosition( tipPositionModel );
  }

  /**
   * Updates the model vector's tail position. Called when the vector is being translated.
   * @param {Vector2} tailPositionView
   * @private
   */
  updateTailPosition( tailPositionView ) {
    assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
      'Cannot drag tail when animating back' );

    const tailPositionModel = this.modelViewTransformProperty.value.viewToModelPosition( tailPositionView );

    // Allow translation to anywhere if it isn't on the graph
    if ( this.vector.isOnGraphProperty.value === false ) {
      this.vector.moveToTailPosition( tailPositionModel );
    }
    else {
      // Update the model tail position, subject to symmetric rounding, and fit inside the graph bounds
      this.vector.moveTailToPosition( tailPositionModel );
    }
  }

  /**
   * Forwards an event to translationDragListener. Used for dragging vectors out of the toolbox.
   * @param {SceneryEvent} event
   * @public
   */
  forwardEvent( event ) {
    assert && assert( event instanceof SceneryEvent, 'invalid event' );
    this.translationDragListener.press( event, this );
  }
}

/**
 * Creates a (rough) dilated shape for a vector head.  The head is pointing to the right.
 * @param {number} headWidth
 * @param {number} headHeight
 * @param {number} dilation
 * @returns {Shape}
 */
function createDilatedHead( headWidth, headHeight, dilation ) {

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