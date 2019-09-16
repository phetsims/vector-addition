// Copyright 2019, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const Vector2 = require( 'DOT/Vector2' );

  class DashedArrowNode extends Node {

    /**
     * @param {number} tailX
     * @param {number} tailY
     * @param {number} tipX
     * @param {number} tipY
     * @param {Object} [options]
     */
    constructor( tailX, tailY, tipX, tipY, options ) {

      options = _.extend( {
        headHeight: 10,
        headWidth: 10,
        tailWidth: 5,
        fill: 'black',
        tailDash: [ 3, 3 ]
      }, options );

      const tailNode = new Path( null, {
        stroke: options.fill,
        lineWidth: options.tailWidth,
        lineDash: options.tailDash
      } );

      const headNode = new Path( null, {
        fill: options.fill
      } );

      assert && assert( !options.children, 'DashedArrowNode sets children' );
      options.children = [ tailNode, headNode ];

      super( options );

      // @private
      this.headHeight = options.headHeight;
      this.headWidth = options.headWidth;
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
     * Sets the tail and tip locations.
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

      if ( tipX === tailX && tipY === tailY ) {

        // if the arrow has zero length, then nothing will be drawn
        this.tailNode.shape = null;
        this.headNode.shape = null;
      }
      else {

        // Represent the arrow as a vector
        const vector = new Vector2( tipX - tailX, tipY - tailY );
        const length = vector.magnitude;

        // Set up a coordinate frame that goes from tail to tip.
        const xHatUnit = vector.normalized();
        const yHatUnit = xHatUnit.rotated( Math.PI / 2 );

        const getPoint = function( xHat, yHat ) {
          const x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
          const y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
          return new Vector2( x, y );
        };

        // limit head height to tail length
        const headHeight = Math.min( this.headHeight, 0.99 * length );

        //TODO #177 shorten the tail so that it ends where the head begins
        // Describe the tail as a line segment
        this.tailNode.shape = Shape.lineSegment( tailX, tailY, tipX, tipY );

        // Describe the head as a triangle
        this.headNode.shape = new Shape()
          .moveToPoint( getPoint( length - headHeight, this.headWidth / 2 ) )
          .lineToPoint( getPoint( length, 0 ) )
          .lineToPoint( getPoint( length - headHeight, -this.headWidth / 2 ) )
          .close();
      }
    }

    /**
     * Sets the tip location.
     * @param {number} tipX
     * @param {number} tipY
     * @public
     */
    setTip( tipX, tipY ) {
      this.setTailAndTip( this.tailX, this.tailY, tipX, tipY );
    }
  }

  return vectorAddition.register( 'DashedArrowNode', DashedArrowNode );
} );