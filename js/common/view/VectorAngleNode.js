// Copyright 2019, University of Colorado Boulder

/**
 * View for the angle underneath/above the vector when the angle checkbox is selected.
 *
 * Listens to the common models angleVisibleProperty and the graphs activeVectorProperty to determine visibility.
 * Listens to a model vector's angleDegreesProperty to get the angle.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ArcArrowNode = require( 'VECTOR_ADDITION/common/view/ArcArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants
  const BASE_LINE_LENGTH = 55;
  const ARC_ARROW_OPTIONS = {
    arrowheadWidth: 8,
    arrowheadHeight: 6
  };
  const ARC_RADIUS = 25;
  const ANGLE_LABEL_FONT = new PhetFont( { size: 14, fontWeight: 'lighter', family: 'serif' } );

  // The offset of the angle label from the arc arrow
  const LABEL_OFFSET = 5;

  // Rounding of the angle label
  const ANGLE_ROUNDING = VectorAdditionConstants.ANGLE_ROUNDING;

  // Angles greater than 35 position the label between the vector and the baseline, and angles under 35
  // place the label on the other side of the baseline.
  const MAX_ANGLE_UNDER_BASELINE = 35;

  // The maximum percentage that the arc-arrow radius can be when compared to the magnitude of the vector
  const MAX_RADIUS_SCALE = 0.59;

  class VectorAngleNode extends Node {
    /**
     * @constructor
     * @param {VectorModel} vectorModel - the vector model
     * @param {BooleanProperty} angleVisibleProperty
     * @param {Graph} graph
     */
    constructor( vectorModel, angleVisibleProperty, graph) {

      assert && assert( vectorModel instanceof VectorModel, `invalid vectorModel: ${vectorModel}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );


      //----------------------------------------------------------------------------------------

      super();

      // @private {Line}
      this.baseLine = new Line( 0, 0, BASE_LINE_LENGTH, 0, {
        stroke: VectorAdditionColors.BLACK
      } );

      // @private {ArcArrowNode}
      this.arcArrow = new ArcArrowNode( vectorModel.angleDegreesProperty.value, ARC_RADIUS, ARC_ARROW_OPTIONS );

      // @private {Text} - to be set later
      this.labelText = new Text( '', { font: ANGLE_LABEL_FONT } );

      this.setChildren( [ this.baseLine, this.arcArrow, this.labelText ] );

      //----------------------------------------------------------------------------------------

      // Update the angle when the model changes
      const updateAngleListener = angle => {
        if ( this.visible ) { // only update the angle if we are visible
          this.updateAngleNode( angle );
        }
      };
      vectorModel.angleDegreesProperty.link( updateAngleListener );

      //----------------------------------------------------------------------------------------
      // Update the scale when the vector becomes too small
      const updateScaleListener = magnitude => {
        if ( this.visible ) { // only update the angle if we are visible
          this.scaleArc( magnitude, graph.modelViewTransformProperty.value );
        }
      };
      vectorModel.magnitudeProperty.link( updateScaleListener );

      //----------------------------------------------------------------------------------------
      // Observe when the angle visible property is changing and update the visibility of the angle node. The angle is
      // only visible when the vector is both active and the angle checkbox is clicked
      const visibilityObserver = Property.multilink(
        [ angleVisibleProperty, graph.activeVectorProperty, vectorModel.isOnGraphProperty ],
        ( angleVisible, activeVector, isOnGraph ) => {
          // Visible if the angle checkbox is clicked, its active, and its on the graph
          this.visible = angleVisible && activeVector === vectorModel && isOnGraph;


          this.updateAngleNode( vectorModel.angleDegreesProperty.value );
          this.scaleArc( vectorModel.magnitude, graph.modelViewTransformProperty.value );
        } );


      // @private {function} - function to unlink listeners, called in dispose()
      this.unlinkListeners = () => {
        vectorModel.angleDegreesProperty.unlink( updateAngleListener );
        vectorModel.magnitudeProperty.unlink( updateScaleListener );
        visibilityObserver.dispose();
      };
    }

    /**
     * Disposes the angle node
     * @public
     */
    dispose() {
      this.unlinkListeners();
      super.dispose();
    }

    /**
     * Updates the label and arc arrow. Called when the vector model's angle is changed
     * @param {number} angle - in degrees
     * @private
     */
    updateAngleNode( angle ) {

      this.arcArrow.angle = angle;

      this.labelText.setText( Util.toFixed( angle, ANGLE_ROUNDING ) + '\u00B0' );

      const angleInRadians = Util.toRadians( angle );

      //----------------------------------------------------------------------------------------
      // Position the label text

      if ( angle > MAX_ANGLE_UNDER_BASELINE ) {
        // Position the label next to the arc, halfway across the arc
        this.labelText.setTranslation( ( ARC_RADIUS + LABEL_OFFSET ) * Math.cos( angleInRadians / 2 ),
          -( ARC_RADIUS + LABEL_OFFSET ) * Math.sin( angleInRadians / 2 ) );
      }
      else if ( angle > 0 ) {
        // Position the label halfway across, but on the other side of the baseline
        this.labelText.setTranslation( ARC_RADIUS / 2, ARC_RADIUS / 2 );
      }
      else if ( angle > -MAX_ANGLE_UNDER_BASELINE ) {
        // Position the label halfway across, but on the other side of the baseline
        this.labelText.setTranslation( ARC_RADIUS / 2, -ARC_RADIUS / 2 + +this.labelText.height / 2 );
      }
      else {
        // Position the label next to the arc, halfway across the arc
        this.labelText.setTranslation( ( ARC_RADIUS + LABEL_OFFSET ) * Math.cos( angleInRadians / 2 ),
          -( ARC_RADIUS + LABEL_OFFSET ) * Math.sin( angleInRadians / 2 ) + this.labelText.height / 2 );
      }
    }

    /**
     * Scale the node based on the magnitude of the vector model. This ensures that the angle is always
     * smaller than the vector and is 'underneath' the vector
     * @param {number} magnitude - magnitude of the vector
     * @param {ModelViewTransform2} modelViewTransform
     * @public
     */
    scaleArc( magnitude, modelViewTransform ) {

      // Function to the get the scale factor of the arc arrow node when the vector magnitude becomes to small
      // with respect to the arc arrow radius
      const getArcScaleFactor = ( viewMagnitude ) => {

        if ( ARC_RADIUS / viewMagnitude > MAX_RADIUS_SCALE ) {
          return viewMagnitude * MAX_RADIUS_SCALE / ARC_RADIUS;
        }
        else {
          return 1;
        }
      };

      const viewMagnitude = modelViewTransform.modelToViewDeltaX( magnitude );

      const arcScaleFactor = getArcScaleFactor( viewMagnitude );

      // When the magnitude is 0 don't display the arc arrow node
      if ( magnitude === 0 ) {
        this.arcArrow.visible = false;
      }
      else {
        this.arcArrow.visible = true;

        // Scale the arc arrow so it fits underneath the vector
        this.arcArrow.setScaleMagnitude( arcScaleFactor );
      }
      // Resize the base line
      this.baseLine.setX2( arcScaleFactor * BASE_LINE_LENGTH );
    }
  }

  return vectorAddition.register( 'VectorAngleNode', VectorAngleNode );
} );