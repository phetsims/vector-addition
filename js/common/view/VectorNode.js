// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'main' vectors (the vectors that are dragged onto the graph). The vectors are created in
 * VectorCreatorPanelSlot.js and support tip dragging and tail translation dragging.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BaseVectorNode = require( 'VECTOR_ADDITION/common/view/BaseVectorNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Property = require( 'AXON/Property' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAngleNode = require( 'VECTOR_ADDITION/common/view/VectorAngleNode' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants
  const TIP_CIRCLE_RADIUS = 10;
  const TIP_CIRCLE_OPTIONS = {
    opacity: 0,
    dilated: 10,
    cursor: 'pointer'
  };
  const VECTOR_SHADOW_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.BLACK,
    opacity: 0.4
  } );
  const VECTOR_SHADOW_OFFSET = 6.2;

  class VectorNode extends BaseVectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Graph} graph - the graph the vector belongs to
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {Object} [arrowOptions]
     */
    constructor( vectorModel, graph, valuesVisibleProperty, angleVisibleProperty, arrowOptions ) {

      assert && assert( vectorModel instanceof VectorModel, `invalid vectorModel: ${vectorModel}` );
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
        fill: VectorAdditionColors[ vectorModel.vectorGroup ].fill
      }, arrowOptions );

      super( vectorModel, graph.modelViewTransformProperty, valuesVisibleProperty, arrowOptions );

      //----------------------------------------------------------------------------------------

      // Convenience references
      const modelViewTransformProperty = graph.modelViewTransformProperty;
      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( vectorModel.attributesVector );


      // Create a scenery node representing the arc of an angle and the numerical display of the angle
      const angleNode = new VectorAngleNode( vectorModel, angleVisibleProperty, graph.modelViewTransformProperty );

      // Create an arrow node that represents the shadow of the vector
      const vectorShadowNode = new ArrowNode( 0, 0, tipDeltaLocation.x, tipDeltaLocation.y, VECTOR_SHADOW_OPTIONS );

      // Create a circle at the tip of the vector. This is used to allow the user to only change the angle of the
      // arrowNode by only dragging the tip
      const tipCircle = new Circle( TIP_CIRCLE_RADIUS, _.extend( { center: tipDeltaLocation }, TIP_CIRCLE_OPTIONS ) );


      // Reconfigure scene graph z-layering
      this.setChildren( [ vectorShadowNode, this.arrowNode, angleNode, this.labelNode, tipCircle ] );

      //----------------------------------------------------------------------------------------
      
      // @private {Property.<ModelViewTransform2>}
      this.modelViewTransformProperty = modelViewTransformProperty;

      // @private {VectorModel}
      this.vectorModel = vectorModel;

      //----------------------------------------------------------------------------------------
      // Create Body Drag
      //----------------------------------------------------------------------------------------

      // Create a property for the location of the tail of the vector.
      const tailLocationProperty = new Vector2Property( modelViewTransformProperty.value.modelToViewPosition(
                                                                                          vectorModel.tail ) );

      // @public (read-only) {BooleanProperty} property to indicate when the vector should be animated back to the creator panel
      this.animateBackProperty = new BooleanProperty( false );
      
      // @public (read-only) {DragListener} - drag listener for translating the vector
      this.bodyDragListener = new DragListener( {
        targetNode: this,
        locationProperty: tailLocationProperty,
        start: () => {

          // Activate the vector as it is now the active vector
          graph.activeVectorProperty.value = vectorModel;
          this.moveToFront();
        },
        end: () => {

          // If we are currently animating back or should be animating back, do not allow drag by doing nothing
          if ( this.vectorModel.inProgressAnimationProperty.value || this.animateBackProperty.value ) {
            // do nothing
            return;
          }

          //----------------------------------------------------------------------------------------
          // If we aren't on the graph, at the end of the drag determine to either drop the vector or animate back 
          if ( !this.vectorModel.isOnGraphProperty.value ) {

            // Tail position, since the vector center is always on the cursor
            const cursorPosition = modelViewTransformProperty.value.viewToModelDelta(
                                      this.bodyDragListener.localPoint ).plus( this.vectorModel.tail );
            
            // If the graph doesn't contain the center, it is time to animate back, otherwise drop it on the graph
            if ( !graph.graphModelBounds.containsPoint( cursorPosition ) ) {
              this.animateBackProperty.value = true;
              this.arrowNode.cursor = 'default';
            }
            else {
              this.vectorModel.dropOntoGraph();
            }
          }
        }
      } );

      //----------------------------------------------------------------------------------------

      // Observe the view location property to call a tail listener that updates the tail in the model
      const tailListener = tailLocation => {
        this.updateTailPosition( tailLocation );
      };
      tailLocationProperty.link( tailListener );

      // The body can be translated by the arrow or the label
      this.arrowNode.addInputListener( this.bodyDragListener );
      this.labelNode.addInputListener( this.bodyDragListener );

      //----------------------------------------------------------------------------------------
      // Create Tip Drag
      //----------------------------------------------------------------------------------------

      if ( vectorModel.isTipDraggable ) {

        // Create a property of the location of the tip of the vector. The location of the tip is measured with respect
        // to the tail.
        const tipLocationProperty = new Vector2Property( tipDeltaLocation );

        const tipDragListener = new DragListener( {
          targetNode: tipCircle,
          locationProperty: tipLocationProperty,
          start: () => {
            // Don't do anything when the vector isn't on the graph, as you can't drag the tip when it's off the graph
            if ( vectorModel.isOnGraphProperty.value === false ) {
              return;
            }
            // Activate the vector as it is now the active vector
            graph.activeVectorProperty.value = vectorModel;
            this.moveToFront();
          }
        } );

        //----------------------------------------------------------------------------------------
        // Tip location listener that updates the tail in the model
        const tipListener = tipLocation => {
          this.updateTipPosition( tipLocation );
        };
        // Observe the view location property to call a tip listener that updates the tail in the model
        tipLocationProperty.link( tipListener );
        tipCircle.addInputListener( tipDragListener );

        // @private {function}
        this.disposeTipDrag = () => {
          tipCircle.removeInputListener( tipDragListener );
          tipLocationProperty.unlink( tipListener );
        };
      }

      //----------------------------------------------------------------------------------------
      // Update the tip circle so the user can indefinitely drag the tip
      const updateTipCircleLocation = () => {
        const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vectorModel.attributesVector );
        tipCircle.center = tipDeltaLocation;
      };
      vectorModel.attributesVectorProperty.link( updateTipCircleLocation );

      //----------------------------------------------------------------------------------------

      // Function to update the appearance of the vector node depending on if it's on or off the graph or when the
      // vector model changes
      const onGraphListener = ( isOnGraph, attributesVectorProperty ) => {
        this.labelNode.visible = isOnGraph;
        
        vectorShadowNode.visible = !isOnGraph;

        vectorShadowNode.resetTransform();
        if ( !isOnGraph ) {
          vectorShadowNode.left = VECTOR_SHADOW_OFFSET;
        }

        // Get the tip location in view coordinates
        const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( vectorModel.attributesVector );
        vectorShadowNode.setTip( tipDeltaLocation.x, tipDeltaLocation.y );
      };
      const vectorOnGraphObserver = Property.multilink(
        [ vectorModel.isOnGraphProperty, vectorModel.attributesVectorProperty ], onGraphListener)

      //----------------------------------------------------------------------------------------
      // Create a method to dispose children
      this.disposeVectorNode = () => {
        if ( vectorModel.isTipDraggable ) {
          this.disposeTipDrag();
        }
        this.arrowNode.removeInputListener( this.bodyDragListener );
        this.labelNode.removeInputListener( this.bodyDragListener );

        angleNode.dispose();

        tailLocationProperty.unlink( tailListener );
        vectorModel.attributesVectorProperty.unlink( updateTipCircleLocation );

        tipCircle.dispose();

        vectorOnGraphObserver.dispose();
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

      // Do nothing as you cannot drag the tip when the vector isn't on the graph
      if ( this.vectorModel.isOnGraphProperty.value === false ) {
        return;
      }

      const vectorTipPosition = this.vectorModel.tail.plus(
                                  this.modelViewTransformProperty.value.viewToModelDelta( tipLocation ) );

      this.vectorModel.dragTipToPosition( vectorTipPosition );
    }

    /**
     * Updates the model vector's tail position. Called when the vector is being translated
     * @param {Vector2} tailLocation
     * @private
     */
    updateTailPosition( tailLocation ) {
      
      const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );

      // Allow translation to anywhere if it isn't on the graph
      if ( this.vectorModel.isOnGraphProperty.value === false ) {
        this.vectorModel.translateToPoint( tailPosition );
      }
      else {
        // Update the model tail position, subject to symmetric rounding, and fit inside the graph bounds
        this.vectorModel.moveVectorToFitInGraph( tailPosition );

      }
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );