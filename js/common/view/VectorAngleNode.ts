// Copyright 2019-2024, University of Colorado Boulder

/**
 * VectorAngleNode is the angle indicator that appears on vectors on the graph when the angle checkbox is checked.
 * Only shows if the vector model is active.
 *
 * @author Brandon Li
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
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

  // line that is parallel to the x-axis
  private readonly baseLine: Line;

  // arrow in a circle shape from the baseline to the vector
  private readonly curvedArrow: CurvedArrowNode;

  private readonly labelText: Text;

  private readonly disposeVectorAngleNode: () => void;

  public constructor( vector: Vector, anglesVisibleProperty: TReadOnlyProperty<boolean>, modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {

    super();

    this.baseLine = new Line( 0, 0, MAX_BASELINE_WIDTH, 0, { stroke: Color.BLACK } );

    this.curvedArrow = new CurvedArrowNode( MAX_CURVED_ARROW_RADIUS, vector.angle ? vector.angle : 0 );

    // set to an arbitrary string for now.
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

    this.disposeVectorAngleNode = () => {
      Multilink.unmultilink( angleVisibleMultilink );
    };
  }

  public override dispose(): void {
    this.disposeVectorAngleNode();
    super.dispose();
  }

  /**
   * Updates the angle node: (called when the vector model's components change)
   *  - Curved arrow node angle
   *  - Curved arrow node radius
   *  - Label Text
   *  - baseline length
   */
  private updateAngleNode( vector: Vector, modelViewTransform: ModelViewTransform2 ): void {

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
      this.curvedArrow.setRadius( _.min( [ MAX_RADIUS_SCALE * viewMagnitude, MAX_CURVED_ARROW_RADIUS ] )! );
    }

    const curvedArrowRadius = this.curvedArrow.getRadius();
    const vectorAngle = vector.angle!;
    assert && assert( vectorAngle !== null );

    // Update the baseline
    this.baseLine.setX2( _.min( [ curvedArrowRadius / MAX_BASELINE_SCALE, MAX_BASELINE_WIDTH ] )! );

    // Position the label text
    if ( angleDegrees !== null ) {

      if ( angleDegrees > ANGLE_UNDER_BASELINE_THRESHOLD ) {

        // Position the label next to the arc, halfway across the arc
        this.labelText.setTranslation( ( curvedArrowRadius + LABEL_OFFSET ) * Math.cos( vectorAngle / 2 ),
          -( curvedArrowRadius + LABEL_OFFSET ) * Math.sin( vectorAngle / 2 ) );
      }
      else if ( angleDegrees >= 0 ) {

        // Position the label halfway across, but on the other side of the baseline
        this.labelText.setTranslation( curvedArrowRadius / 2, curvedArrowRadius / 2 );
      }
      else if ( angleDegrees > -ANGLE_UNDER_BASELINE_THRESHOLD ) {

        // Position the label halfway across, but on the other side of the baseline
        this.labelText.setTranslation( curvedArrowRadius / 2,
          -curvedArrowRadius / 2 + this.labelText.height / 2 );
      }
      else {

        // Position the label next to the arc, halfway across the arc
        this.labelText.setTranslation( ( curvedArrowRadius + LABEL_OFFSET ) * Math.cos( vectorAngle / 2 ),
          -( curvedArrowRadius + LABEL_OFFSET ) * Math.sin( vectorAngle / 2 ) + this.labelText.height / 2
        );
      }
    }
  }
}

vectorAddition.register( 'VectorAngleNode', VectorAngleNode );