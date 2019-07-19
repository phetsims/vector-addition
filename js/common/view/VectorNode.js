// Copyright 2019, University of Colorado Boulder

/**
 * View for the vectors that are dragged onto the graph. These vectors are created in VectorCreatorPanelSlot.js and
 * support tip dragging and tail translation dragging as well as removing and animating vector back to the creator.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Property = require( 'AXON/Property' );
  const RootVectorNode = require( 'VECTOR_ADDITION/common/view/RootVectorNode' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAngleNode = require( 'VECTOR_ADDITION/common/view/VectorAngleNode' );

  // constants

  // radius of the invisible circle at the tip of the vector
  const TIP_CIRCLE_RADIUS = 10;
  const TIP_CIRCLE_OPTIONS = {
    opacity: 0,
    dilated: 10,
    cursor: 'pointer'
  };

  // arrow options for the vector shadow
  const VECTOR_SHADOW_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.BLACK,
    opacity: 0.28
  } );

  // offsets for vector shadows in view coordinates
  const VECTOR_SHADOW_OFFSET_X = 3.2;
  const VECTOR_SHADOW_OFFSET_Y = 2.1;

  class VectorNode extends RootVectorNode {
    /**
     * @param {Vector} vector- the vector model
     * @param {Graph} graph - the graph the vector belongs to
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {Object} [arrowOptions]
     */
    constructor( vector, graph, valuesVisibleProperty, angleVisibleProperty, arrowOptions ) {

      assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( !arrowOptions || Object.getPrototypeOf( arrowOptions ) === Object.prototype,
        `Extra prototype on arrowOptions: ${arrowOptions}` );

      //----------------------------------------------------------------------------------------

      arrowOptions = _.extend( {

        // Passed to superclass
        fill: VectorAdditionColors[ vector.vectorColorGroup ].fill
      }, arrowOptions );

      super( vector,
        graph.modelViewTransformProperty,
        valuesVisibleProperty,
        graph.activeVectorProperty,
        arrowOptions );

      //----------------------------------------------------------------------------------------
      // Private references

      // @private {Property.<ModelViewTransform2>}
      this.modelViewTransformProperty = graph.modelViewTransformProperty;

      // @private {Vector}
      this.vector = vector;

      //----------------------------------------------------------------------------------------
      // Create custom scenery nodes
      //----------------------------------------------------------------------------------------

      // Since the tail is (0, 0) for the view, the tip is the delta location of the tip
      const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );

      // Create a scenery node representing the arc of an angle and the numerical display of the angle
      const angleNode = new VectorAngleNode( vector, angleVisibleProperty, graph );

      // Create an arrow node that represents the shadow of the vector
      const vectorShadowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, VECTOR_SHADOW_OPTIONS );

      // Create a circle at the tip of the vector. This is used to allow the user to only change the angle of the
      // arrowNode by only dragging the tip
      const tipCircle = new Circle( TIP_CIRCLE_RADIUS, _.extend( { center: tipDeltaLocation }, TIP_CIRCLE_OPTIONS ) );

      // Reconfigure scene graph z-layering
      this.setChildren( [ vectorShadowNode, this.arrowNode, angleNode, this.labelNode, tipCircle ] );

      //----------------------------------------------------------------------------------------
      // Update the tip circle so the user can indefinitely drag the tip
      //----------------------------------------------------------------------------------------

      const updateTipCircleLocation = () => {
        const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );
        tipCircle.center = tipDeltaLocation;
      };
      vector.vectorComponentsProperty.link( updateTipCircleLocation ); // unlinked in this.disposeVectorNode

      //----------------------------------------------------------------------------------------
      // Create Body Drag
      //----------------------------------------------------------------------------------------

      // @public (read-only) {BooleanProperty} indicates when the vector should be animated back to the creator panel
      this.animateBackProperty = new BooleanProperty( false );

      // Create a Property for the location of the tail of the vector. Used for the tail drag listener.
      const tailLocationProperty = new Vector2Property( this.modelViewTransformProperty.value.modelToViewPosition(
        vector.tail ) );

      // @public (read-only) {DragListener} - drag listener for translating the vector. Should only be a input listener
      // when the vector isn't animating back.
      this.bodyDragListener = new DragListener( {
        targetNode: this,
        locationProperty: tailLocationProperty,
        start: () => {

          assert && assert( !this.animateBackProperty.value && !this.vector.inProgressAnimationProperty.value,
            'body drag listener should be removed when the vector is animating back.' );
          this.moveToFront();
        },
        end: () => {

          assert && assert( !this.animateBackProperty.value && !this.vector.inProgressAnimationProperty.value,
            'body drag listener should be removed when the vector is animating back.' );
          //----------------------------------------------------------------------------------------
          // Determine to drop the vector or to animate the vector back if we aren't on the graph
          if ( !this.vector.isOnGraphProperty.value ) {

            // Get the cursor position as this determines to animate back or to drop the vector.
            // See https://github.com/phetsims/vector-addition/issues/50
            const cursorPosition = this.modelViewTransformProperty.value
              .viewToModelDelta( this.bodyDragListener.localPoint ).plus( this.vector.tail );

            // If the cursor is on the graph, drop the vector on the graph
            if ( graph.graphModelBounds.containsPoint( cursorPosition ) ) {

              // Drop the vector where the shadow was positioned
              const shadowOffset = this.modelViewTransformProperty.value.viewToModelDelta( vectorShadowNode.center )
                .minus( vector.vectorComponents.timesScalar( 0.5 ) );

              const shadowTailPosition = vector.tail.plus( shadowOffset );

              this.vector.dropOntoGraph( shadowTailPosition );
            }
            else { // otherwise, animate the vector back
              this.animateBackProperty.value = true;
            }
          }
        }
      } );

      // The body can be translated by the arrow or the label
      this.arrowNode.addInputListener( this.bodyDragListener );
      this.labelNode.addInputListener( this.bodyDragListener );

      //----------------------------------------------------------------------------------------
      // Add listeners
      //----------------------------------------------------------------------------------------

      // Observe the view location Property to call a tail listener that updates the tail in the model
      const tailListener = tailLocation => {
        this.updateTailPosition( tailLocation );

        if ( vector.isRemovable ) {
          const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );

          const cursorPosition = this.modelViewTransformProperty.value
            .viewToModelDelta( this.bodyDragListener.localPoint ).plus( tailPosition );

          if ( vector.isOnGraphProperty.value && !graph.graphModelBounds.containsPoint( cursorPosition ) ) {
            vector.popOffOfGraph();
          }
        }

      };
      tailLocationProperty.lazyLink( tailListener );

      // Observe when the vector is animating back
      const removeBodyDragListener = isAnimatingBack => {
        if ( isAnimatingBack ) {
          this.arrowNode.removeInputListener( this.bodyDragListener );
          this.labelNode.removeInputListener( this.bodyDragListener );
          this.cursor = 'default';
        }
      };
      this.animateBackProperty.lazyLink( removeBodyDragListener );

      //----------------------------------------------------------------------------------------
      // Create Tip Drag
      //----------------------------------------------------------------------------------------

      if ( vector.isTipDraggable ) {

        // Create a Property of the location of the tip of the vector. The location of the tip is measured with respect
        // to the tail.
        const tipLocationProperty = new Vector2Property( tipDeltaLocation );

        const tipDragListener = new DragListener( {
          targetNode: tipCircle,
          locationProperty: tipLocationProperty,
          start: () => {
            assert && assert( !this.animateBackProperty.value && !this.vector.inProgressAnimationProperty.value,
              'tip drag listener should be removed when the vector is animating back.' );
            this.moveToFront();
          }
        } );

        tipCircle.addInputListener( tipDragListener );

        //----------------------------------------------------------------------------------------
        // Add listeners
        //----------------------------------------------------------------------------------------

        // Tip location listener that updates the tail in the model
        const tipListener = tipLocation => {
          this.updateTipPosition( tipLocation );
        };
        // Observe the view location Property to call a tip listener that updates the tail in the model
        tipLocationProperty.lazyLink( tipListener );

        // Observe when the vector is animating back
        const removeTipDragListener = isAnimatingBack => {
          if ( isAnimatingBack ) {
            tipCircle.removeInputListener( tipDragListener );
          }
        };
        this.animateBackProperty.lazyLink( removeTipDragListener );

        // @private {function} - to dispose tip dragging links
        this.disposeTipDrag = () => {
          tipLocationProperty.unlink( tipListener );
          this.animateBackProperty.unlink( removeTipDragListener );
        };
      }

      //----------------------------------------------------------------------------------------
      // Update appearance
      //----------------------------------------------------------------------------------------

      // Function to update the appearance of the vector node depending on if it's on or off the graph or when the
      // vector model changes
      const onGraphListener = ( isOnGraph, vectorComponentsProperty, animateBack ) => {
        this.labelNode.visible = isOnGraph;
        vectorShadowNode.visible = !animateBack && !isOnGraph;

        vectorShadowNode.resetTransform();
        if ( !isOnGraph && vectorShadowNode.getBounds().isValid() ) {
          vectorShadowNode.left = this.arrowNode.left + VECTOR_SHADOW_OFFSET_X;
          vectorShadowNode.top = this.arrowNode.top + VECTOR_SHADOW_OFFSET_Y;
        }

        // Get the tip location in view coordinates
        const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vector.vectorComponents );
        vectorShadowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );
      };

      // Observe changes to the vector model.
      const vectorOnGraphObserver = Property.multilink(
        [ vector.isOnGraphProperty, vector.vectorComponentsProperty, this.animateBackProperty ],
        onGraphListener );

      //----------------------------------------------------------------------------------------
      // Dispose
      // @private {function}
      this.disposeVectorNode = () => {
        vectorOnGraphObserver.dispose();

        if ( vector.isTipDraggable ) {
          this.disposeTipDrag();
        }
        this.animateBackProperty.unlink( removeBodyDragListener );
        tailLocationProperty.unlink( tailListener );

        vector.vectorComponentsProperty.unlink( updateTipCircleLocation );

        tipCircle.dispose();
        angleNode.dispose();
        vectorShadowNode.dispose();
      };
    }

    /**
     * Disposes the vector node
     * @public
     * @override
     */
    dispose() {
      this.disposeVectorNode();
      super.dispose();
    }

    /**
     * Updates the model vector, which will then round the new location depending on the coordinate snap mode
     * @param {Vector2} tipLocation - the drag listener location
     * @private
     */
    updateTipPosition( tipLocation ) {

      assert && assert( !this.animateBackProperty.value && !this.vector.inProgressAnimationProperty.value,
        'Cannot drag tip when animating back' );
      assert && assert( this.vector.isOnGraphProperty.value === true, 'Cannot drag tip when not on graph' );

      const vectorTipPosition = this.vector.tail
        .plus( this.modelViewTransformProperty.value.viewToModelDelta( tipLocation ) );

      this.vector.dragTipToPosition( vectorTipPosition );
    }

    /**
     * Updates the model vector's tail position. Called when the vector is being translated.
     * @param {Vector2} tailLocation
     * @private
     */
    updateTailPosition( tailLocation ) {

      assert && assert( !this.animateBackProperty.value && !this.vector.inProgressAnimationProperty.value,
        'Cannot drag tail when animating back' );

      const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );

      // Allow translation to anywhere if it isn't on the graph
      if ( this.vector.isOnGraphProperty.value === false ) {
        this.vector.translateTailToPosition( tailPosition );
      }
      else {
        // Update the model tail position, subject to symmetric rounding, and fit inside the graph bounds
        this.vector.dragTailToPosition( tailPosition );
      }
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );