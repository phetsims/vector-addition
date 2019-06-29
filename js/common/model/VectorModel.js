// Copyright 2019, University of Colorado Boulder

/**
 * Model for a 'normal' vector (vector that is dropped onto the graph)
 *
 * This extends BaseVector and adds dragging features as well as updating the tail
 * when the origin is moved.
 *
 * This vector also instantiates the XVectorComponent and YVectorComponent models.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Easing = require( 'TWIXT/Easing' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const XVectorComponent = require( 'VECTOR_ADDITION/common/model/XVectorComponent' );
  const YVectorComponent = require( 'VECTOR_ADDITION/common/model/YVectorComponent' );
  
  // constants

  // interval spacing of vector angle (in degrees) when vector is in polar mode
  const ANGLE_INTERVAL = 5;

  // The label of the vector when its active if and only if the user doesn't provide the label option.
  // The reason this isn't translatable is: https://github.com/phetsims/vector-addition/issues/10.
  const FALLBACK_VECTOR_LABEL = 'v';

  const AVERAGE_ANIMATION_SPEED = 1500; // view coordinates per second
  const MIN_ANIMATION_TIME = 0.9; // in seconds


  class VectorModel extends BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xComponent horizontal component of the vector
     * @param {number} yComponent vertical component of the vector
     * @param {VectorSet} the vectorSet that the vector belongs to
     * @param {Graph} the graph the vector belongs to
     * @param {Object} [options]
     */
    constructor( tailPosition, xComponent, yComponent, graph, vectorSet, options ) {

      options = _.extend( {
        label: null, // {string|null} - the label of the vector. If null, the vector will display a the fallback label
        // when its active

        isTipDraggable: true // {boolean} - false means the tip won't be draggable
      }, options );


      assert && assert( !options.label || typeof options.label === 'string',
        `invalid options.label: ${options.label}` );
      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid options.isTipDraggable: ${options.isTipDraggable}` );

      //----------------------------------------------------------------------------------------

      super( tailPosition, xComponent, yComponent, vectorSet.vectorGroup );

      // @public (read-only) {boolean}
      this.isTipDraggable = options.isTipDraggable;

      // @public (read-only)
      this.label = options.label;

      // @protected
      this.fallbackLabel = FALLBACK_VECTOR_LABEL;

      // @private {Graph}
      this.graph = graph;

      //----------------------------------------------------------------------------------------
      // Properties for the 'Inspect a Vector' panel

      // @public (read-only) {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => ( this.magnitude ) );

      // @public (read-only) {DerivedProperty.<number|null>} - the angle (in degrees) of the vector.
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleDegreesProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => {
        return ( this.attributesVector.equalsEpsilon( Vector2.ZERO, 1e-7 ) ) ? null : Util.toDegrees( this.angle );
      } );

      // @public (read-only) {DerivedProperty.<number>} - the xComponent property
      this.xComponentProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => ( this.xComponent ) );

      // @public (read-only) {DerivedProperty.<number>} - the yComponent property
      this.yComponentProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => ( this.yComponent ) );

      //----------------------------------------------------------------------------------------

      // Function to update the position of the tail of the vector based on the modelViewTransform
      const updateTailPosition = ( newModelViewTransform, oldModelViewTransform ) => {
        const oldTailViewPosition = oldModelViewTransform.modelToViewPosition( this.tailPositionProperty.value );
        this.translateToPoint( newModelViewTransform.viewToModelPosition( oldTailViewPosition ) );
      };

      this.graph.modelViewTransformProperty.lazyLink( updateTailPosition );

      // @private - unlink the modelViewTransform link, called in the dispose method
      this.unlinkTailUpdateListener = () => {
        this.graph.modelViewTransformProperty.unlink( updateTailPosition );
      };

      //----------------------------------------------------------------------------------------
      // Vector Components

      // @public (read only) {XVectorComponent}
      this.xVectorComponent = new XVectorComponent( this, vectorSet.componentStyleProperty );

      // @public (read only) {YVectorComponent}
      this.yVectorComponent = new YVectorComponent( this, vectorSet.componentStyleProperty );
    
      //----------------------------------------------------------------------------------------
      // Vector states

      // @public (read-only) {BooleanProperty} - indicates if the vector is in the play area
      this.isOnGraphProperty = new BooleanProperty( false );

      // @public (read-only) {Property.<Animation|null>} - tracks any animation that is currently in progress.
      this.inProgressAnimationProperty = new Property( null, {
        isValidValue: ( value ) => {
          return value === null || value instanceof Animation;
        }
      } );

    }

    /**
     * Disposes the vector. Called when the vector is removed from the graph. This can be done by either
     * animating the vector back to the vector creator panel or by hitting the eraser/reset all button.
     * @public
     * @override
     */
    dispose() {

      this.magnitudeProperty.dispose();
      this.angleDegreesProperty.dispose();
      this.xComponentProperty.dispose();
      this.yComponentProperty.dispose();

      this.unlinkTailUpdateListener();

      this.xVectorComponent.dispose();
      this.yVectorComponent.dispose();

      this.isOnGraphProperty.dispose();

      this.stopAnimation();
      this.inProgressAnimationProperty.dispose();

      super.dispose();
    }

    /**
     * Called when the tip is dragged in the cartesian scene. Cartesian mode is defined as having integer x and y
     * components.
     * @param {Vector2} tipPosition - attempts to drag the tip to this position, but rounds it in cartesian style and
     * updates the model tip
     * @public
     */
    dragTipInCartesian( tipPosition ) {

      assert && assert( !this.inProgressAnimationProperty.value, 'Cannot drag tip when vector is animating' );
      assert && assert( this.isOnGraphProperty.value, 'Cannot drag tip when vector isn\'t on the graph' );
      assert && assert( tipPosition instanceof Vector2, `invalid tipPosition: ${tipPosition}` );


      // Ensure that the tipPosition is on the graph
      const tipPositionOnGraph = this.graph.graphModelBounds.closestPointTo( tipPosition );

      // Rounded the tip to integer grid values
      const roundedTipPosition = tipPositionOnGraph.roundedSymmetric();

      // Get the components of the vector
      const vectorComponents = roundedTipPosition.minus( this.tail );

      // Based on the vector orientation, constrain the dragging components
      if ( this.graph.orientation === GraphOrientations.HORIZONTAL ) {
        vectorComponents.setY( 0 );
      }
      else if ( this.graph.orientation === GraphOrientations.VERTICAL ) {
        vectorComponents.setX( 0 );
      }

      // Update the model tip
      this.tip = this.tail.plus( vectorComponents );
    }

    /**
     * Called when the tip is dragged in the polar scene. Polar mode is defined as having and integer magnitude and
     * having the angle be a multiple of 5
     * @param {Vector2} tipPosition - attempts to drag the tip to this position, but rounds it in polar style and
     * updates the model tip
     * @public
     */
    dragTipInPolar( tipPosition ) {

      assert && assert( !this.inProgressAnimationProperty.value, 'Cannot drag tip when vector is animating' );
      assert && assert( this.isOnGraphProperty.value, 'Cannot drag tip when vector isn\'t on the graph' );
      assert && assert( tipPosition instanceof Vector2, `invalid tipPosition: ${tipPosition}` );

      const vectorAttributes = tipPosition.minus( this.tail );

      const roundedMagnitude = Util.roundSymmetric( vectorAttributes.magnitude );

      const angleInRadians = Util.toRadians( ANGLE_INTERVAL );
      const roundedAngle = angleInRadians * Util.roundSymmetric( vectorAttributes.angle / angleInRadians );

      // Calculate the rounded polar vector
      const polarVector = vectorAttributes.setPolar( roundedMagnitude, roundedAngle );

      // Ensure that the new polar vector is in the bounds. Subtract one from the magnitude until the vector is inside.
      while ( !this.graph.graphModelBounds.containsPoint( this.tail.plus( polarVector ) ) ) {
        polarVector.setMagnitude( polarVector.magnitude - 1 );
      }
      // Update the model tip
      this.tip = this.tail.plus( polarVector );
    }

    /**
     * Updates the tail such that both tail and tip of the vector remain with the graphBounds. Called when the vector
     * body is being translated.
     * @param {Vector2} tailPosition - attempts to place the vector's tail to this point, but ensures it's validity
     * @public
     */
    moveVectorToFitInGraph( tailPosition ) {

      // Determine the bounds of the tails
      const tailBounds = this.graph.graphModelBounds;

      // Determine the bounds such for tip would remain within the graph
      const tipBounds = this.graph.graphModelBounds.shifted( -this.attributesVector.x, -this.attributesVector.y );

      // Find the intersection of the two previous bounds
      const constrainedBounds = tailBounds.intersection( tipBounds );

      // Translate the tail to ensure it stays in the contained bounds
      this.translateToPoint( constrainedBounds.closestPointTo( tailPosition ).roundedSymmetric() );
    }

    /**
     * Animates the vector to a specific point. Called when the user fails to drop the vector in the graph.
     * @param {Vector2} point
     * @param {Vector2} iconAttributesVector
     * @param {function} finishedCallback - callback if and only if the animation finishes
     * @public
     */
    animateToPoint( point, iconAttributesVector, finishedCallback ) {


      assert && assert( !this.inProgressAnimationProperty.value,
        'Can\'t animate to position when we are in animation currently' );
      assert && assert ( !this.isOnGraphProperty.value, 'Can\'t animate when the vector is on the graph' );

      assert && assert( point instanceof Vector2, `invalid point: ${point}` );
      assert && assert( iconAttributesVector instanceof Vector2,
        `invalid iconAttributesVector: ${iconAttributesVector}` );
      assert && assert( typeof finishedCallback === 'function', `invalid finishedCallback: ${finishedCallback}` );

      //----------------------------------------------------------------------------------------

      // Convert the parameter into where the tail would be in that position
      const tailPosition = point.minus( iconAttributesVector.timesScalar( 0.5 ) );

      // Animate the vector
      const animation = new Animation( {
        duration: Math.max( MIN_ANIMATION_TIME,
          this.tail.distance( tailPosition ) / AVERAGE_ANIMATION_SPEED
        ),
        targets: [ {
          property: this.tailPositionProperty,
          easing: Easing.CUBIC_IN_OUT,
          to: tailPosition
        }, {
          property: this.attributesVectorProperty,
          easing: Easing.CUBIC_IN_OUT,
          to: iconAttributesVector
        } ]
      } ).start();

      this.inProgressAnimationProperty.value = animation;

      const animationFinished = () => {
        this.inProgressAnimationProperty.value = null;
        finishedCallback();

        // Remove listeners
        animation.finishEmitter.removeListener( animationFinished );
      };

      animation.finishEmitter.addListener( animationFinished );
    }

    /**
     * Stops the current animation if one is happening, and does nothing if one isn't happening
     * @public
     */
    stopAnimation() {
      if ( this.inProgressAnimationProperty.value ) {
        this.inProgressAnimationProperty.value.stop();
        this.inProgressAnimationProperty.value = null;
      }
    }

    /**
     * Drops the vector onto the graph. Called at the end of the drag if the user drops the vector onto the graph.
     * @public
     */
    dropOntoGraph() {

      assert && assert( !this.isOnGraphProperty.value, 'vector is already on the graph' );
      assert && assert( !this.inProgressAnimationProperty.value, 'cannot drop vector when it\'s animating' );

      this.isOnGraphProperty.value = true;
    }
  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );