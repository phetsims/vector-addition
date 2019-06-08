// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating scenery node of vectors that appear in this sim.
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
      // Get the tip location  in view coordinates
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
      const vectorComponentsNode = new VectorComponentsNode( vector, componentStyleProperty, modelViewTransformProperty );

      // Create the scenery node that represents the angle
      const vectorAngleNode = new VectorAngleNode( vector, angleVisibleProperty, initialModelViewTransform );

      super( {
        children: [
          vectorComponentsNode,
          arrowNode,
          tipCircle,
          vectorAngleNode,
          labelNode
        ]
      } );

      // @private {ModelViewTransformProperty}
      this.modelViewTransformProperty = modelViewTransformProperty;

      //@private {Vector}
      this.vector = vector;

      // Create a property for the location of the tail of the vector.
      const tailLocationProperty = new Vector2Property(
        modelViewTransformProperty.value.modelToViewPosition( vector.tailPositionProperty.value ) );

      // @private {DragListener} - for forwarding drag events
      const bodyDragListener = new DragListener( {
        targetNode: this,
        translateNode: false,
        locationProperty: tailLocationProperty,
        start: () => vector.isBodyDraggingProperty.set( true ),
        end: () => vector.isBodyDraggingProperty.set( false )
      } );


      tailLocationProperty.link( tailLocation => {
        this.translation = this.getTailSnapToGridLocation( tailLocation );
      } );

      arrowNode.addInputListener( bodyDragListener );


      if ( vector.isTipDraggable ) {

        // Create a property of the location of the tip of the vector. The location of the tip is measured with respect to the tail.
        const tipLocationProperty = new Vector2Property( tipPosition );

        // for forwarding drag events for the tip
        const tipDragListener = new DragListener( {
          targetNode: tipCircle,
          translateNode: false,
          locationProperty: tipLocationProperty,
          start: () => vector.isTipDraggingProperty.set( true ),
          end: () => vector.isTipDraggingProperty.set( false )
        } );

        tipLocationProperty.link( tipLocation => {
          this.tipSnapToGrid( tipLocation );
        } );


        tipCircle.addInputListener( tipDragListener );
      }

      // update the position of the arrowNode and the tipCircle
      vector.attributesVectorProperty.link( attributesVector => {
        const tipLocation = this.modelViewTransformProperty.value.modelToViewDelta( attributesVector );
        arrowNode.setTip( tipLocation.x, tipLocation.y );
        tipCircle.center = tipLocation;
      } );

    }

    /**
     * update the model vector to have integer components
     * (relative to the tail)
     * @param {Vector2} tipLocation
     */
    tipSnapToGrid( tipLocation ) {
      const tipCoordinates = this.modelViewTransformProperty.value.viewToModelDelta( tipLocation );
      this.vector.attributesVectorProperty.value = tipCoordinates.roundedSymmetric();
    }

    /**
     * update the model vector to have integer components and return the location associated with the tail
     * @param {Vector2} tailLocation
     * @returns {Vector2}
     */
    getTailSnapToGridLocation( tailLocation ) {
      const mvt = this.modelViewTransformProperty.value;
      const tailCoordinates = mvt.viewToModelPosition( tailLocation );
      this.vector.tailPositionProperty.value = tailCoordinates.roundedSymmetric();
      const roundedTailLocation = mvt.modelToViewPosition( this.vector.tailPositionProperty.value );
      return roundedTailLocation;
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );