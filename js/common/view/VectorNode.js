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
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );

  // constants

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
     * @param {VectorOrientation} vectorOrientation - Orientation mode of the vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property for the coordinate transform
     * between model coordinates and view coordinates
     * @param {object} arrowOptions - options passed to the arrow node
     */
    constructor( vector, gridModelBounds, componentStyleProperty, angleVisibleProperty, vectorOrientation, modelViewTransformProperty, arrowOptions ) {

      const initialModelViewTransform = modelViewTransformProperty.value;

      // Define a vector node in which the tail location is (0, 0)
      // Get the tip location  in view coordinates
      const tipPosition = initialModelViewTransform.modelToViewDelta( vector.attributesVectorProperty.value );

      // Create an arrow node that represents an actual vector.
      const arrowNode = new ArrowNode( 0, 0, tipPosition.x, tipPosition.y, arrowOptions );

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

      // @private {Property.<ModelViewTransform>}
      this.modelViewTransformProperty = modelViewTransformProperty;

      // @private {VectorOrientation}
      this.vectorOrientation = vectorOrientation;

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
        start: () => {
          vector.isBodyDraggingProperty.set( true );
          this.moveToFront();
        },
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
          start: () => {
            vector.isTipDraggingProperty.set( true );
            this.moveToFront();
          },
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
     * update the model vector to have integer components and correct vector orientation
     * (relative to the tail)
     * @param {Vector2} tipLocation
     */
    tipSnapToGrid( tipLocation ) {
      const tipCoordinates = this.modelViewTransformProperty.value.viewToModelDelta( tipLocation );

      switch( this.vectorOrientation ) {
        case VectorOrientation.HORIZONTAL: {
          tipCoordinates.setY( 0 );
          break;
        }
        case VectorOrientation.VERTICAL: {
          tipCoordinates.setX( 0 );
          break;
        }
        case VectorOrientation.ALL: {
          break;
        }
        default: {
          throw new Error( `vectorOrientation not handled: ${this.vectorOrientation}` );
        }
      }
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