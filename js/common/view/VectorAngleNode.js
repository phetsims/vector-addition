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
  const Util = require( 'DOT/Util' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  // constants
  const BASE_LINE_WIDTH = 55;
  const ARC_ARROW_OPTIONS = {
    arrowheadWidth: 13,
    arrowheadHeight: 10
  };
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

      // create the arc arrow
      const arcArrow = new ArcArrowNode( vector.angleProperty.value, ARC_RADIUS, ARC_ARROW_OPTIONS );

      const labelText = new RichText( '' );

      // add baseline and arc arrow to the parent node
      this.setChildren( [ baseLine, arcArrow, labelText ] );

      const updateLabel = ( angle ) => {// round the angle
        const roundedAngleString = Util.toFixed( angle, 1 );

        labelText.setText( roundedAngleString + '<sup>o</sup>' );
        const angleInRad = Util.toRadians( angle );

        //TODO: get designer feedback and clean up
        if ( angle > 20 ) {
          labelText.setTranslation( ( ARC_RADIUS + 10 ) * Math.cos( angleInRad / 2 ),
            -( ARC_RADIUS + 10 ) * Math.sin( angleInRad / 2 ) );
        }
        else if ( angle > 0 ) {
          labelText.setTranslation( ARC_RADIUS / 2, +ARC_RADIUS / 2 );
        }
        else if ( angle > -20 ) {
          labelText.setTranslation( ARC_RADIUS / 2, -ARC_RADIUS / 2 );
        }
        else {
          labelText.setTranslation( ( ARC_RADIUS + 10 ) * Math.cos( angleInRad / 2 ),
            -( ARC_RADIUS + 10 ) * Math.sin( angleInRad / 2 ) );

        }
      };

      // update the arcArrow and the label based on the angle of the vector
      vector.angleProperty.link( ( angle ) => {

        // update the angle of the arc
        arcArrow.setAngle( angle );

        // show arrowhead on angle arc if |angle| is > 10 degrees
        arcArrow.setArrowheadVisibility( Math.abs( angle ) > 20 );

        // update value of angle and position of label
        updateLabel( angle );
      } );

      // update the radius of the arcArrow based on the magnitude of the vector
      vector.magnitudeProperty.link( ( magnitude ) => {

        // get magnitude of vector in view coordinates
        const viewMagnitude = modelViewTransform.modelToViewDeltaX( magnitude );

        // set radius of the arcArrow to be viewMagnitude/2 or ARC_RADIUS, whichever is less
        arcArrow.setRadius( ( viewMagnitude / 2 < ARC_RADIUS ) ? viewMagnitude / 2 : ARC_RADIUS );
      } );

      // update visibility of this node
      angleVisibleProperty.linkAttribute( this, 'visible' );

    }
  }

  return vectorAddition.register( 'VectorAngleNode', VectorAngleNode );
} );
