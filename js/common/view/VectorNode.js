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
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

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

      const arrowNode = new ArrowNode( 0, 0, 30, 0, ARROW_OPTIONS );

      this.addChild( arrowNode );

      // @public (read-only) - Target for drag listeners
      this.dragTarget = arrowNode;

      // @public - for forwarding drag events
      this.dragListener = new DragListener( {
        targetNode: this,
        translateNode: true
      } );

      this.dragTarget.addInputListener( this.dragListener );
    }
  }

  return vectorAddition.register( 'VectorNode', VectorNode );
} );