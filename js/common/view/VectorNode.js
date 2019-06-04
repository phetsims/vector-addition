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

  class VectorNode extends Node {

    /**
     * @param {Vector} vector
     * @param {Bounds2} modelBounds
     * @param {ModelViewTransform2} modelViewTransform
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} angleVisibleProperty
     */
    constructor( vector, modelBounds, modelViewTransform, componentStyleProperty, angleVisibleProperty ) {

      const viewBounds = modelViewTransform.modelToViewBounds( modelBounds );

      super();

      // position {0,0} is the position of the tail of the vector

      // position of the tip of the arrow in View coordinates
      const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );

      const arrowNode = new ArrowNode( 0, 0, tipPosition.x, tipPosition.y, ARROW_OPTIONS );
      const labelNode = new FormulaNode( '\\vec{' + vector.label + '}' );

      const tipArrowNode = new Circle( 10, {
        center: tipPosition,
        fill: 'red',
        opacity: 0,
        dilated: 10,
        cursor: 'pointer'
      } );

      // @private {VectorComponentsNode} vectorComponentsNode - the scenery nodes for this vectors components
      this.vectorComponentsNode = new VectorComponentsNode( vector, componentStyleProperty, modelViewTransform );

      // @private {VectorAngleNode} vectorAngleNode - scenery node for the angle
      this.vectorAngleNode = new VectorAngleNode( vector, angleVisibleProperty, modelViewTransform );


      this.addChild( this.vectorComponentsNode );
      this.addChild( arrowNode );
      this.addChild( tipArrowNode );
      this.addChild( this.vectorAngleNode );
      this.addChild( labelNode );

      const tailArrowPositionProperty = new Vector2Property( vector.tailPositionProperty.value );

      // @public (read-only) - Target for the arrow drag listener
      this.dragTarget = arrowNode;

      const vectorDragBoundsProperty = new Property( modelBounds );
      const tipDragBoundsProperty = new Property( modelBounds );

      // locationProperty of the tip of the arrow (with respect to the base of the arrow (0,0))
      const tipArrowPositionProperty = new Vector2Property( tipPosition );

      // @public - for forwarding drag events
      this.bodyDragListener = new DragListener( {
        targetNode: this,
        dragBoundsProperty: vectorDragBoundsProperty,
        translateNode: false,
        transform: modelViewTransform,
        locationProperty: tailArrowPositionProperty,
        start: () => vector.isBodyDraggingProperty.set( true ),
        end: () => vector.isBodyDraggingProperty.set( false )
      } );

      // for forwarding drag events for the tip
      const tipDragListener = new DragListener( {
        targetNode: tipArrowNode,
        translateNode: false,
        dragBoundsProperty: tipDragBoundsProperty,
        locationProperty: tipArrowPositionProperty,
        start: () => vector.isTipDraggingProperty.set( true ),
        end: () => vector.isTipDraggingProperty.set( false )
      } );

      tailArrowPositionProperty.link( tailArrowPosition => {
        if ( modelBounds.containsPoint( tailArrowPosition ) ) {
          vector.tailPositionProperty.value = tailArrowPosition.roundedSymmetric();
        }
        else {
          vector.tailPositionProperty.value = tailArrowPosition;
        }
        this.translation = modelViewTransform.modelToViewPosition( vector.tailPositionProperty.value );

        this.clipArea = new Shape.bounds( viewBounds.shifted( -this.x, -this.y, ) );

        tipDragBoundsProperty.value = modelViewTransform.modelToViewBounds(
          modelBounds.shifted( -tailArrowPosition.x + modelBounds.minX,
            -tailArrowPosition.y + modelBounds.maxY ) ).shifted( -viewBounds.minX, -viewBounds.minY );
      } );

      this.dragTarget.addInputListener( this.bodyDragListener );

      tipArrowNode.addInputListener( tipDragListener );
      tipArrowPositionProperty.link( tipArrowPosition => {
        vector.vectorProperty.value = modelViewTransform.viewToModelDelta( tipArrowPosition ).roundedSymmetric();
        const snapToGridPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );
        arrowNode.setTip( snapToGridPosition.x, snapToGridPosition.y );
        tipArrowNode.center = snapToGridPosition;
        if ( !snapToGridPosition.equals( Vector2.ZERO ) ) {
          labelNode.center = snapToGridPosition.dividedScalar( 2 ).plus( snapToGridPosition.perpendicular.normalized().times( vector.angleProperty.get() > 0 ? 20 : -20 ) );
        }

        vectorDragBoundsProperty.set( modelBounds.shifted( -vector.vectorProperty.value.x / 2, -vector.vectorProperty.value.y / 2 ) );
      } );
    }

    /**
     *
     * @param {Vector2Property} positionProperty
     */
    snapToGridLines( positionProperty ) {

      positionProperty.set( positionProperty.get().roundedSymmetric() );
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );