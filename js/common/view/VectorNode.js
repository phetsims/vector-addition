// Copyright 2019, University of Colorado Boulder

/**
 * View for the vectors that are dragged onto the graph. These vectors are created in VectorCreatorPanelSlot.js and
 * support tip dragging and tail translation dragging as well as removing and animating vector back to the creator.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Event = require( 'SCENERY/input/Event' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const merge = require( 'PHET_CORE/merge' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const RootVectorNode = require( 'VECTOR_ADDITION/common/view/RootVectorNode' );
  const Shape = require( 'KITE/Shape' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAngleNode = require( 'VECTOR_ADDITION/common/view/VectorAngleNode' );

  // constants

  // options for the vector shadow
  const SHADOW_OPTIONS = merge( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
    fill: Color.BLACK,
    opacity: 0.28
  } );

  // offsets for vector shadow in view coordinates
  const SHADOW_OFFSET_X = 3.2;
  const SHADOW_OFFSET_Y = 2.1;

  class VectorNode extends RootVectorNode {

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

      // Since the tail is (0, 0) for the view, the tip is the delta location of the tip
      const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );

      // Create a scenery node representing the arc of an angle and the numerical display of the angle.
      // dispose is necessary because it observes angleVisibleProperty.
      const angleNode = new VectorAngleNode( vector, angleVisibleProperty, graph.modelViewTransformProperty );

      // Create a shadow for the vector, visible when the vector is being dragged around off the graph.
      const vectorShadowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, SHADOW_OPTIONS );

      // Reconfigure scene graph z-layering
      this.setChildren( [ vectorShadowNode, this.arrowNode, angleNode, this.labelNode ] );

      //----------------------------------------------------------------------------------------
      // Handle vector translation
      //----------------------------------------------------------------------------------------

      // Create a Property for the location of the tail of the vector. Used for the tail drag listener.
      const tailLocationProperty = new Vector2Property( this.modelViewTransformProperty.value.modelToViewPosition(
        vector.tail ) );

      // @private drag listener for translating the vector
      this.translationDragListener = new DragListener( {
        pressCursor: options.arrowOptions.cursor,
        targetNode: this,
        locationProperty: tailLocationProperty,

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

      // Disable translate interaction when the vector is animating back to the toolbox. unlink is required on dispose.
      const removeTranslationDragListener = animateBack => {
        if ( animateBack ) {
          this.arrowNode.pickable = !animateBack;
          this.labelNode.pickable = !animateBack;
          this.cursor = 'default';
        }
      };
      this.vector.animateBackProperty.lazyLink( removeTranslationDragListener );

      // Translate when the vector's tail position changes. unlink is required on dispose.
      const tailListener = tailLocation => {
        this.updateTailPosition( tailLocation );
        if ( vector.isRemovable ) {
          const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );

          const cursorPosition = this.modelViewTransformProperty.value
            .viewToModelDelta( this.translationDragListener.localPoint ).plus( tailPosition );

          if ( vector.isOnGraphProperty.value && !graph.graphModelBounds.containsPoint( cursorPosition ) ) {
            vector.popOffOfGraph();
          }
        }
      };
      tailLocationProperty.lazyLink( tailListener );

      // dispose of things related to vector translation
      const disposeTranslate = () => {
        this.arrowNode.removeInputListener( this.translationDragListener );
        this.labelNode.removeInputListener( this.translationDragListener );
        this.translationDragListener.dispose();
        this.vector.animateBackProperty.unlink( removeTranslationDragListener );
        tailLocationProperty.unlink( tailListener );
      };

      //----------------------------------------------------------------------------------------
      // Handle vector scaling & rotation
      //----------------------------------------------------------------------------------------

      let disposeScaleRotate = null;
      if ( vector.isTipDraggable ) {

        const headWidth = options.arrowOptions.headWidth;
        const headHeight = options.arrowOptions.headHeight;

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

        // Set pointer areas for the head.
        headNode.touchArea = headShape.getOffsetShape( VectorAdditionConstants.VECTOR_HEAD_TOUCH_AREA_DILATION );
        headNode.mouseArea = headShape.getOffsetShape( VectorAdditionConstants.VECTOR_HEAD_MOUSE_AREA_DILATION );

        // Location of the tip of the vector, relative to the tail.
        const tipLocationProperty = new Vector2Property( tipDeltaLocation );

        // Drag listener to scale/rotate the vector, attached to the invisible head.
        const scaleRotateDragListener = new DragListener( {
          targetNode: headNode,
          locationProperty: tipLocationProperty,
          start: () => {
            assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
              'tip drag listener should be removed when the vector is animating back.' );
            graph.activeVectorProperty.value = vector;
          }
        } );
        headNode.addInputListener( scaleRotateDragListener );

        // Move the tip to match the vector model. unlink is required on dispose.
        const tipListener = tipLocation => {
          this.updateTipPosition( tipLocation );
        };
        tipLocationProperty.lazyLink( tipListener );

        // When the vector changes, transform the head. unlinked is required when disposed.
        const vectorComponentsListener = vectorComponents => {
          headNode.translation = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );
          headNode.rotation = -vectorComponents.angle;
        };
        vector.vectorComponentsProperty.link( vectorComponentsListener );

        // Disable scale/rotate interaction when the vector is animating back to the toolbox. unlink is required on dispose.
        const disableScaleRotateDragListener = animateBack => {
          headNode.pickable = !animateBack;
        };
        this.vector.animateBackProperty.lazyLink( disableScaleRotateDragListener );

        // dispose of things that are related to optional scale/rotate
        disposeScaleRotate = () => {
          headNode.removeInputListener( scaleRotateDragListener );
          tipLocationProperty.unlink( tipListener );
          vector.vectorComponentsProperty.unlink( vectorComponentsListener );
          this.vector.animateBackProperty.unlink( disableScaleRotateDragListener );
        };
      }

      //----------------------------------------------------------------------------------------
      // Appearance
      //----------------------------------------------------------------------------------------

      // Update the appearance of the vector's shadow. Must be unmultilinked.
      const shadowMultilink = Property.multilink(
        [ vector.isOnGraphProperty, vector.vectorComponentsProperty, this.vector.animateBackProperty ],
        ( isOnGraph, vectorComponents, animateBack ) => {
          vectorShadowNode.visible = ( !animateBack && !isOnGraph );
          vectorShadowNode.resetTransform();
          if ( !isOnGraph && vectorShadowNode.getBounds().isValid() ) {
            vectorShadowNode.left = this.arrowNode.left + SHADOW_OFFSET_X;
            vectorShadowNode.top = this.arrowNode.top + SHADOW_OFFSET_Y;
          }
          const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vectorComponents );
          vectorShadowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );
        } );

      // Show the vector's label when it's on the graph. Must be unlinked.
      const isOnGraphListener = isOnGraph => ( this.labelNode.visible = isOnGraph );
      vector.isOnGraphProperty.link( isOnGraphListener );

      // Highlight the vector's label when it is selected. Must be unlinked.
      const activeVectorListener = activeVector => {
        this.labelNode.setHighlighted( activeVector === vector );
      };
      graph.activeVectorProperty.link( activeVectorListener );

      //----------------------------------------------------------------------------------------
      // Dispose
      //----------------------------------------------------------------------------------------

      // @private
      this.disposeVectorNode = () => {

        // Dispose of nodes
        angleNode.dispose();

        // Dispose of transform handling
        disposeTranslate();
        disposeScaleRotate && disposeScaleRotate();

        // Dispose of appearance-related listeners
        Property.unmultilink( shadowMultilink );
        vector.isOnGraphProperty.unlink( isOnGraphListener );
        graph.activeVectorProperty.unlink( activeVectorListener );
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
     * Updates the vector model, which will then round the new location depending on the coordinate snap mode
     * @param {Vector2} tipLocation - the drag listener location
     * @private
     */
    updateTipPosition( tipLocation ) {
      assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
        'Cannot drag tip when animating back' );
      assert && assert( this.vector.isOnGraphProperty.value === true, 'Cannot drag tip when not on graph' );

      const vectorTipPosition = this.vector.tail
        .plus( this.modelViewTransformProperty.value.viewToModelDelta( tipLocation ) );

      this.vector.moveTipToPosition( vectorTipPosition );
    }

    /**
     * Updates the model vector's tail position. Called when the vector is being translated.
     * @param {Vector2} tailLocation
     * @private
     */
    updateTailPosition( tailLocation ) {
      assert && assert( !this.vector.animateBackProperty.value && !this.vector.inProgressAnimation,
        'Cannot drag tail when animating back' );

      const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );

      // Allow translation to anywhere if it isn't on the graph
      if ( this.vector.isOnGraphProperty.value === false ) {
        this.vector.moveToTailPosition( tailPosition );
      }
      else {
        // Update the model tail position, subject to symmetric rounding, and fit inside the graph bounds
        this.vector.moveTailToPosition( tailPosition );
      }
    }

    /**
     * Forwards an event to translationDragListener. Used for dragging vectors out of the toolbox.
     * @param {Event} event
     * @public
     */
    forwardEvent( event ) {
      assert && assert( event instanceof Event, 'invalid event' );
      this.translationDragListener.press( event, this );
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );