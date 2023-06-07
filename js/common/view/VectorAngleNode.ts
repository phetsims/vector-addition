// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorAngleNode is the angle indicator that appears on vectors on the graph when the angle checkbox is checked.
 * Only shows if the vector model is active.
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { Color, Line, Node, Text } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import CurvedArrowNode from './CurvedArrowNode.js';

// constants

// maximum radius of the curved arrow - the radius is changed to keep the curved arrow smaller than the vector.
const MAX_CURVED_ARROW_RADIUS = 25;

// the percent symbol of curved arrow radius when compared to the magnitude of the vector - as long as it's less than
// the max curved arrow radius
const MAX_RADIUS_SCALE = 0.79;

// maximum length of the baseline that is parallel to the x axis
const MAX_BASELINE_WIDTH = 55;

// the maximum percentage of the baseline when compared to the radius of the curved arrow.
const MAX_BASELINE_SCALE = 0.60;

// the offset of the angle label from the curved arrow
const LABEL_OFFSET = 3.5;

// Angles greater than 35 deg position the label between the vector and the baseline, and angles under 35
// place the label on the other side of the baseline. See
// https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit#bookmark=id.on5p73bbry7g.
const ANGLE_UNDER_BASELINE_THRESHOLD = 35;

export default class VectorAngleNode extends Node {

  /**
   * @param {Vector} vector - the model for the vector that the angle represents
   * @param {BooleanProperty} anglesVisibleProperty
   * @param {ReadOnlyProperty.<ModelViewTransform2>} modelViewTransformProperty
   */
  constructor( vector, anglesVisibleProperty, modelViewTransformProperty ) {

    assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
    assert && assert( anglesVisibleProperty instanceof BooleanProperty, `invalid anglesVisibleProperty: ${anglesVisibleProperty}` );
    assert && assert( modelViewTransformProperty instanceof ReadOnlyProperty, `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );

    super();

    // @private {Line} baseline - line that is parallel to the x axis.
    this.baseLine = new Line( 0, 0, MAX_BASELINE_WIDTH, 0, { stroke: Color.BLACK } );

    // @private {CurvedArrowNode} curvedArrow - arrow in a circle shape from the baseline to the vector
    this.curvedArrow = new CurvedArrowNode( MAX_CURVED_ARROW_RADIUS, vector.angle ? vector.angle : 0 );

    // @private {Text} labelText - set to an arbitrary string for now.
    this.labelText = new Text( '', { font: VectorAdditionConstants.ANGLE_LABEL_FONT } );

    this.setChildren( [ this.baseLine, this.curvedArrow, this.labelText ] );

    // Update the angle and its visibility. Must be disposed on dispose.
    const angleVisibleMultilink = Multilink.multilink(
      [ anglesVisibleProperty, vector.isOnGraphProperty, vector.vectorComponentsProperty ],
      ( angleVisible, isOnGraph, vectorComponents ) => {
        this.visible = ( angleVisible && isOnGraph && vector.magnitude !== 0 );
        if ( this.visible ) {
          this.updateAngleNode( vector, modelViewTransformProperty.value );
        }
      } );

    // @private {function} disposeVectorAngleNode - function to unlink listeners, called in dispose()
    this.disposeVectorAngleNode = () => {
      Multilink.unmultilink( angleVisibleMultilink );
    };
  }

  /**
   * @public
   * @override
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
   * @param {Vector} vector - model vector to base the angle off of
   * @param {ModelViewTransform2} modelViewTransform
   */
  updateAngleNode( vector, modelViewTransform ) {

    assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

    // convenience reference.
    const angleDegrees = vector.angleDegrees;

    // Update the curved arrow node angle
    this.curvedArrow.setAngle( vector.angle ? vector.angle : 0 );

    // Update the label text.
    this.labelText.setString(
      ( angleDegrees === null ) ? '' :
      `${Utils.toFixed( angleDegrees, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES )}${MathSymbols.DEGREES}`
    );

    // Update the curved arrow radius
    const viewMagnitude = modelViewTransform.modelToViewDeltaX( vector.magnitude );
    if ( viewMagnitude !== 0 ) {
      this.curvedArrow.setRadius( _.min( [ MAX_RADIUS_SCALE * viewMagnitude, MAX_CURVED_ARROW_RADIUS ] ) );
    }

    // Update the baseline
    this.baseLine.setX2( _.min( [ this.curvedArrow.radius / MAX_BASELINE_SCALE, MAX_BASELINE_WIDTH ] ) );

    // Position the label text
    if ( angleDegrees !== null ) {

      if ( angleDegrees > ANGLE_UNDER_BASELINE_THRESHOLD ) {

        // Position the label next to the arc, halfway across the arc
        this.labelText.setTranslation( ( this.curvedArrow.radius + LABEL_OFFSET ) * Math.cos( vector.angle / 2 ),
          -( this.curvedArrow.radius + LABEL_OFFSET ) * Math.sin( vector.angle / 2 ) );
      }
      else if ( angleDegrees >= 0 ) {

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

vectorAddition.register( 'VectorAngleNode', VectorAngleNode );