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
  const BaseVectorNode = require( 'VECTOR_ADDITION/common/view/BaseVectorNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/VectorAdditionModel' );
  const VectorAngleNode = require( 'VECTOR_ADDITION/common/view/VectorAngleNode' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants
  const TIP_CIRCLE_RADIUS = 10;
  const TIP_CIRCLE_OPTIONS = {
    opacity: 0,
    dilated: 10,
    cursor: 'pointer'
  };

  class VectorNode extends BaseVectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {VectorAdditionModel} vectorAdditionModel
     * @param {Graph} graph
     * @param {CoordinateSnapModes} coordinateSnapMode
     * @param {Object} [arrowOptions]
     */
    constructor( vectorModel, vectorAdditionModel, graph, coordinateSnapMode, arrowOptions ) {

      assert && assert( vectorModel instanceof VectorModel, `invalid vectorModel: ${vectorModel}` );
      assert && assert( vectorAdditionModel instanceof VectorAdditionModel,
        `invalid vectorAdditionModel: ${vectorAdditionModel}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );

      //----------------------------------------------------------------------------------------

      arrowOptions = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
        fill: VectorAdditionColors[ vectorModel.vectorGroup ].fill
      } );

      super( vectorModel, graph.modelViewTransformProperty, vectorAdditionModel.valuesVisibleProperty, arrowOptions );

      //----------------------------------------------------------------------------------------

      // Convenience reference
      const modelViewTransformProperty = graph.modelViewTransformProperty;

      // Create a scenery node representing the arc of an angle and the numerical display of the angle
      const angleNode = new VectorAngleNode( vectorModel, vectorAdditionModel.angleVisibleProperty, graph );

      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( vectorModel.attributesVector );

      // {Node} Create a circle at the tip of the vector. This is used to allow the user to only
      // change the angle of the arrowNode by only dragging the tip
      const tipCircle = new Circle( TIP_CIRCLE_RADIUS, _.extend( { center: tipDeltaLocation }, TIP_CIRCLE_OPTIONS ) );


      this.addChild( tipCircle );

      this.arrowNode.moveToFront();

      this.addChild( angleNode );

      tipCircle.moveToFront();

      //----------------------------------------------------------------------------------------
      // @private {Property.<ModelViewTransform2>}
      this.modelViewTransformProperty = modelViewTransformProperty;

      // @private {VectorModel}
      this.vectorModel = vectorModel;

      // @private {CoordinateSnapModes}
      this.coordinateSnapMode = coordinateSnapMode;


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
          graph.activiveVectorProperty.value = vectorModel;
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
            const tailPosition = modelViewTransformProperty.value.viewToModelPosition( tailLocationProperty.value );
            const centerPosition = tailPosition.plus( this.vectorModel.attributesVector.timesScalar( 0.5 ) );
            
            // If the graph doesn't contain the center, it is time to animate back, otherwise drop it on the graph
            if ( !graph.graphModelBounds.containsPoint( centerPosition ) ) {
              this.animateBackProperty.value = true;
              this.arrowNode.cursor = 'default';
            }
            else {
              this.vectorModel.dropOntoGraph();
              this.updateTailPosition( tailLocationProperty.value );
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
            graph.activiveVectorProperty.value = vectorModel;
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

      // Function to update the appearance of the vector node depending on if it's on or off the graph
      const onGraphListener = ( isOnGraph ) => {
        this.labelNode.visible = isOnGraph;
        // TODO: add a vector shadow
      };
      this.vectorModel.isOnGraphProperty.link( onGraphListener );

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

        this.vectorModel.isOnGraphProperty.unlink( onGraphListener );
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

      // Round the tip position according to the coordinateSnapMode
      if ( this.coordinateSnapMode === CoordinateSnapModes.POLAR ) {
        this.vectorModel.dragTipInPolar( vectorTipPosition );
      }
      else if ( this.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
        this.vectorModel.dragTipInCartesian( vectorTipPosition );
      }
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