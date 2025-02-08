// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for an arrow that is curved. Used in various other views throughout the sim.
 *
 * A solution using `SCENERY-PHET/CurvedArrowShape` was investigated, but it was inappropriate for use in this sim.
 * See https://github.com/phetsims/vector-addition/blob/main/doc/images/CurvedArrowNode-notes.png for an explanation.
 *
 * ## Other functionality:
 *  - The Arrowhead turns invisible when the angle becomes too small (i.e. the triangle is larger than the arc)
 *  - The arrow is assumed to start at 0 rad.
 *  - Contains methods to change the radius
 *  - Contains methods to change the angle
 *
 * @author Brandon Li
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';

const COLOR = Color.BLACK;
const ARROWHEAD_WIDTH = 8;  // the arrowhead width (before rotation)
const ARROWHEAD_HEIGHT = 6; // the arrowhead height (before rotation)

export default class CurvedArrowNode extends Node {

  private radius: number;
  private angle: number;

  // function that updates this node when the angle / radius changes
  private readonly updateCurvedArrowNode: () => void;

  /**
   * @param radius - the radius of curved arrow.
   * @param angle - the end angle (in radians) of the curved arrow. The arrow is assumed to start at 0 radians.
   */
  public constructor( radius: number, angle: number ) {

    assert && assert( radius > 0, `invalid radius: ${radius}` );

    // Create the path for the arc. Set to an arbitrary shape for now. To be updated later.
    const arcPath = new Path( new Shape(), {
      stroke: COLOR,
      lineWidth: 1.2
    } );

    // Create the arrowhead - a triangle. The Shape is upright and the midpoint of its base as (0, 0).
    // The Path will be translated/rotated later.
    const arrowheadShape = new Shape();
    arrowheadShape.moveTo( 0, 0 )
      .lineTo( -ARROWHEAD_WIDTH / 2, 0 )
      .lineTo( ARROWHEAD_WIDTH / 2, 0 )
      .lineTo( 0, -ARROWHEAD_HEIGHT )
      .lineTo( -ARROWHEAD_WIDTH / 2, 0 )
      .close();
    const arrowheadPath = new Path( arrowheadShape, {
      fill: COLOR
    } );

    super( {
      children: [ arcPath, arrowheadPath ]
    } );

    this.radius = radius;
    this.angle = angle;

    this.updateCurvedArrowNode = () => {

      //----------------------------------------------------------------------------------------
      // See https://github.com/phetsims/vector-addition/blob/main/doc/images/angle-calculations.png
      // for an annotated drawing of how the subtended angle and the corrected angle are calculated
      //----------------------------------------------------------------------------------------

      // The arrowhead subtended angle is defined as the angle between the vector from the center to the tip of the
      // arrow and the vector of the center to first point the arc and the triangle intersect
      const arrowheadSubtendedAngle = Math.asin( ARROWHEAD_HEIGHT / this.radius );

      // Flag that indicates if the arc is anticlockwise (measured from positive x-axis) or clockwise.
      const isAnticlockwise = this.angle >= 0;

      // The corrected angle is the angle that is between the vector that goes from the center to the first point the
      // arc and the triangle intersect and the vector along the baseline (x-axis). This is used instead to create a
      // more accurate angle excluding the size of the triangle. Again, look at the drawing above.
      const correctedAngle = isAnticlockwise ?
                             this.angle - arrowheadSubtendedAngle :
                             this.angle + arrowheadSubtendedAngle;

      // Change the arrowhead visibility to false when the angle is too small relative to the subtended angle and true
      // otherwise
      arrowheadPath.visible = Math.abs( this.angle ) > arrowheadSubtendedAngle;

      // Create the arc shape
      const arcShape = new Shape().arcPoint( Vector2.ZERO,
        this.radius,
        0,
        arrowheadPath.visible ? -correctedAngle : -this.angle, isAnticlockwise );
      arcPath.setShape( arcShape );

      if ( arrowheadPath.visible ) {

        // Adjust the position and angle of arrowhead. Rotate the arrowhead from the tip into the correct position
        // from the original angle
        arrowheadPath.setRotation( isAnticlockwise ? -this.angle : -this.angle + Math.PI );

        // Translate the tip of the arrowhead to the tip of the arc.
        arrowheadPath.setTranslation(
          Math.cos( arrowheadPath.visible ? correctedAngle : this.angle ) * this.radius,
          -Math.sin( arrowheadPath.visible ? correctedAngle : this.angle ) * this.radius
        );
      }
    };
    this.updateCurvedArrowNode();
  }

  /**
   * Sets the angle of the arc.
   * @param angle - the end angle (in radians) of the curved arrow. The arrow is assumed to start at 0 radians.
   */
  public setAngle( angle: number ): void {
    this.angle = angle;
    this.updateCurvedArrowNode();
  }

  /**
   * Sets the radius of the arc.
   * @param radius - the radius of curved arrow.
   */
  public setRadius( radius: number ): void {
    this.radius = radius;
    this.updateCurvedArrowNode();
  }

  public getRadius(): number {
    return this.radius;
  }
}

vectorAddition.register( 'CurvedArrowNode', CurvedArrowNode );