// Copyright 2019-2023, University of Colorado Boulder

/**
 * View for an arrow that is curved. Used in various other views throughout the sim.
 *
 * A solution using `SCENERY-PHET/CurvedArrowShape` was investigated, but it was inappropriate for use in this sim.
 * See https://github.com/phetsims/vector-addition/blob/master/doc/images/CurvedArrowNode-notes.png for an explanation.
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
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, Node, Path } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';

export default class CurvedArrowNode extends Node {

  /**
   * @param {number} radius - the radius of curved arrow.
   * @param {number} angle - the end angle (in radians) of the curved arrow. The arrow is assumed to start at 0
   *                         radians.
   * @param {Object} [options]
   */
  constructor( radius, angle, options ) {

    assert && assert( typeof radius === 'number' && radius > 0, `invalid radius: ${radius}` );
    assert && assert( typeof angle === 'number', `invalid angle: ${angle}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
      `Extra prototype on options: ${options}` );

    options = merge( {

      arrowheadWidth: 8,  // {number} the arrowhead width (before rotation)
      arrowheadHeight: 6, // {number} the arrowhead height (before rotation)

      // options passed to the Path that creates the arrow's curved tail (arc)
      arcOptions: {
        stroke: Color.BLACK,
        lineWidth: 1.2
      },

      // options passed to the Path that creates the arrow's head
      arrowOptions: {
        fill: Color.BLACK
      }

    }, options );

    //----------------------------------------------------------------------------------------

    // Create the path for the arc. Set to an arbitrary shape for now. To be updated later.
    const arcPath = new Path( new Shape(), options.arcOptions );

    //----------------------------------------------------------------------------------------
    // Arrowhead triangle Path

    // Create the arrowhead shape of the arc
    const arrowheadShape = new Shape();

    // Create the triangle. Define the triangle as a triangle that is upright and the midpoint of its base as (0, 0)
    arrowheadShape.moveTo( 0, 0 )
      .lineTo( -options.arrowheadWidth / 2, 0 )
      .lineTo( options.arrowheadWidth / 2, 0 )
      .lineTo( 0, -options.arrowheadHeight )
      .lineTo( -options.arrowheadWidth / 2, 0 )
      .close();

    // Create the path for the arrow head. To be translated/rotated later
    const arrowheadPath = new Path( arrowheadShape, options.arrowOptions );

    //----------------------------------------------------------------------------------------

    super( { children: [ arcPath, arrowheadPath ] } );

    // @private {number} radius
    this.radius = radius;

    // @public (read-only) angle
    this.angle = angle;

    //----------------------------------------------------------------------------------------

    // @private {function} updateArrowNode - function that updates the arrow node when the angle / radius changes
    this.updateArrowNode = () => {

      //----------------------------------------------------------------------------------------
      // See https://github.com/phetsims/vector-addition/blob/master/doc/images/angle-calculations.png
      // for an annotated drawing of how the subtended angle and the corrected angle are calculated
      //----------------------------------------------------------------------------------------

      // The arrowhead subtended angle is defined as the angle between the vector from the center to the tip of the
      // arrow and the vector of the center to first point the arc and the triangle intersect
      const arrowheadSubtendedAngle = Math.asin( options.arrowheadHeight / this.radius );

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
    this.updateArrowNode();
  }

  /**
   * Sets the angle of the arc.
   * @public
   * @param {number} angle - the end angle (in radians) of the curved arrow. The arrow is assumed to start at 0 radians.
   */
  setAngle( angle ) {
    assert && assert( typeof angle === 'number', `invalid angle: ${angle}` );

    this.angle = angle;
    this.updateArrowNode();
  }

  /**
   * Sets the radius of the arc.
   * @public
   * @param {number} radius - the radius of curved arrow.
   */
  setRadius( radius ) {
    assert && assert( typeof radius === 'number' && radius > 0, `invalid radius: ${radius}` );

    this.radius = radius;
    this.updateArrowNode();
  }
}

vectorAddition.register( 'CurvedArrowNode', CurvedArrowNode );