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
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Easing = require( 'TWIXT/Easing' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionQueryParameters = require( 'VECTOR_ADDITION/common/VectorAdditionQueryParameters' );
  const VectorComponentModel = require( 'VECTOR_ADDITION/common/model/VectorComponentModel' );

  //----------------------------------------------------------------------------------------
  // constants
  const AVERAGE_ANIMATION_SPEED = 1500; // view coordinates per second
  const MIN_ANIMATION_TIME = 0.9; // in seconds

  // Interval spacing of vector angle (in degrees) when vector is in polar mode
  const ANGLE_INTERVAL = 5;

  // The tag of the vector when its active if and only if the user doesn't provide the tag option.
  // The reason this isn't translatable is: https://github.com/phetsims/vector-addition/issues/10.
  const FALLBACK_VECTOR_TAG = 'v';

  // The maximum amount of dragging before the vector will be removed from the graph when attempting to drag a vector.
  // See https://github.com/phetsims/vector-addition/issues/46
  const VECTOR_DRAG_THRESHOLD = VectorAdditionQueryParameters.vectorDragThreshold;
  
  // Rounding on the label
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;

  class VectorModel extends BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xComponent horizontal component of the vector
     * @param {number} yComponent vertical component of the vector
     * @param {Graph} the graph the vector belongs to
     * @param {VectorSet} the vectorSet that the vector belongs to
     * @param {Object} [options]
     */
    constructor( tailPosition, xComponent, yComponent, graph, vectorSet, options ) {

      options = _.extend( {
        tag: null, // {string|null} - the tag of the vector (i.e. 'a', 'b', 'c', ...). If null, the vector will display
        // a the fall back tag when its active

        isTipDraggable: true, // {boolean} - false means the tip won't be draggable

        isRemovable: true // {boolean} - false means the user will not be able to drag a vector off the graph
      }, options );


      assert && assert( !options.tag || typeof options.tag === 'string', `invalid options.tag: ${options.tag}` );
      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid options.isTipDraggable: ${options.isTipDraggable}` );
      assert && assert( typeof options.isRemovable === 'boolean',
        `invalid options.isRemovable: ${options.isRemovable}` );

      //----------------------------------------------------------------------------------------

      super( tailPosition, xComponent, yComponent, vectorSet.vectorGroup, options.tag );

      // @public (read-only) {boolean}
      this.isTipDraggable = options.isTipDraggable;

      // @public (read-only) {boolean}
      this.isRemovable = options.isRemovable;

      // @public (read-only)
      this.tag = options.tag;

      // @private {Graph}
      this.graph = graph;

      // @public (read-only)
      this.coordinateSnapMode = vectorSet.coordinateSnapMode;

      //----------------------------------------------------------------------------------------
      // Properties for the 'Inspect a Vector' panel

      // @public (read-only) {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.vectorComponentsProperty ], () => ( this.magnitude ) );

      // @public (read-only) {DerivedProperty.<number|null>} - the angle (in degrees) of the vector.
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleDegreesProperty = new DerivedProperty( [ this.vectorComponentsProperty ], () => {
        return ( this.vectorComponents.equalsEpsilon( Vector2.ZERO, 1e-7 ) ) ? null : Util.toDegrees( this.angle );
      } );

      // @public (read-only) {DerivedProperty.<number>} - the xComponent property
      this.xComponentProperty = new DerivedProperty( [ this.vectorComponentsProperty ], () => ( this.xComponent ) );

      // @public (read-only) {DerivedProperty.<number>} - the yComponent property
      this.yComponentProperty = new DerivedProperty( [ this.vectorComponentsProperty ], () => ( this.yComponent ) );

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

      // @public (read only) {VectorComponentModel}
      this.xVectorComponentModel = new VectorComponentModel( this,
        vectorSet.componentStyleProperty,
        graph.activeVectorProperty,
        VectorComponentModel.COMPONENT_TYPES.X_COMPONENT, );

      // @public (read only) {VectorComponentModel}
      this.yVectorComponentModel = new VectorComponentModel( this,
        vectorSet.componentStyleProperty,
        graph.activeVectorProperty,
        VectorComponentModel.COMPONENT_TYPES.Y_COMPONENT, );

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

      this.xVectorComponentModel.dispose();
      this.yVectorComponentModel.dispose();

      this.isOnGraphProperty.dispose();

      this.stopAnimation();
      this.inProgressAnimationProperty.dispose();

      super.dispose();
    }

    /**
     * @override
     * See BaseVectorModel.getLabelContent for documentation and context
     *
     * Gets the label content information to display the vector model. Vector's may or may not have tags.
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    prefix: {string|null} // the prefix (e.g. if the label displayed |v|=15, the prefix would be '|v|')
     *    value: {string|null} // the suffix (e.g. if the label displayed |v|=15, the value would be '=15')
     * }
     */
    getLabelContent( valuesVisible ) {

      // Get the rounded magnitude
      const roundedMagnitude = Util.toFixed( this.magnitude, VECTOR_VALUE_ROUNDING );

      const displayLabel = this.tag ? this.tag : FALLBACK_VECTOR_TAG;

      let prefix;
      let value;

      // If the graph's active vector is this vector or it has a tag, display the tag
      if ( this.graph.activeVectorProperty.value === this || this.tag ) {
        prefix = displayLabel;
      }
      // If the values are on and its not 0 magnitude, display the magnitude
      if ( valuesVisible ) {
        value = Math.abs( roundedMagnitude ) > 0 ? roundedMagnitude : null;
      }
      return {
        prefix: prefix,
        value: value
      };
    }

    /*---------------------------------------------------------------------------*
     * The following are methods to drag the vector
     *---------------------------------------------------------------------------*/
    /**
     * Called when the tip is being dragged.
     * @param {Vector2} tipPosition - attempts to drag the tip to this position, but rounds it in cartesian/polar style
     * and updates the model tip
     * @public
     */
    dragTipToPosition( tipPosition ) {

      assert && assert( !this.inProgressAnimationProperty.value, 'Cannot drag tip when vector is animating' );
      assert && assert( this.isOnGraphProperty.value, 'Cannot drag tip when vector isn\'t on the graph' );
      assert && assert( tipPosition instanceof Vector2, `invalid tipPosition: ${tipPosition}` );

      // Declare this vector as active when it's dragging
      this.graph.activeVectorProperty.value = this;

      if ( tipPosition.minus( this.tail ).roundSymmetric().magnitude === 0 ) { // do not allow vector to be 0 magnitude
        return;
      }

      if ( this.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

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
      else if ( this.coordinateSnapMode === CoordinateSnapModes.POLAR ) {
        const vectorComponents = tipPosition.minus( this.tail );

        const roundedMagnitude = Util.roundSymmetric( vectorComponents.magnitude );

        const angleInRadians = Util.toRadians( ANGLE_INTERVAL );
        const roundedAngle = angleInRadians * Util.roundSymmetric( vectorComponents.angle / angleInRadians );

        // Calculate the rounded polar vector
        const polarVector = vectorComponents.setPolar( roundedMagnitude, roundedAngle );

        // Ensure that the new polar vector is in the bounds. Subtract one from the magnitude until the vector is inside.
        while ( !this.graph.graphModelBounds.containsPoint( this.tail.plus( polarVector ) ) ) {
          polarVector.setMagnitude( polarVector.magnitude - 1 );
        }
        // Update the model tip
        this.tip = this.tail.plus( polarVector );
      }
    }

    /**
     * Called when the tail is being dragged.
     * @param {Vector2} tailPosition - attempts to drag the tail to this position, but rounds it and ensures validity of
     * the vector after the drag.
     * @public
     */
    dragTailToPosition( tailPosition ) {

      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( this.isOnGraphProperty.value === true, 'should be in graph to drag' );
      assert && assert( !this.inProgressAnimationProperty.value, 'can\'t drag vector when animating' );

      // Ensure that the tail is on the graph
      this.moveVectorTailToFitInGraph( tailPosition );

      const constrainedBounds = this.getConstrainedTailBounds();

      // Declare this vector as active when it's dragging
      this.graph.activeVectorProperty.value = this;
      /*---------------------------------------------------------------------------*
       * Remove vectors
       *---------------------------------------------------------------------------*/
      if ( this.isRemovable === false ) {
        return;
      }

      // Offset of the cursor to the vector. This is users will remove vector according to displacement of the cursor.
      // See https://github.com/phetsims/vector-addition/issues/46
      const dragOffset = constrainedBounds.closestPointTo( tailPosition ).minus( tailPosition );

      if ( Math.abs( dragOffset.x ) > VECTOR_DRAG_THRESHOLD || Math.abs( dragOffset.y ) > VECTOR_DRAG_THRESHOLD ) {
        this.isOnGraphProperty.value = false;
        this.graph.activeVectorProperty.value = null; // No longer the active vector
      }
    }

    /*---------------------------------------------------------------------------*
     * Private helper methods
     *---------------------------------------------------------------------------*/
    /**
     * Updates the tail such that both tail and tip of the vector remain with the graphBounds.
     * @param {Vector2} tailPosition - attempts to place the vector's tail to this point, but ensures it's validity
     * @private
     */
    moveVectorTailToFitInGraph( tailPosition ) {

      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( this.isOnGraphProperty.value === true, 'should be in graph to fit in to graph' );
      assert && assert( !this.inProgressAnimationProperty.value, 'can\'t move vector when animating' );

      const constrainedBounds = this.getConstrainedTailBounds();
      // Translate the tail to ensure it stays in the contained bounds
      this.translateToPoint( constrainedBounds.closestPointTo( tailPosition ).roundedSymmetric() );
    }

    /**
     * Gets the constrained bounds of the tail. In other words, based on the tip and the components of the vector, this
     * return a new bounds that are for the tail and ensures that in this bounds the vector will stay in the graph.
     * @private
     */
    getConstrainedTailBounds() {

      // Sift the bounds the attributes vector. This is the furthest the vector tail can drag.
      const constrainedBounds = this.graph.graphModelBounds.shifted( -this.vectorComponents.x,
        -this.vectorComponents.y );

      // Since it was shifted, return the intersection
      return this.graph.graphModelBounds.intersection( constrainedBounds );
    }

    /*---------------------------------------------------------------------------*
     * The following are methods to control the state of the vector (animate, drop, etc.)
     *---------------------------------------------------------------------------*/
    /**
     * Animates the vector to a specific point. Called when the user fails to drop the vector in the graph.
     * @param {Vector2} point
     * @param {Vector2} iconVectorComponents
     * @param {function} finishedCallback - callback if and only if the animation finishes
     * @public
     */
    animateToPoint( point, iconVectorComponents, finishedCallback ) {

      assert && assert( !this.inProgressAnimationProperty.value,
        'Can\'t animate to position when we are in animation currently' );
      assert && assert( !this.isOnGraphProperty.value, 'Can\'t animate when the vector is on the graph' );

      assert && assert( point instanceof Vector2, `invalid point: ${point}` );
      assert && assert( iconVectorComponents instanceof Vector2,
        `invalid iconVectorComponents: ${iconVectorComponents}` );
      assert && assert( typeof finishedCallback === 'function', `invalid finishedCallback: ${finishedCallback}` );

      //----------------------------------------------------------------------------------------

      // Convert the parameter into where the tail would be in that position
      const tailPosition = point.minus( iconVectorComponents.timesScalar( 0.5 ) );

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
          property: this.vectorComponentsProperty,
          easing: Easing.CUBIC_IN_OUT,
          to: iconVectorComponents
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
     * @param {Vector2} tailPosition - the tail position to drop the vector onto
     * @public
     */
    dropOntoGraph( tailPosition ) {

      assert && assert( !this.isOnGraphProperty.value, 'vector is already on the graph' );
      assert && assert( !this.inProgressAnimationProperty.value, 'cannot drop vector when it\'s animating' );

      this.isOnGraphProperty.value = true;

      this.moveVectorTailToFitInGraph( tailPosition );

      // Declare this vector as active
      this.graph.activeVectorProperty.value = this;
    }
  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );