// Copyright 2019, University of Colorado Boulder

/**
 * Create a node that represents the arrow and arc of an arc-arrow
 * Suppports negative angles
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

  // constants

  class ArcArrowNode extends Node {
    /**
     * Create a node that draws a arc-arrow arround the point (0, 0)
     * @param {Number} angle - the angle of the arc arrow in degrees
     * @param {Number} radius - the radius of the arc arrow
     * @param {Object} options
     */
    constructor( angle, radius, options ) {

      options = _.extend( {
        center: Vector2.ZERO, // {Vector2} the coordinates that the arc revolves around
        arrowheadWidth: 7, // {Number} the arrowhead width before translation
        arrowheadHeight: 5, // {Number} the arrowhead height before translation
        arcOptions: null, // {Object} filled in bellow
        arrrowOptions: null // {Object} filled in bellow
      }, options );

      // overide the arcOptions with the default provided bellow
      options.arcOptions = _.extend( {
        stroke: 'black'
      }, options.arcOptions );

      // overide the arrowOptions with the default provided bellow
      options.arrowOptions = _.extend( {
        fill: 'black'
      }, options.arrowOptions );

      super();

      // @public (read-only) {Object} the options provided by the user of the arc arrow
      this.options = options;

      // @public (read-only) {Number} the angle (degrees) that the arc arrow is at
      this.angle = angle;

      // @public (read-only) {Number} the radius of the arc
      this.radius = radius;

      // create a shape and a path for the arc of the angle
      const arcShape = new Shape();

      // @private {Path} the path for the arc shape
      this.arcPath = new Path( arcShape, options.arcOptions );

      // create the arrowhead shape of the arc
      const arrowheadShape = new Shape();

      // create the triangle 
      // define the top point of the triangle at (0, 0), the triangle will be translated/rotated later
      arrowheadShape.moveTo( 0, 0 )
        .lineTo( -1 * options.arrowheadWidth / 2, options.arrowheadHeight )
        .lineTo( options.arrowheadWidth / 2, options.arrowheadHeight )
        .close();

      // @private {Path} the path for the arrowHead shape
      this.arrowheadPath = new Path( arrowheadShape, options.arrowOptions );


      this.setChildren( [ this.arcPath, this.arrowheadPath ] );

      this.setAngleAndRadius( angle, radius );
    }

    /**
     * @param {Number} angle - the angle of the arc arrow in degrees
     * @param {Number} radius - the radius of the arc
     * @private
     */
    setAngleAndRadius( angle, radius ) {
      // reassign the properties
      this.angle = angle;
      this.radius = radius;
      const angleInRadians = Util.toRadians( angle );
      const isAnticlockwise = angle >= 0;

      // update the arc
      const arcShape = new Shape().arcPoint(
        this.options.center, radius, 0, -angleInRadians, isAnticlockwise
      );

      this.arcPath.setShape( arcShape );

      // update the triangle
      // translate and rotate the arrowhead into the correct position
      this.arrowheadPath.setRotation(
        isAnticlockwise ?
        -angleInRadians + Math.atan( this.options.arrowheadHeight / radius ) :
        -angleInRadians - Math.PI - Math.atan( this.options.arrowheadHeight / radius )
      );
      this.arrowheadPath.setTranslation(
        this.options.center.x + Math.cos( angleInRadians ) * radius,
        this.options.center.y - Math.sin( angleInRadians ) * radius
      );
    }

    /**
     * @param {Number} angle - the angle of the arc arrow in degrees
     * @public
     */
    setAngle( angle ) {
      this.setAngleAndRadius( angle, this.radius );
    }

    /**
     * @param {Number} radius - the radius of the arc arrow
     * @public
     */
    setRadius( radius ) {
      this.setAngleAndRadius( this.angle, radius );
    }


  }

  return vectorAddition.register( 'ArcArrowNode', ArcArrowNode );
} );

