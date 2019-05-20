// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating icons that appear in this sim.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // constants
  const ARROW_OPTIONS = { stroke: 'blue', lineWidth: 3, headWidth: 10, headHeight: 5 };

  class VectorNode extends Node {

    /**
     * @param {Vector} vector
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Tandem} tandem
     */
    constructor( vector, modelViewTransform, tandem ) {

      super();

      // position {0,0} is the position of the tail of the vector

      // position of the tip of the arrow in View coordinates
      const tipPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );


      const arrowNode = new ArrowNode( 0, 0, tipPosition.x, tipPosition.y, ARROW_OPTIONS );
      const tipArrowNode = new Circle( 10, { center: tipPosition, fill: 'yellow' } );

      this.addChild( tipArrowNode );
      this.addChild( arrowNode );

      // @public (read-only) - Target for the arrow drag listener
      this.dragTarget = arrowNode;

      // @public - for forwarding drag events
      this.dragListener = new DragListener( {
        targetNode: this,
        translateNode: true,
        transform: modelViewTransform,
        locationProperty: vector.tailPositionProperty
      } );

      this.dragTarget.addInputListener( this.dragListener );

      // locationProperty of the tip of the arrow (with respect to the base of the arrow (0,0))
      const tipArrowPositionProperty = new Vector2Property( tipPosition );

      // @public - for forwarding drag events
      const tipDragListener = new DragListener( {
        targetNode: tipArrowNode,
        translateNode: true,
        locationProperty: tipArrowPositionProperty
      } );

      tipArrowNode.addInputListener( tipDragListener );
      tipArrowPositionProperty.link( tipArrowPosition => {
        vector.vectorProperty.value = modelViewTransform.viewToModelDelta( tipArrowPosition );
        arrowNode.setTip( tipArrowPosition.x, tipArrowPosition.y );
      } );


    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );