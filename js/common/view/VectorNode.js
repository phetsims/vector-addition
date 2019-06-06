// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating vectors that appear in this sim.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAngleNode = require( 'VECTOR_ADDITION/common/view/VectorAngleNode' );
  const VectorComponentsNode = require( 'VECTOR_ADDITION/common/view/VectorComponentsNode' );

  // constants
  const ARROW_OPTIONS = {
    fill: 'rgb( 0, 191, 255 )',
    lineWidth: 0,
    tailWidth: 5,
    headWidth: 9,
    headHeight: 6,
    cursor: 'move'
  };

  // tip circle
  const TIP_CIRCLE_RADIUS = 10;
  const TIP_CIRCLE_OPTIONS = {
    fill: 'red',
    opacity: 0,
    dilated: 10,
    cursor: 'pointer'
  };

  class VectorNode extends Node {

    /**
     * @constructor
     * @param {Vector} vector - the vector model
     * @param {Bounds2} gridModelBounds - the bounds to the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component styles
     * @param {BooleanProperty} angleVisibleProperty - property for when the angle is visible
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     */
    constructor( vector, gridModelBounds, componentStyleProperty, angleVisibleProperty, modelViewTransformProperty ) {

      const initialModelViewTransform = modelViewTransformProperty.value;

      // Define a vector node in which the tail location is (0, 0)
      // Get the tip position in view coordinates
      const tipPosition = initialModelViewTransform.modelToViewDelta( vector.attributesVectorProperty.value );

      // Create an arrow node that represents an actual vector.
      const arrowNode = new ArrowNode( 0, 0, tipPosition.x, tipPosition.y, ARROW_OPTIONS );

      // Create a label for the vector that is displayed 'next' to the arrow. The location of this depends 
      // on the angle of the vector.
      const labelNode = new FormulaNode( '\\vec{' + vector.label + '}' );

      // Create a circle at the tip of the vector. This is used to allow the user to only change the 
      // angle of the arrowNode by only dragging the tip
      const tipCircle = new Circle( TIP_CIRCLE_RADIUS, _.extend( { center: tipPosition }, TIP_CIRCLE_OPTIONS ) );

      // Create the scenery nodes for this vectors components
      const vectorComponentsNode = new VectorComponentsNode( vector, componentStyleProperty, initialModelViewTransform );

      // Create the scenery node that represents the angle
      const vectorAngleNode = new VectorAngleNode( vector, angleVisibleProperty, initialModelViewTransform );

      super({
        children: [
          vectorComponentsNode,
          arrowNode,
          tipCircle,
          vectorAngleNode,
          labelNode
        ]
      });

      // Transform the model grid bounds into the view coordinates.
      // This will stay constant as the actual graph location in terms of the view will not change.
      const gridViewBounds = initialModelViewTransform.modelToViewBounds( gridModelBounds );

      // Create a property of the grid model bounds that constrain the vector drag.
      // This is changed when the vector's magnitude is changed and is set so that you can
      // drag half of the vector out of the graph.
      const vectorDragBoundsProperty = new Property( gridModelBounds );

      // Create a property of the vectors position. This is needed update the dragBoundsProperty
      // when the vector's tail position is being updated (on the drag) and to ensure the vector stays on the graph
      const tailArrowPositionProperty = new Vector2Property( vector.tailPositionProperty.value );

      // Create a property of the grid model bounds that constrain the vector's TIP drag.
      // This is changed when the vector's tail position is changed.
      const tipDragBoundsProperty = new Property( gridModelBounds );

      // Create a property of the tip's Position. 
      const tipArrowPositionProperty = new Vector2Property( tipPosition );


      // @private {DragListener} - for forwarding drag events
      this.bodyDragListener = new DragListener( {
        targetNode: this,
        dragBoundsProperty: vectorDragBoundsProperty,
        translateNode: false,
        transform: initialModelViewTransform,
        locationProperty: tailArrowPositionProperty,
        start: () => vector.isBodyDraggingProperty.set( true ),
        end: () => vector.isBodyDraggingProperty.set( false )
      } );

      // for forwarding drag events for the tip
      const tipDragListener = new DragListener( {
        targetNode: tipCircle,
        translateNode: false,
        dragBoundsProperty: tipDragBoundsProperty,
        locationProperty: tipArrowPositionProperty,
        start: () => vector.isTipDraggingProperty.set( true ),
        end: () => vector.isTipDraggingProperty.set( false )
      } );

      tailArrowPositionProperty.link( tailArrowPosition => {
        if ( gridModelBounds.containsPoint( tailArrowPosition ) ) {
          vector.tailPositionProperty.value = tailArrowPosition.roundedSymmetric();
        }
        else {
          vector.tailPositionProperty.value = tailArrowPosition;
        }
        this.translation = initialModelViewTransform.modelToViewPosition( vector.tailPositionProperty.value );

        this.clipArea = new Shape.bounds( gridViewBounds.shifted( -this.x, -this.y, ) );

        tipDragBoundsProperty.value = initialModelViewTransform.modelToViewBounds(
          gridModelBounds.shifted( -tailArrowPosition.x + gridModelBounds.minX,
            -tailArrowPosition.y + gridModelBounds.maxY ) ).shifted( -gridViewBounds.minX, -gridViewBounds.minY );
      } );

      tipArrowPositionProperty.link( tipArrowPosition => {

        vector.attributesVectorProperty.value = initialModelViewTransform.viewToModelDelta( tipArrowPosition ).roundedSymmetric();
        const snapToGridPosition = initialModelViewTransform.modelToViewDelta( vector.attributesVectorProperty.value );
        arrowNode.setTip( snapToGridPosition.x, snapToGridPosition.y );
        tipCircle.center = snapToGridPosition;
        if ( !snapToGridPosition.equals( Vector2.ZERO ) ) {
          labelNode.center = snapToGridPosition.dividedScalar( 2 ).plus( snapToGridPosition.perpendicular.normalized().times( vector.angleDegreesProperty.value > 0 ? 20 : -20 ) );
        }

        vectorDragBoundsProperty.set( gridModelBounds.shifted( -vector.attributesVectorProperty.value.x / 2, -vector.attributesVectorProperty.value.y / 2 ) );
      } );


      arrowNode.addInputListener( this.bodyDragListener );
      tipCircle.addInputListener( tipDragListener );


    }
  

  }










  return vectorAddition.register( 'VectorNode', VectorNode );
} );