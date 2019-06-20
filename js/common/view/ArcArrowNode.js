// Copyright 2019, University of Colorado Boulder

/**
 * Create a node that represents a curved arrow node. Used in various icons throughout the simulation and the vector
 * angle node.
 *
 * Supports negative angles.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class ArcArrowNode extends Node {
    /**
     * Create a node that draws a curved curved arrow
     * @param {number} angle - the angle of the arc arrow in degrees
     * @param {number} radius - the radius of the arc arrow
     * @param {Object} [options]
     */
    constructor( angle, radius, options ) {

      options = _.extend( {
        center: Vector2.ZERO, // {Vector2} the coordinates that the arc revolves around
        arrowheadWidth: 7, // {number} the arrowhead width before translation
        arrowheadHeight: 5, // {number} the arrowhead height before translation
        arcOptions: null, // {Object} filled in bellow
        arrowOptions: null, // {Object} filled in bellow,
        includeArrowhead: true // {boolean} option to exclude the arrowhead
      }, options );

      options.arcOptions = _.extend( {
        stroke: 'black'
      }, options.arcOptions );

      options.arrowOptions = _.extend( {
        fill: 'black'
      }, options.arrowOptions );

      //----------------------------------------------------------------------------------------
      // Type check
      assert && assert( typeof angle === 'number', `invalid angle: ${angle}` );
      assert && assert( typeof radius === 'number', `invalid radius: ${radius}` );
      assert && assert( options.center instanceof Vector2, `invalid options.center: ${options.center}` );
      assert && assert( typeof options.arrowheadWidth === 'number' && options.arrowheadWidth > 0,
        `invalid options.arrowheadWidth: ${options.arrowheadWidth}` );
      assert && assert( typeof options.arrowheadHeight === 'number' && options.arrowheadHeight > 0,
        `invalid options.arrowheadHeight: ${options.arrowheadHeight}` );
      assert && assert( typeof options.includeArrowhead === 'boolean',
        `invalid options.includeArrowhead: ${options.includeArrowhead}` );

      //----------------------------------------------------------------------------------------
      super();

      // @public (read-only) {Vector2} the center that the arc revolves around
      this.revolvedPoint = options.center;

      // @public (read-only) {number} the angle (degrees) that the arc arrow is at
      this.angle = angle;

      // @public (read-only) {number} the radius of the arc
      this.radius = radius;

      // @public (read-only) {boolean} include the arrowhead
      this.arrowheadIncluded = options.includeArrowhead;

      // @private {number}
      this.arrowheadHeight = options.arrowheadHeight;
      //----------------------------------------------------------------------------------------

      // Create a shape for the arc of the angle, set to and empty shape, shape will be updated later.
      const arcShape = new Shape();

      // @private {Path} the path for the arc shape
      this.arcPath = new Path( arcShape, options.arcOptions );

      //----------------------------------------------------------------------------------------

      // Create the arrowhead shape of the arc
      const arrowheadShape = new Shape();

      // Create the triangle that will be translated/rotated later
      // Define the triangle as a triangle that is upright and the midpoint of the base is defined as (0, 0)
      arrowheadShape.moveTo( 0, 0 )
        .lineTo( -options.arrowheadWidth / 2, 0 )
        .lineTo( options.arrowheadWidth / 2, 0 )
        .lineTo( 0, -options.arrowheadHeight )
        .lineTo( -options.arrowheadWidth / 2, 0 )
        .close();

      // @private {Path} the path for the arrowHead shape
      this.arrowheadPath = new Path( arrowheadShape, options.arrowOptions );

      //----------------------------------------------------------------------------------------

      // Add children the paths to the scene graphs
      this.setChildren( [ this.arcPath, this.arrowheadPath ] );

      // Set the position and rotation of the arrowhead and the sweep of the arc
      this.setAngleAndRadius( angle, radius, this.arrowheadIncluded );
    }

    /**
     * @param {number} angle - the angle of the arc arrow in degrees
     * @param {number} radius - the radius of the arc in view coordinates
     * @param {boolean} includeArrowhead
     * @private
     */
    setAngleAndRadius( angle, radius, includeArrowhead ) {

      assert && assert( typeof angle === 'number', `invalid angle: ${angle}` );
      assert && assert( typeof radius === 'number', `invalid radius: ${radius}` );
      assert && assert( typeof includeArrowhead === 'boolean',
        `invalid options.includeArrowhead: ${includeArrowhead}` );

      // reassign the properties
      this.angle = angle;
      this.radius = radius;

      // convenience variable
      const angleInRadians = Util.toRadians( angle );

      // {boolean} is the arc anticlockwise (measured from positive x-axis) or clockwise.
      const isAnticlockwise = angle >= 0;

      // the arrowhead subtended angle is defined as the angle between the vector to the tip of the arrow
      // and the vector to the first point the arc and the triangle intersect
      const arrowheadSubtentedAngle = Math.asin( this.arrowheadHeight / radius );

      // change the arrowhead visibility to false when the angle is too small relative to the 
      // subtended angle and true otherwise
      this.setArrowheadVisibility( Math.abs( angleInRadians ) > arrowheadSubtentedAngle );

      // the corrected angle is the angle that is between the vector that goes to the first point the arc
      // and the triangle intersect and the vector along the baseline (x-axis).
      // this is used instead the create a more accurate angle excluding the size of the triangle
      const correctedAngle = isAnticlockwise ?
                             angleInRadians - arrowheadSubtentedAngle :
                             angleInRadians + arrowheadSubtentedAngle;

      // create the arc shape
      const arcShape = new Shape().arcPoint(
        this.revolvedPoint, radius, 0, this.arrowheadIncluded ? -correctedAngle : -angleInRadians, isAnticlockwise
      );

      this.arcPath.setShape( arcShape );

      // adjust the position and angle of arrowhead
      // rotate the arrowhead from the tip into the correct position from the original angle
      this.arrowheadPath.setRotation( isAnticlockwise ?
                                      -angleInRadians :
                                      -angleInRadians + Math.PI
      );

      // translate the tip of arrowhead to the tip of the arc.
      this.arrowheadPath.setTranslation(
        this.revolvedPoint.x + Math.cos( this.arrowheadIncluded ? correctedAngle : angleInRadians ) * radius,
        this.revolvedPoint.y - Math.sin( this.arrowheadIncluded ? correctedAngle : angleInRadians ) * radius
      );
    }

    /**
     * @param {number} angle - the angle of the arc arrow in degrees
     * @public
     */
    setAngle( angle ) {
      this.setAngleAndRadius( angle, this.radius, this.arrowheadIncluded );
    }

    /**
     * @param {number} radius - the radius of the arc arrow in view coordinates
     * @public
     */
    setRadius( radius ) {
      this.setAngleAndRadius( this.angle, radius, this.arrowheadIncluded );
    }

    /**
     * @param {boolean} visible
     * @private
     */
    setArrowheadVisibility( visible ) {
      this.arrowheadIncluded = visible;
      this.arrowheadPath.visible = visible;
    }
  }

  return vectorAddition.register( 'ArcArrowNode', ArcArrowNode );
} );

