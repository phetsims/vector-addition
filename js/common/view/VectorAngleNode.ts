// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAngleNode is the angle indicator that appears on vectors on the graph when the angle checkbox is checked.
 *
 * @author Brandon Li
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import CurvedArrowNode from './CurvedArrowNode.js';
import VectorAdditionPreferences from '../model/VectorAdditionPreferences.js';
import { AngleConvention } from '../model/AngleConvention.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';

// maximum radius of the curved arrow - the radius is changed to keep the curved arrow smaller than the vector.
const MAX_CURVED_ARROW_RADIUS = 25;

// the percent symbol of curved arrow radius when compared to the magnitude of the vector - as long as it's less than
// the max curved arrow radius
const MAX_RADIUS_SCALE = 0.79;

// maximum length of the baseline that is parallel to the x-axis
const MAX_BASELINE_WIDTH = 55;

// the maximum percentage of the baseline when compared to the radius of the curved arrow.
const MAX_BASELINE_SCALE = 0.60;

// the offset of the angle text from the curved arrow
const TEXT_OFFSET = 3.5;

// Angles greater than 35 deg position the text between the vector and the baseline, and angles under 35
// place the text on the other side of the baseline. See
// https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit#bookmark=id.on5p73bbry7g.
const ANGLE_UNDER_BASELINE_THRESHOLD = 35;

export default class VectorAngleNode extends Node {

  // line that is parallel to the x-axis
  private readonly baseLine: Line;

  // arrow in a circle shape from the baseline to the vector
  private readonly curvedArrow: CurvedArrowNode;

  // displays the angle value in degrees
  private readonly angleText: Text;

  private readonly disposeVectorAngleNode: () => void;

  public constructor( vector: Vector,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2> ) {

    super();

    this.baseLine = new Line( 0, 0, MAX_BASELINE_WIDTH, 0, {
      stroke: Color.BLACK
    } );

    this.curvedArrow = new CurvedArrowNode( MAX_CURVED_ARROW_RADIUS, vector.angle ? vector.angle : 0 );

    // set to an arbitrary string for now.
    this.angleText = new Text( '', { font: VectorAdditionConstants.ANGLE_LABEL_FONT } );

    this.setChildren( [ this.baseLine, this.curvedArrow, this.angleText ] );

    // Update the angle and its visibility. Must be disposed on dispose.
    const angleVisibleMultilink = Multilink.multilink(
      [ anglesVisibleProperty, vector.isOnGraphProperty, vector.xyComponentsProperty, VectorAdditionPreferences.instance.angleConventionProperty ],
      ( angleVisible, isOnGraph, xyComponents, angleConvention ) => {
        this.visible = ( angleVisible && isOnGraph && vector.magnitude !== 0 );
        if ( this.visible ) {
          this.updateAngleNode( vector, modelViewTransformProperty.value, angleConvention );
        }
      } );

    this.disposeVectorAngleNode = () => {
      angleVisibleMultilink.dispose();
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
  private updateAngleNode( vector: Vector, modelViewTransform: ModelViewTransform2, angleConvention: AngleConvention ): void {

    const angleDegrees = vector.getAngleDegrees( angleConvention ) || 0;
    const angleRadians = toRadians( angleDegrees );

    // Update the curved arrow node angle
    this.curvedArrow.setAngle( angleRadians );

    // Update the curved arrow radius
    const viewMagnitude = modelViewTransform.modelToViewDeltaX( vector.magnitude );
    if ( viewMagnitude !== 0 ) {
      this.curvedArrow.setRadius( _.min( [ MAX_RADIUS_SCALE * viewMagnitude, MAX_CURVED_ARROW_RADIUS ] )! );
    }

    // Update the baseline
    const curvedArrowRadius = this.curvedArrow.getRadius();
    this.baseLine.setX2( _.min( [ curvedArrowRadius / MAX_BASELINE_SCALE, MAX_BASELINE_WIDTH ] )! );

    // Update the angle text.
    if ( angleDegrees === null ) {
      this.angleText.setString( '' );
    }
    else {
      const angleString = StringUtils.toFixedLTR( angleDegrees, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );
      // No need to localize this string. The degree symbol is universally recognized, especially in STEM contexts.
      this.angleText.setString( `${angleString}${MathSymbols.DEGREES}` );
    }

    // Position the text
    if ( angleConvention === 'signed' ) {
      if ( angleDegrees > ANGLE_UNDER_BASELINE_THRESHOLD ) {

        // Position the text next to the arc, halfway across the arc
        this.angleText.setTranslation( ( curvedArrowRadius + TEXT_OFFSET ) * Math.cos( angleRadians / 2 ),
          -( curvedArrowRadius + TEXT_OFFSET ) * Math.sin( angleRadians / 2 ) );
      }
      else if ( angleDegrees >= 0 ) {

        // Position the text halfway across, but on the other side of the baseline
        this.angleText.setTranslation( curvedArrowRadius / 2, curvedArrowRadius / 2 );
      }
      else if ( angleDegrees > -ANGLE_UNDER_BASELINE_THRESHOLD ) {

        // Position the text halfway across, but on the other side of the baseline
        this.angleText.setTranslation( curvedArrowRadius / 2,
          -curvedArrowRadius / 2 + this.angleText.height / 2 );
      }
      else {

        // Position the text next to the arc, halfway across the arc
        this.angleText.setTranslation( ( curvedArrowRadius + TEXT_OFFSET ) * Math.cos( angleRadians / 2 ),
          -( curvedArrowRadius + TEXT_OFFSET ) * Math.sin( angleRadians / 2 ) + this.angleText.height / 2
        );
      }
    }
    else {

      // angleConvention === 'unsigned', 0 to 360
      if ( angleDegrees < ANGLE_UNDER_BASELINE_THRESHOLD ) {

        // Position below the baseline.
        this.angleText.setTranslation( curvedArrowRadius / 2, curvedArrowRadius / 2 );
      }
      else {

        // Position on the curved arrow.
        const angle = Math.min( angleRadians, Math.PI );
        this.angleText.setTranslation( ( curvedArrowRadius + TEXT_OFFSET ) * Math.cos( angle / 2 ),
          -( curvedArrowRadius + TEXT_OFFSET ) * Math.sin( angle / 2 ) );
      }
    }
  }
}

vectorAddition.register( 'VectorAngleNode', VectorAngleNode );