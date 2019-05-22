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
  //const Bounds2 = require( 'DOT/Bounds2' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  //const Property = require( 'AXON/Property' );

  // constants
  //const modelBounds = new Bounds2( -30, -20, 30, 20 );
  // const viewBounds = new Bounds2( 29, 90, 29 + 750, 90 + 500 );

  // constants
  const ARROW_OPTIONS = { stroke: 'black', fill: 'blue', lineWidth: 1, headWidth: 10, headHeight: 5 };

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
      const labelNode = new FormulaNode( '\\vec{a}' );

      const tipArrowNode = new Circle( 10, { center: tipPosition, fill: 'yellow' } );
      this.addChild( tipArrowNode );

      this.addChild( arrowNode );
      this.addChild( labelNode );

      const tailArrowPositionProperty = new Vector2Property( vector.tailPositionProperty.value );

      // @public (read-only) - Target for the arrow drag listener
      this.dragTarget = arrowNode;
      // @public - for forwarding drag events
      this.dragListener = new DragListener( {
        targetNode: this,
        translateNode: false,
        //  dragBoundsProperty: new Property( modelBounds ),
        transform: modelViewTransform,
        locationProperty: tailArrowPositionProperty
      } );

      tailArrowPositionProperty.link( tailArrowPosition => {
        vector.tailPositionProperty.value = tailArrowPosition.roundedSymmetric();
        this.translation = modelViewTransform.modelToViewPosition( vector.tailPositionProperty.value );
      } );

      this.dragTarget.addInputListener( this.dragListener );

      // locationProperty of the tip of the arrow (with respect to the base of the arrow (0,0))
      const tipArrowPositionProperty = new Vector2Property( tipPosition );


      // @public - for forwarding drag events
      const tipDragListener = new DragListener( {
        targetNode: tipArrowNode,
        translateNode: false,
        locationProperty: tipArrowPositionProperty
      } );

      tipArrowNode.addInputListener( tipDragListener );
      tipArrowPositionProperty.link( tipArrowPosition => {
        vector.vectorProperty.value = modelViewTransform.viewToModelDelta( tipArrowPosition ).roundedSymmetric();
        const snapToGridPosition = modelViewTransform.modelToViewDelta( vector.vectorProperty.value );
        arrowNode.setTip( snapToGridPosition.x, snapToGridPosition.y );
        tipArrowNode.center = snapToGridPosition;
        labelNode.center = snapToGridPosition.dividedScalar( 2 ).plus( snapToGridPosition.perpendicular.normalized().times( -20 ) );
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