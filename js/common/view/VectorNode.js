// Copyright 2019, University of Colorado Boulder

/**
 * View for a vector.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BaseVectorNode = require( 'VECTOR_ADDITION/common/view/BaseVectorNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAngleNode = require( 'VECTOR_ADDITION/common/view/VectorAngleNode' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants
  const TIP_CIRCLE_RADIUS = 10;
  const TIP_CIRCLE_OPTIONS = {
    fill: 'red',
    opacity: 0,
    dilated: 10,
    cursor: 'pointer'
  };
  const VECTOR_GROUP_1 = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors[ VectorGroups.ONE ].fill
  } );
  const VECTOR_GROUP_2 = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors[ VectorGroups.TWO ].fill
  } );

  class VectorNode extends BaseVectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component styles
     * @param {BooleanProperty} angleVisibleProperty - property for when the angle is visible
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {CoordinateSnapModes} coordinateSnapMode
     * @param {Object} [arrowOptions]
     */
    constructor( vectorModel,
                 graph,
                componentStyleProperty,
                angleVisibleProperty,
                valuesVisibleProperty,
                 coordinateSnapMode,
                 arrowOptions ) {

      const modelViewTransformProperty = graph.modelViewTransformProperty;
      const graphModelBounds = graph.graphModelBounds;
      // // Type check arguments
      // assert && assert( vectorModel instanceof VectorModel, `invalid vectorModel: ${vectorModel}` );
      // assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds ${graphModelBounds}` );
      // assert && assert( componentStyleProperty instanceof EnumerationProperty,
      //   `invalid componentStyleProperty: ${componentStyleProperty}` );
      // assert && assert( angleVisibleProperty instanceof BooleanProperty,
      //   `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      // // modelViewTransformProperty checked in super class
      // assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      //----------------------------------------------------------------------------------------
      // Get the arrow options for the specific vector type

      switch( vectorModel.vectorGroup ) {
        case VectorGroups.ONE: {
          arrowOptions = _.extend( {}, VECTOR_GROUP_1, arrowOptions );
          break;
        }
        case VectorGroups.TWO: {
          arrowOptions = _.extend( {}, VECTOR_GROUP_2, arrowOptions );
          break;
        }
        default: {
          throw new Error( `Vector Group : ${vectorModel.vectorGroup} not handled` );
        }
      }
      super( vectorModel, modelViewTransformProperty, valuesVisibleProperty, arrowOptions );

      //----------------------------------------------------------------------------------------

      const tipDeltaLocation = modelViewTransformProperty.value.modelToViewDelta( vectorModel.attributesVector );

      // create a scenery node representing the arc of an angle and the numerical display of the angle
      const angleNode = new VectorAngleNode( vectorModel, angleVisibleProperty, modelViewTransformProperty );

      // {Node} Create a circle at the tip of the vector. This is used to allow the user to only
      // change the angle of the arrowNode by only dragging the tip
      const tipCircle = new Circle( TIP_CIRCLE_RADIUS, _.extend( { center: tipDeltaLocation }, TIP_CIRCLE_OPTIONS ) );

      this.addChild( tipCircle );
      this.arrowNode.moveToFront(); // put the arrow node on top of components

      this.addChild( angleNode );

      tipCircle.moveToFront();

      //----------------------------------------------------------------------------------------
      // @private {Property.<ModelViewTransform2>}
      this.modelViewTransformProperty = modelViewTransformProperty;

      // @private {VectorModel}
      this.vectorModel = vectorModel;

      // @private
      this.coordinateSnapMode = coordinateSnapMode;

      //----------------------------------------------------------------------------------------
      // Create Body Drag

      // Create a property for the location of the tail of the vector.
      const tailLocationProperty = new Vector2Property(
        modelViewTransformProperty.value.modelToViewPosition( vectorModel.tail ) );

      this.animateBackProperty = new BooleanProperty( false );
      // drag listener for the dragging of the body
      const bodyDragListener = new DragListener( {
        targetNode: this,
        locationProperty: tailLocationProperty,
        start: () => {
          // vectorModel.isActiveProperty.value = true;
          this.moveToFront();
        },
        end: () => {
          if ( this.vectorModel.isOnGraphProperty.value === false ) {
            const tailPosition = modelViewTransformProperty.value.viewToModelPosition( tailLocationProperty.value );


            const dropVector = graph.graphModelBounds.containsPoint( tailPosition.plus( this.vectorModel.attributesVector.timesScalar( 0.5 ) )  );

            if ( !dropVector ) {
              this.animateBackProperty.value = true;
              this.arrowNode.cursor = 'default';

            }
            else {
              this.vectorModel.dropOntoGraph();
              this.updateTailPosition( tailLocationProperty.value )
            }
          }
          // vectorModel.isActiveProperty.value = false;
        }
      } );

      this.vectorModel.isOnGraphProperty.link( ( isOnGraph ) => {
        this.labelNode.visible = isOnGraph;
      })

      // @public
      this.bodyDragListener = bodyDragListener;

      // tail listener that updates the tail in the model
      const tailListener = tailLocation => {

        this.updateTailPosition( tailLocation );
      };

      tailLocationProperty.link( tailListener );

      this.arrowNode.addInputListener( bodyDragListener );
      this.labelNode.addInputListener( bodyDragListener );

      //----------------------------------------------------------------------------------------
      // Create Tip Drag
      if ( vectorModel.isTipDraggable ) {

        // Create a property of the location of the tip of the vector. The location of the tip is measured with respect to the tail.
        const tipLocationProperty = new Vector2Property( tipDeltaLocation );

        // for forwarding drag events for the tip
        const tipDragListener = new DragListener( {
          targetNode: tipCircle,
          locationProperty: tipLocationProperty,
          start: () => {
            // vectorModel.isActiveProperty.value = true;
            this.moveToFront();
          },
          end: () => {
            // vectorModel.isActiveProperty.value = false;
          }
        } );

        const tipListener = tipLocation => {
          this.updateTipPosition( tipLocation );
        };

        tipLocationProperty.link( tipListener );

        tipCircle.addInputListener( tipDragListener );

        this.disposeTipDrag = () => {
          tipCircle.removeInputListener( tipDragListener );
          tipLocationProperty.unlink( tipListener );
        };
      }

      const updateTip = () => {
        const tipDeltaLocation = this.modelViewTransformProperty.value.modelToViewDelta( vectorModel.attributesVector );
        tipCircle.center = tipDeltaLocation;
      };

      // update the position of the  tipCircle
      vectorModel.attributesVectorProperty.link( updateTip );

      // Create a method to dispose children
      this.disposeChildren = () => {
        if ( vectorModel.isTipDraggable ) {
          this.disposeTipDrag();
        }

        angleNode.dispose();
        tailLocationProperty.unlink( tailListener );
        vectorModel.attributesVectorProperty.unlink( updateTip );
        this.arrowNode.removeInputListener( bodyDragListener );
        this.labelNode.removeInputListener( bodyDragListener );
        tipCircle.dispose();
      };
    }

    /**
     * Dispose the vector
     */
    dispose() {
      this.disposeChildren();
      super.dispose();
    }

    /**
     * update the model vector to have integer components and correct vector orientation
     * (relative to the tail)
     * @param {Vector2} tipLocation
     */
    updateTipPosition( tipLocation ) {

      if ( this.vectorModel.isOnGraphProperty.value === false ) {
        return;
      }

      const vectorTip = this.vectorModel.tip;

      const vectorTipPosition = this.vectorModel.tail.plus(
        this.modelViewTransformProperty.value.viewToModelDelta( tipLocation ) );

      // Round the tip position according to the coordinateSnapMode
      if ( this.coordinateSnapMode === CoordinateSnapModes.POLAR ) {
        this.vectorModel.dragTipInPolar( vectorTipPosition );
      }
      else if ( this.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
        this.vectorModel.dragTipInCartesian( vectorTipPosition );
      }

      if ( !this.vectorModel.magnitude ) {
        this.vectorModel.tip = vectorTip;
      }
    }

    /**
     * @private
     * update the model vector tail position
     * @param {Vector2} tailLocation
     */
    updateTailPosition( tailLocation ) {
      
      // find the nominal tailPosition after a modelView transformation
      const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );

      if ( this.vectorModel.isOnGraphProperty.value === false ) {
        this.vectorModel.translateToPoint( tailPosition );
        return;
      }
      // update the model tail position, subject to symmetric rounding, and fit inside the graph bounds
      this.vectorModel.moveVectorToFitInGraph( tailPosition );
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );