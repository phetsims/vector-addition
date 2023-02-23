// Copyright 2019-2023, University of Colorado Boulder

/**
 * DashedArrowNode draws an arrow with a solid head and dashed tail.
 *
 * This implementation is specific to vector-addition. It's a simplified version of SCENERY_PHET/LineArrowNode with
 * a solid tip. See https://github.com/phetsims/vector-addition/issues/177#issuecomment-531876724.
 *
 * An attempt was made to add a dashed-tail feature to SCENERY_PHET/ArrowNode, but the current implementation of
 * ArrowNode made that virtually impossible. See https://github.com/phetsims/scenery-phet/issues/533.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';

export default class DashedArrowNode extends Node {

  /**
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @param {Object} [options]
   */
  constructor( tailX, tailY, tipX, tipY, options ) {

    options = merge( {

      tailDash: [ 3, 3 ], // {number[]} describes the dash, similar to SCENERY/LineStyle lineDash

      // These options are identical to the ArrowNode API, and must behave the same
      headHeight: 10,
      headWidth: 10,
      tailWidth: 5,
      fill: 'black', // color used for the entire arrow (fills the head and strokes the tail)
      isHeadDynamic: false, // determines whether to scale down the arrow head height for fractionalHeadHeight constraint
      fractionalHeadHeight: 0.5 // head will be scaled when headHeight is greater than fractionalHeadHeight * arrow length

    }, options );

    const headNode = new Path( null, {
      fill: options.fill
    } );

    const tailNode = new Path( null, {
      stroke: options.fill,
      lineWidth: options.tailWidth,
      lineDash: options.tailDash
    } );

    assert && assert( !options.children, 'DashedArrowNode sets children' );
    options.children = [ tailNode, headNode ];

    super( options );

    // @private
    this.headHeight = options.headHeight;
    this.headWidth = options.headWidth;
    this.isHeadDynamic = options.isHeadDynamic;
    this.fractionalHeadHeight = options.fractionalHeadHeight;
    this.tailNode = tailNode;
    this.headNode = headNode;

    // @public (read-only)
    this.tailX = tailX;
    this.tailY = tailY;
    this.tipX = tipX;
    this.tipY = tipY;

    // initialize
    this.setTailAndTip( tailX, tailY, tipX, tipY );
  }

  /**
   * Sets the tail and tip positions.
   * @param {number} tailX
   * @param {number} tailY
   * @param {number} tipX
   * @param {number} tipY
   * @public
   */
  setTailAndTip( tailX, tailY, tipX, tipY ) {

    this.tailX = tailX;
    this.tailY = tailY;
    this.tipX = tipX;
    this.tipY = tipY;

    // Represent the arrow as a vector
    const vector = new Vector2( tipX - tailX, tipY - tailY );

    if ( vector.magnitude === 0 ) {

      // if the arrow has zero magnitude, then nothing will be drawn
      this.tailNode.shape = null;
      this.headNode.shape = null;
    }
    else {

      const length = vector.magnitude;

      // Set up a coordinate frame that goes from tail to tip.
      const xHatUnit = vector.normalized();
      const yHatUnit = xHatUnit.rotated( Math.PI / 2 );

      const getPoint = function( xHat, yHat ) {
        const x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        const y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        return new Vector2( x, y );
      };

      // Limit the head height to the tail length.
      let headHeight = Math.min( this.headHeight, 0.99 * length );

      // Scale the head, if enabled and necessary.
      if ( this.isHeadDynamic && ( this.headHeight > this.fractionalHeadHeight * length ) ) {
        headHeight = this.fractionalHeadHeight * length;
      }

      // Adjust the end of the tail towards the tip, so that it doesn't overlap the head.
      const scaledUnit = xHatUnit.times( length - headHeight );
      const tailX2 = tailX + scaledUnit.x;
      const tailY2 = tailY + scaledUnit.y;

      // Describe the tail as a line segment.
      this.tailNode.shape = Shape.lineSegment( tailX, tailY, tailX2, tailY2 );

      // Describe the head as a triangle
      this.headNode.shape = new Shape()
        .moveToPoint( getPoint( length - headHeight, this.headWidth / 2 ) )
        .lineToPoint( getPoint( length, 0 ) )
        .lineToPoint( getPoint( length - headHeight, -this.headWidth / 2 ) )
        .close();
    }
  }

  /**
   * Sets the tip position.
   * @param {number} tipX
   * @param {number} tipY
   * @public
   */
  setTip( tipX, tipY ) {
    this.setTailAndTip( this.tailX, this.tailY, tipX, tipY );
  }
}

vectorAddition.register( 'DashedArrowNode', DashedArrowNode );