// Copyright 2019, University of Colorado Boulder

/**
 * View for an arrow that is curved. Used in various other views throughout the sim.
 *
 * A solution using `SCENERY-PHET/CurvedArrowShape` was investigated. See
 * https://user-images.githubusercontent.com/42391580/61176588-88247b80-a580-11e9-96e4-b14e4d8e1212.png for an
 * explanation.
 *
 * ## Other functionality:
 *  - The Arrowhead turns invisible when the angle becomes too small (i.e. the triangle is larger than the arc)
 *  - The arrow is assumed to start at 0 rad.
 *  - Contains methods to change the radius
 *  - Contains methods to change the angle
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );

  class CurvedArrowNode extends Node {

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
        `Extra prototype on Options: ${options}` );

      options = _.extend( {

        arrowheadWidth: 9.75, // {number} the arrowhead width (before rotation)
        arrowheadHeight: 7.2, // {number} the arrowhead height (before rotation)

        arcOptions: null, // {Object|null} defaults filled in bellow
        arrowOptions: null // {Object|null} defaults filled in bellow,

      }, options );

      options.arcOptions = _.extend( {
        stroke: VectorAdditionColors.BLACK,
        lineWidth: 1.75
      }, options.arcOptions );

      options.arrowOptions = _.extend( {
        fill: VectorAdditionColors.BLACK
      }, options.arrowOptions );

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

      super( {
        children: [ arcPath, arrowheadPath ]
      } );

      // @private {NumberProperty} radiusProperty
      this.radiusProperty = new NumberProperty( radius );

      // @private {NumberProperty} angleProperty
      this.angleProperty = new NumberProperty( angle );

      //----------------------------------------------------------------------------------------
      // Create the function that updates the arrow node. Called when the angle and/or the radius changes
      //----------------------------------------------------------------------------------------
      const updateArrowNode = ( angle, radius ) => {

        //----------------------------------------------------------------------------------------
        // See https://user-images.githubusercontent.com/42391580/61176905-1e0ed500-a586-11e9-992b-d96757a6331b.png
        // for an annotated drawing of how the subtended angle and the corrected angle are calculated
        //----------------------------------------------------------------------------------------

        // The arrowhead subtended angle is defined as the angle between the vector from the center to the tip of the
        // arrow and the vector of the center to first point the arc and the triangle intersect
        const arrowheadSubtentedAngle = Math.asin( options.arrowheadHeight / radius );

        // Flag that indicates if the arc is anticlockwise (measured from positive x-axis) or clockwise.
        const isAnticlockwise = angle >= 0;

        // The corrected angle is the angle that is between the vector that goes from the center to the first point the
        // arc and the triangle intersect and the vector along the baseline (x-axis). This is used instead to create a
        // more accurate angle excluding the size of the triangle. Again, look at the drawing above.
        const correctedAngle = isAnticlockwise ?
                               angle - arrowheadSubtentedAngle :
                               angle + arrowheadSubtentedAngle;

        // Change the arrowhead visibility to false when the angle is too small relative to the subtended angle and true
        // otherwise
        arrowheadPath.visible = Math.abs( angle ) > arrowheadSubtentedAngle;

        // Create the arc shape
        const arcShape = new Shape().arcPoint( Vector2.ZERO,
          radius,
          0,
          arrowheadPath.visible ? -correctedAngle : -angle, isAnticlockwise );
        arcPath.setShape( arcShape );


        if ( arrowheadPath.visible ) {

          // Adjust the position and angle of arrowhead. Rotate the arrowhead from the tip into the correct position
          // from the original angle
          arrowheadPath.setRotation( isAnticlockwise ? -angle : -angle + Math.PI );

          // Translate the tip of the arrowhead to the tip of the arc.
          arrowheadPath.setTranslation(
            Math.cos( arrowheadPath.visible ? correctedAngle : angle ) * radius,
            -Math.sin( arrowheadPath.visible ? correctedAngle : angle ) * radius
          );
        }
      };

      // @private {Multilink} updateNodeMultilink
      this.updateNodeMultilink = Property.multilink( [ this.angleProperty, this.radiusProperty ], updateArrowNode );
    }

    /**
     * Disposes the curved arrow node
     * @override
     * @public
     */
    dispose() {
      Property.unmultilink( this.updateNodeMultilink );
    }

    /**
     * Sets the angle of the arc.
     * @public
     *
     * @param {number} angle - the end angle (in radians) of the curved arrow. The arrow is assumed to start at 0
     *                         radians.
     */
    set angle( angle ) {

      assert && assert( typeof angle === 'number', `invalid angle: ${angle}` );
      this.angleProperty.value = angle;
    }

    /**
     * Sets the radius of the arc.
     * @public
     *
     * @param {number} radius - the radius of curved arrow.
     */
    set radius( radius ) {

      assert && assert( typeof radius === 'number' && radius > 0, `invalid radius: ${radius}` );
      this.radiusProperty.value = radius;
    }

    /**
     * Gets the radius of the arc
     * @public
     */
    get radius() {
      return this.radiusProperty.value;
    }
  }

  return vectorAddition.register( 'CurvedArrowNode', CurvedArrowNode );
} );