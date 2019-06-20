// Copyright 2019, University of Colorado Boulder

/**
 * View for the angle underneath/above the vector.
 * Constructed based on many individually passed parameters about the vector node.
 * Listens to the common models angleVisibleProperty to determine when to display the angle node.
 * Listens to a model vector's angleDegreesProperty to get the angle.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ArcArrowNode = require( 'VECTOR_ADDITION/common/view/ArcArrowNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const BASE_LINE_LENGTH = 55;
  const ARC_ARROW_OPTIONS = {
    arrowheadWidth: 8,
    arrowheadHeight: 6
  };

  const ARC_RADIUS = 25;

  class VectorAngleNode extends Node {

    /**
     * @param {VectorModel} vectorModel- the vector model
     * @param {BooleanProperty} angleVisibleProperty
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( vectorModel, angleVisibleProperty, modelViewTransform ) {

      super();

      // create the horizontal line
      const baseLine = new Line( 0, 0, BASE_LINE_LENGTH, 0, {
        stroke: 'black'
      } );

      // create the arc arrow
      const arcArrow = new ArcArrowNode( vectorModel.angleDegreesProperty.value, ARC_RADIUS, ARC_ARROW_OPTIONS );

      const labelText = new Text( '', {
        font: new PhetFont( { size: 14, family: 'Times' } )
      } );

      // add baseline and arc arrow to the parent node
      this.setChildren( [ baseLine, arcArrow, labelText ] );

      const updateLabel = ( angle ) => {// round the angle
        const roundedAngleString = Util.toFixed( angle, 1 );

        labelText.setText( roundedAngleString + '\u00B0' );
        const angleInRad = Util.toRadians( angle );

        //TODO: get designer feedback and clean up
        if ( angle > 35 ) {
          labelText.setTranslation( ( ARC_RADIUS + 5 ) * Math.cos( angleInRad / 2 ),
            -( ARC_RADIUS + 5 ) * Math.sin( angleInRad / 2 ) );
        }
        else if ( angle > 0 ) {
          labelText.setTranslation( ARC_RADIUS / 2, +ARC_RADIUS / 2 );
        }
        else if ( angle > -35 ) {
          labelText.setTranslation( ARC_RADIUS / 2, -ARC_RADIUS / 2 );
        }
        else {
          labelText.setTranslation( ( ARC_RADIUS + 10 ) * Math.cos( angleInRad / 2 ),
            -( ARC_RADIUS + 10 ) * Math.sin( angleInRad / 2 ) );

        }
      };

      // function to the get the scale factor of the arc arrow node when the vector magnitude becomes to small
      // with respect to the arc arrow radius
      const getArcScaleFactor = ( viewMagnitude ) => {

        // the maximum percentage that the arc-arrow radius can be when compared to the magnitude of the vector
        const maximumRadiusScale = 0.59;

        let scaleFactor;
        if ( viewMagnitude / ARC_RADIUS < 1 / maximumRadiusScale ) {
          scaleFactor = ( viewMagnitude / ( 1 / maximumRadiusScale * ARC_RADIUS ) );
        }
        else {
          scaleFactor = 1;
        }

        return scaleFactor;
      };

      // update the arcArrow and the label based on the angle of the vector
      const updateAngle = ( angle ) => {

        // update the angle of the arc
        arcArrow.setAngle( angle );

        // update value of angle and position of label
        updateLabel( angle );
      };

      const updateRadius = ( magnitude ) => {

        // get magnitude of vector in view coordinates
        const viewMagnitude = modelViewTransform.modelToViewDeltaX( magnitude );

        const arcScaleFactor = getArcScaleFactor( viewMagnitude );

        // when the magnitude is 0 don't display the arc arrow node
        if ( magnitude === 0 ) {
          arcArrow.visible = false;
        }
        else {
          arcArrow.visible = true;

          // scale the arc arrow so it fits underneath the vector
          arcArrow.setScaleMagnitude( arcScaleFactor );
        }

        baseLine.setX2( arcScaleFactor * BASE_LINE_LENGTH );
      };

      vectorModel.angleDegreesProperty.link( updateAngle );

      // update the radius of the arcArrow based on the magnitude of the vector
      vectorModel.magnitudeProperty.link( updateRadius );

      // update visibility of this node
      const toggleVisibilityListener = angleVisibleProperty.linkAttribute( this, 'visible' );

      this.unlinkProperties = () => {
        vectorModel.angleDegreesProperty.unlink( updateAngle );
        vectorModel.magnitudeProperty.unlink( updateRadius );
        angleVisibleProperty.unlink( toggleVisibilityListener );
      };
    }

    dispose() {
      this.unlinkProperties();
      super.dispose();
    }
  }

  return vectorAddition.register( 'VectorAngleNode', VectorAngleNode );
} );
