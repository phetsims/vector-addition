// Copyright 2019, University of Colorado Boulder

/**
 * View for the angle underneath/above the vector.
 * Constructed based on many individually passed parameters about the vector node.
 * Listens to the common models angleVisibleProperty to determine when to display the angle node.
 * Listens to a model vector's angleProperty to get the angle.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ArcArrowNode = require( 'VECTOR_ADDITION/common/view/ArcArrowNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const BASE_LINE_WIDTH = 55;
  const ARROWHEAD_WIDTH = 10;
  const ARC_RADIUS = 40;

  class VectorAngleNode extends Node {

    /**
     * @param {Vector} vector - the vector model
     * @param {BooleanProperty} angleVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( vector, angleVisibleProperty, modelViewTransform ) {

      super();

      // create the horizontal line
      const baseLine = new Line( 0, 0, BASE_LINE_WIDTH, 0, {
        stroke: 'black'
      } );

      const arcArrow = new ArcArrowNode( 40, ARC_RADIUS, {
        arrowheadWidth: ARROWHEAD_WIDTH

      } );
      this.setChildren( [ baseLine, arcArrow ] );


      vector.angleProperty.link( ( angle ) => {

        // round the angle
        // const roundedAngleString = Util.toFixed( angle, 1 );
        arcArrow.setAngle( angle );

      } );

      angleVisibleProperty.linkAttribute( this, 'visible' );

      this.addChild( baseLine );
    }
  }

  return vectorAddition.register( 'VectorAngleNode', VectorAngleNode );
} );
