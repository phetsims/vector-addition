// Copyright 2019-2024, University of Colorado Boulder

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
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';

type SelfOptions = {
  tailDash?: number[]; // describes the dash, similar to SCENERY/LineStyle lineDash
} & PickOptional<ArrowNodeOptions, 'headHeight' | 'headWidth' | 'tailWidth' | 'fill' | 'isHeadDynamic' | 'fractionalHeadHeight' | 'lineWidth'>;

export type DashedArrowNodeOptions = SelfOptions & PickOptional<NodeOptions, 'cursor'>;

export default class DashedArrowNode extends Node {

  private _tailX: number;
  private _tailY: number;
  private _tipX: number;
  private _tipY: number;

  private readonly headHeight: number;
  private readonly headWidth: number;
  private readonly isHeadDynamic: boolean;
  private readonly fractionalHeadHeight: number;
  private readonly tailNode: Path;
  private readonly headNode: Path;

  public constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: DashedArrowNodeOptions ) {

    const options = optionize<DashedArrowNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      tailDash: [ 3, 3 ],
      headHeight: 10,
      headWidth: 10,
      tailWidth: 5,
      fill: 'black',
      isHeadDynamic: false,
      fractionalHeadHeight: 0.5,
      lineWidth: 1
    }, providedOptions );

    const headNode = new Path( null, {
      fill: options.fill
    } );

    const tailNode = new Path( null, {
      stroke: options.fill,
      lineWidth: options.tailWidth,
      lineDash: options.tailDash
    } );

    options.children = [ tailNode, headNode ];

    super( options );

    this._tailX = tailX;
    this._tailY = tailY;
    this._tipX = tipX;
    this._tipY = tipY;

    this.headHeight = options.headHeight;
    this.headWidth = options.headWidth;
    this.isHeadDynamic = options.isHeadDynamic;
    this.fractionalHeadHeight = options.fractionalHeadHeight;
    this.tailNode = tailNode;
    this.headNode = headNode;

    // initialize
    this.setTailAndTip( tailX, tailY, tipX, tipY );
  }

  public get tailX(): number { return this._tailX; }

  public get tailY(): number { return this._tailY; }

  public get tipX(): number { return this._tipX; }

  public get tipY(): number { return this._tipY; }

  /**
   * Sets the tail and tip positions.
   */
  public setTailAndTip( tailX: number, tailY: number, tipX: number, tipY: number ): void {

    this._tailX = tailX;
    this._tailY = tailY;
    this._tipX = tipX;
    this._tipY = tipY;

    this.update();
  }

  /**
   * Sets the tip position.
   */
  public setTip( tipX: number, tipY: number ): void {
    this.setTailAndTip( this.tailX, this.tailY, tipX, tipY );
  }

  private update(): void {

    // Represent the arrow as a vector
    const vector = new Vector2( this._tipX - this._tailX, this._tipY - this._tailY );

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

      const getPoint = ( xHat: number, yHat: number ) => {
        const x = xHatUnit.x * xHat + yHatUnit.x * yHat + this._tailX;
        const y = xHatUnit.y * xHat + yHatUnit.y * yHat + this._tailY;
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
      const tailX2 = this.tailX + scaledUnit.x;
      const tailY2 = this.tailY + scaledUnit.y;

      // Describe the tail as a line segment.
      this.tailNode.shape = Shape.lineSegment( this.tailX, this.tailY, tailX2, tailY2 );

      // Describe the head as a triangle
      this.headNode.shape = new Shape()
        .moveToPoint( getPoint( length - headHeight, this.headWidth / 2 ) )
        .lineToPoint( getPoint( length, 0 ) )
        .lineToPoint( getPoint( length - headHeight, -this.headWidth / 2 ) )
        .close();
    }
  }
}

vectorAddition.register( 'DashedArrowNode', DashedArrowNode );