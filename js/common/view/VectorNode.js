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
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );
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
    fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.fill
  } );
  const VECTOR_GROUP_2 = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.fill
  } );

  class VectorNode extends BaseVectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component styles
     * @param {BooleanProperty} angleVisibleProperty - property for when the angle is visible
     * @param {BooleanProperty} valuesVisibleProperty
     * @param  {Object} [arrowOptions]
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

      // Type check arguments
      assert && assert( vectorModel instanceof VectorModel, `invalid vectorModel: ${vectorModel}` );
      assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds ${graphModelBounds}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty,
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      // modelViewTransformProperty checked in super class
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
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

      // create the xComponentNode for the projection of the vectors along the horizontal
      const xComponentNode = new VectorComponentNode( vectorModel.xVectorComponent, modelViewTransformProperty, componentStyleProperty, valuesVisibleProperty );

      // create the yComponent for the projection of the vector along the vertical
      const yComponentNode = new VectorComponentNode( vectorModel.yVectorComponent, modelViewTransformProperty, componentStyleProperty, valuesVisibleProperty );

      // create a scenery node representing the arc of an angle and the numerical display of the angle
      const angleNode = new VectorAngleNode( vectorModel, angleVisibleProperty, modelViewTransformProperty );

      // {Node} Create a circle at the tip of the vector. This is used to allow the user to only
      // change the angle of the arrowNode by only dragging the tip
      const tipCircle = new Circle( TIP_CIRCLE_RADIUS, _.extend( { center: tipDeltaLocation }, TIP_CIRCLE_OPTIONS ) );

      this.addChild( xComponentNode );
      this.addChild( yComponentNode );
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

      // drag listener for the dragging of the body
      const bodyDragListener = new DragListener( {
        targetNode: this,
        locationProperty: tailLocationProperty,
        start: () => {
          vectorModel.isActiveProperty.value = true;
          this.moveToFront();
        },
        end: () => {
          vectorModel.isActiveProperty.value = false;
        }
      } );

      const tailListener = tailLocation => {
        this.tailSnapToGrid( tailLocation );
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
            vectorModel.isActiveProperty.value = true;
            this.moveToFront();
          },
          end: () => {
            vectorModel.isActiveProperty.value = false;
          }
        } );

        const tipListener = tipLocation => {
          this.tipSnapToGrid( tipLocation );
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

        xComponentNode.dispose();
        yComponentNode.dispose();
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
    tipSnapToGrid( tipLocation ) {

      const tipCopy = this.vectorModel.tip;

      // Update the model vector
      this.vectorModel.tip = this.vectorModel.tail.plus(
        this.modelViewTransformProperty.value.viewToModelDelta( tipLocation ) );

      // Round the tip position according to the coordinateSnapMode
      if ( this.coordinateSnapMode === CoordinateSnapModes.POLAR ) {
        this.vectorModel.roundPolarForm();
      }
      else if ( this.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
        this.vectorModel.roundCartesianForm();
      }

      //----------------------------------------------------------------------------------------
      if ( !this.vectorModel.magnitude ) { // prevent setting the vector to length 0
        this.vectorModel.tip = tipCopy;
      }
    }

    //TODO: the name of this function is misleading since it does much more than snap to grid
    /**
     * @private
     * update the model vector to have integer components and return the location associated with the tail
     * @param {Vector2} tailLocation
     */
    tailSnapToGrid( tailLocation ) {

      const tailPosition = this.modelViewTransformProperty.value.viewToModelPosition( tailLocation );

      this.vectorModel.translateToPoint( tailPosition );

      this.vectorModel.moveVectorToFitInGraph();
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );