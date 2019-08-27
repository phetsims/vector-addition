// Copyright 2019, University of Colorado Boulder

/**
 * View for the arrow/label/line underneath/above the vector when the angle checkbox is selected.
 *
 * Visual: https://user-images.githubusercontent.com/42391580/61231836-27b14d80-a6ea-11e9-9238-e9562d6ab89d.png
 *
 * Only shows if the vector model is active.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CurvedArrowNode = require( 'VECTOR_ADDITION/common/view/CurvedArrowNode' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  //----------------------------------------------------------------------------------------
  // constants

  // options for the curved arrow
  const CURVED_ARROW_OPTIONS = {
    arrowheadWidth: 8,
    arrowheadHeight: 6,
    arcOptions: {
      lineWidth: 1.2
    }
  };

  // maximum radius of the curved arrow - the radius is changed to keep the curved arrow smaller than the vector.
  const MAX_CURVED_ARROW_RADIUS = 25;

  // the percent symbol of curved arrow radius when compared to the magnitude of the vector - as long as its less than
  // the max curved arrow radius
  const MAX_RADIUS_SCALE = 0.79;

  // maximum length of the baseline that is parallel to the x axis
  const MAX_BASELINE_WIDTH = 55;

  // the maximum percentage of the baseline when compared to the radius of the curved arrow.
  const MAX_BASELINE_SCALE = 0.60;

  // the offset of the angle label from the curved arrow
  const LABEL_OFFSET = 3.5;

  // rounding of the angle label
  const ANGLE_ROUNDING = VectorAdditionConstants.NUMBER_DISPLAY_ROUNDING;

  const ANGLE_LABEL_FONT = new PhetFont( { size: 12.5, fontWeight: '100' } );

  // Angles greater than 35 deg position the label between the vector and the baseline, and angles under 35
  // place the label on the other side of the baseline. See
  // https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit#bookmark=id.on5p73bbry7g.
  const ANGLE_UNDER_BASELINE_THRESHOLD = 35;

  const DEGREES = '\u00B0'; // TODO: this should be in Math Symbols. https://github.com/phetsims/scenery-phet/issues/514


  class VectorAngleNode extends Node {
    /**
     * @param {Vector} vector - the model for the vector that the angle represents
     * @param {BooleanProperty} angleVisibleProperty
     * @param {Graph} graph
     */
    constructor( vector, angleVisibleProperty, graph ) {

      assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );

      //----------------------------------------------------------------------------------------

      super();

      // @private {Line} baseline - line that is parallel to the x axis.
      this.baseLine = new Line( 0, 0, MAX_BASELINE_WIDTH, 0, { stroke: VectorAdditionColors.BLACK } );

      // @private {CurvedArrowNode} curvedArrow - arrow in a circle shape from the baseline to the vector
      this.curvedArrow = new CurvedArrowNode( MAX_CURVED_ARROW_RADIUS,
        vector.angle ? vector.angle : 0,
        CURVED_ARROW_OPTIONS );

      // @private {Text} labelText - set to an arbitrary string for now.
      this.labelText = new Text( '', { font: ANGLE_LABEL_FONT } );

      this.setChildren( [ this.baseLine, this.curvedArrow, this.labelText ] );

      //----------------------------------------------------------------------------------------

      // Function that updates the angle node
      const updateAngleNodeListener = () => {
        if ( this.visible ) {
          this.updateAngleNode( vector, graph.modelViewTransformProperty.value );
        }
      };

      // Observe when the vector model's components change to update the angle node
      vector.vectorComponentsProperty.link( updateAngleNodeListener );

      //----------------------------------------------------------------------------------------
      // Observe when the angle visible Property is changing and update the visibility of the angle node. The angle is
      // only visible when the vector is both active and the angle checkbox is clicked
      const angleVisibleMultilink = Property.multilink(
        [ angleVisibleProperty, vector.isOnGraphProperty ],
        ( angleVisible, isOnGraph ) => {
          
          // Visible if the angle checkbox is clicked and the vector is on the graph
          this.visible = angleVisible && isOnGraph;
          this.updateAngleNode( vector, graph.modelViewTransformProperty.value );
        } );

      //----------------------------------------------------------------------------------------
      // @private {function} disposeVectorAngleNode - function to unlink listeners, called in dispose()
      this.disposeVectorAngleNode = () => {
        vector.vectorComponentsProperty.unlink( updateAngleNodeListener );
        angleVisibleMultilink.dispose();
        this.curvedArrow.dispose();
      };
    }

    /**
     * Disposes the angle node. Does the same as super class except unlink listeners.
     * @public
     */
    dispose() {
      this.disposeVectorAngleNode();
      super.dispose();
    }

    /**
     * Updates the angle node: (called when the vector model's components change)
     *  - Curved arrow node angle
     *  - Curved arrow node radius
     *  - Label Text
     *  - baseline length
     *
     * @private
     *
     * @param {Vector} vector - model vector to base the angle off of
     * @param {ModelViewTransform2} modelViewTransform
     */
    updateAngleNode( vector, modelViewTransform ) {

      assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );

      // Don't show he angle node if the magnitude is 0;
      this.visible = this.visible && vector.magnitude !== 0;

      // convenience reference.
      const angleDegrees = vector.angleDegrees;

      //----------------------------------------------------------------------------------------
      // Update the curved arrow node angle
      this.curvedArrow.setAngle( vector.angle ? vector.angle : 0 );

      //----------------------------------------------------------------------------------------
      // Update the label text.
      this.labelText.setText( angleDegrees !== null ?
                              `${Util.toFixed( vector.angleDegrees, ANGLE_ROUNDING )}${DEGREES}` :
                              '' );

      //----------------------------------------------------------------------------------------
      // Update the curved arrow radius
      const viewMagnitude = modelViewTransform.modelToViewDeltaX( vector.magnitude );

      if ( viewMagnitude !== 0 ) {
        this.curvedArrow.setRadius( _.min( [ MAX_RADIUS_SCALE * viewMagnitude, MAX_CURVED_ARROW_RADIUS ] ) );
      }

      //----------------------------------------------------------------------------------------
      // Update the baseline
      this.baseLine.setX2( _.min( [ this.curvedArrow.radius / MAX_BASELINE_SCALE, MAX_BASELINE_WIDTH ] ) );

      //----------------------------------------------------------------------------------------
      // Position the label text
      if ( angleDegrees !== null ) {

        if ( angleDegrees > ANGLE_UNDER_BASELINE_THRESHOLD ) {
          // Position the label next to the arc, halfway across the arc
          this.labelText.setTranslation( ( this.curvedArrow.radius + LABEL_OFFSET ) * Math.cos( vector.angle / 2 ),
            -( this.curvedArrow.radius + LABEL_OFFSET ) * Math.sin( vector.angle / 2 ) );
        }
        else if ( angleDegrees > 0 ) {
          // Position the label halfway across, but on the other side of the baseline
          this.labelText.setTranslation( this.curvedArrow.radius / 2, this.curvedArrow.radius / 2 );
        }
        else if ( angleDegrees > -ANGLE_UNDER_BASELINE_THRESHOLD ) {
          // Position the label halfway across, but on the other side of the baseline
          this.labelText.setTranslation( this.curvedArrow.radius / 2,
            -this.curvedArrow.radius / 2 + this.labelText.height / 2 );
        }
        else {
          // Position the label next to the arc, halfway across the arc
          this.labelText.setTranslation( ( this.curvedArrow.radius + LABEL_OFFSET ) * Math.cos( vector.angle / 2 ),
            -( this.curvedArrow.radius + LABEL_OFFSET ) * Math.sin( vector.angle / 2 ) + this.labelText.height / 2
          );
        }
      }
    }
  }

  return vectorAddition.register( 'VectorAngleNode', VectorAngleNode );
} );