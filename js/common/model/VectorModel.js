// Copyright 2019, University of Colorado Boulder

/**
 * Model for a vector.
 *
 * Extends RootVectorModel but adds more functionality:
 *  - update the tail when the origin moves (modelViewTransformProperty)
 *  - methods to drop a vector, to animate a vector, and to pop a vector off the graph
 *  - ability to drag the vector by the tail and the tip
 *  - instantiate x and y component models
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Easing = require( 'TWIXT/Easing' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Property = require( 'AXON/Property' );
  const RootVectorModel = require( 'VECTOR_ADDITION/common/model/RootVectorModel' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionQueryParameters = require( 'VECTOR_ADDITION/common/VectorAdditionQueryParameters' );
  const VectorComponentModel = require( 'VECTOR_ADDITION/common/model/VectorComponentModel' );

  // constants
  const AVERAGE_ANIMATION_SPEED = 1600; // in model coordinates
  const MIN_ANIMATION_TIME = 0.9; // in seconds

  // interval spacing of vector angle (in degrees) when vector is in polar mode
  const POLAR_ANGLE_INTERVAL = VectorAdditionConstants.POLAR_ANGLE_INTERVAL;

  // fall back tag for the vector model if a tag isn't provided. The reason this isn't translatable is:
  // https://github.com/phetsims/vector-addition/issues/10.
  const VECTOR_FALL_BACK_TAG = 'v';

  // maximum amount of dragging before the vector will be removed from the graph when attempting to drag a vector.
  // See https://github.com/phetsims/vector-addition/issues/46 for more context.
  const VECTOR_DRAG_THRESHOLD = VectorAdditionQueryParameters.vectorDragThreshold;

  // rounding for the vector value (on the label with values checked)
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;


  class VectorModel extends RootVectorModel {
    /**
     * @constructor
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Vector2} initialComponents - starting components of the vector
     * @param {Graph} graph - the graph the vector belongs to
     * @param {VectorGroups} vectorGroup - the vector group
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     * @param {Object} [options] - various key-value pairs that control behavior. All options are specific to this class
     */
    constructor( initialTailPosition, initialComponents, graph, vectorGroup, tag, options ) {

      options = _.extend( {
        isTipDraggable: true, // {boolean} - false means the tip won't be draggable

        isRemovable: true // {boolean} - false means the user will not be able to drag a vector off the graph
      }, options );

      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid options.isTipDraggable: ${options.isTipDraggable}` );
      assert && assert( typeof options.isRemovable === 'boolean',
        `invalid options.isRemovable: ${options.isRemovable}` );

      //----------------------------------------------------------------------------------------
      super( initialTailPosition, initialComponents, vectorGroup, tag );

      // @public (read-only) {boolean} isTipDraggable
      this.isTipDraggable = options.isTipDraggable;

      // @public (read-only) {boolean} isRemovable
      this.isRemovable = options.isRemovable;

      // @public (read-only) coordinateSnapMode
      this.coordinateSnapMode = graph.coordinateSnapMode;

      // @private {Graph} graph
      this.graph = graph;

      // @private {string} fallBackTag (see declaration of VECTOR_FALL_BACK_TAG for documentation)
      this.fallBackTag = VECTOR_FALL_BACK_TAG;

      //----------------------------------------------------------------------------------------

      // Function to update the position of the tail of the vector based on the modelViewTransform
      const updateTailPosition = ( newModelViewTransform, oldModelViewTransform ) => {
        const oldTailLocation = oldModelViewTransform.modelToViewPosition( this.tail );
        this.translateTailToPoint( newModelViewTransform.viewToModelPosition( oldTailLocation ) );
      };

      this.graph.modelViewTransformProperty.lazyLink( updateTailPosition );

      // @private - unlink the modelViewTransform link, called in the dispose method
      this.unlinkTailUpdateListener = () => {
        this.graph.modelViewTransformProperty.unlink( updateTailPosition );
      };

      //----------------------------------------------------------------------------------------
      // Vector Component Models

      // @public (read only) {VectorComponentModel} xVectorComponentModel
      this.xVectorComponentModel = new VectorComponentModel( this,
        graph.componentStyleProperty,
        graph.activeVectorProperty,
        VectorComponentModel.COMPONENT_TYPES.X_COMPONENT );

      // @public (read only) {VectorComponentModel} yVectorComponentModel
      this.yVectorComponentModel = new VectorComponentModel( this,
        graph.componentStyleProperty,
        graph.activeVectorProperty,
        VectorComponentModel.COMPONENT_TYPES.Y_COMPONENT );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {BooleanProperty} isOnGraphProperty - indicates if the vector is in the play area
      this.isOnGraphProperty = new BooleanProperty( false );

      // @public (read-only) {Property.<Animation|null>} inProgressAnimationProperty - tracks any animation that is
      // currently in progress.
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

      this.unlinkTailUpdateListener();

      this.xVectorComponentModel.dispose();
      this.yVectorComponentModel.dispose();

      this.isOnGraphProperty.dispose();

      if ( this.inProgressAnimationProperty.value ) {
        this.inProgressAnimationProperty.value.stop();
      }
      this.inProgressAnimationProperty.dispose();

      super.dispose();
    }

    /**
     * @override
     * See RootVectorModel.getLabelContent() for context
     *
     * Gets the label content information to display the vector model. Vector's may or may not have tags.
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    coefficient: {string|null} // the coefficient (e.g. if the label displayed '3|v|=15', the coefficient would be
     *                               // 3). Null means it doesn't display a coefficient
     *    tag: {string|null} // the tag (e.g. if the label displayed '3|v|=15', the tag would be '|v|')
     *                       // Null means it doesn't display a tag
     *    value: {string|null} // the suffix (e.g. if the label displayed '3|v|=15', the value would be '=15')
     *                         // Null means it doesn't display a value
     * }
     */
    getLabelContent( valuesVisible ) {

      // Get the rounded magnitude
      const roundedMagnitude = Util.toFixed( this.magnitude, VECTOR_VALUE_ROUNDING );

      // indicates if the rounded magnitude is 0
      const isRoundedMagnitudeZero = !( Math.abs( roundedMagnitude ) > 0 );

      let tag;
      let value;

      // If it has a tag, the tag is always the tag
      if ( this.tag ) {
        tag = this.tag;
      }
      // Otherwise (no tag) only display the vector tag if its active
      else if ( this.graph.activeVectorProperty.value === this ) {
        tag = this.fallBackTag;
      }

      // If the values are on and its not 0 magnitude, display the magnitude
      if ( valuesVisible ) {
        if ( tag ) {
          value = !isRoundedMagnitudeZero ? ` = ${roundedMagnitude}` : null;
        }
        else {
          value = !isRoundedMagnitudeZero ? roundedMagnitude : null;
        }
      }

      return {
        coefficient: null,
        tag: value && tag ? `|${tag}|` : tag,
        value: value
      };
    }

    /**
     * Attempts to move the tip to this position but rounds it in cartesian/polar style
     * @param {Vector2} tipPosition
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

        const angleInRadians = Util.toRadians( POLAR_ANGLE_INTERVAL );
        const roundedAngle = angleInRadians * Util.roundSymmetric( vectorComponents.angle / angleInRadians );

        // Calculate the rounded polar vector
        const polarVector = vectorComponents.setPolar( roundedMagnitude, roundedAngle );

        // Ensure that the new polar vector is in the bounds. Subtract one from the magnitude until the vector is inside
        while ( !this.graph.graphModelBounds.containsPoint( this.tail.plus( polarVector ) ) ) {
          polarVector.setMagnitude( polarVector.magnitude - 1 );
        }
        // Update the model tip
        this.tip = this.tail.plus( polarVector );
      }
    }

    /**
     * Attempts to drag the tail to this position, but rounds it and ensures validity or the vector.
     * @param {Vector2} tailPosition
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
      // See https://github.com/phetsims/vector-addition/issues/46#issuecomment-506726262
      const dragOffset = constrainedBounds.closestPointTo( tailPosition ).minus( tailPosition );

      if ( Math.abs( dragOffset.x ) > VECTOR_DRAG_THRESHOLD || Math.abs( dragOffset.y ) > VECTOR_DRAG_THRESHOLD ) {
        this.popOffOfGraph();
      }
    }

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
      this.translateTailToPoint( constrainedBounds.closestPointTo( tailPosition ).roundedSymmetric() );
    }

    /**
     * Gets the constrained bounds of the tail. In other words, based on the tip and the components of the vector, this
     * return a new bounds that is for the tail and ensures that in this bounds the vector will stay in the graph.
     *
     * See https://user-images.githubusercontent.com/42391580/60908828-065be780-a23a-11e9-9a02-01a6ca52f73d.png
     * for an annotated image.
     *
     * @private
     */
    getConstrainedTailBounds() {

      // Sift the bounds the components vector. This is the furthest the vector tail can drag.
      const shiftedBounds = this.graph.graphModelBounds.shifted( -this.vectorComponents.x,
        -this.vectorComponents.y );

      // Since it was shifted, return the intersection
      return this.graph.graphModelBounds.intersection( shiftedBounds );
    }

    /**
     * Animates the vector to a specific point. Called when the user fails to drop the vector in the graph.
     * @public
     * @param {Vector2} point - animates the center of the vector to this point
     * @param {Vector2} finalComponents - animates the components to the final components
     * @param {function} finishedCallback - callback if and only if the animation finishes
     */
    animateToPoint( point, finalComponents, finishedCallback ) {

      assert && assert( !this.inProgressAnimationProperty.value,
        'Can\'t animate to position when we are in animation currently' );
      assert && assert( !this.isOnGraphProperty.value, 'Can\'t animate when the vector is on the graph' );

      assert && assert( point instanceof Vector2, `invalid point: ${point}` );
      assert && assert( finalComponents instanceof Vector2,
        `invalid finalComponents: ${finalComponents}` );
      assert && assert( typeof finishedCallback === 'function', `invalid finishedCallback: ${finishedCallback}` );

      //----------------------------------------------------------------------------------------

      // Convert the parameter into where the tail would be in that position
      const tailPosition = point.minus( finalComponents.timesScalar( 0.5 ) );

      // Animate the vector
      const animation = new Animation( {
        duration: Math.max( MIN_ANIMATION_TIME, // d/t = s => t = d/s
          this.tail.distance( tailPosition ) / AVERAGE_ANIMATION_SPEED
        ),
        targets: [ {
          property: this.tailPositionProperty,
          easing: Easing.QUADRATIC_IN_OUT,
          to: tailPosition
        }, {
          property: this.vectorComponentsProperty,
          easing: Easing.QUADRATIC_IN_OUT,
          to: finalComponents
        } ]
      } ).start();

      this.inProgressAnimationProperty.value = animation;

      const animationFinished = () => {
        this.inProgressAnimationProperty.value = null;
        finishedCallback();

        // Remove listener
        animation.finishEmitter.removeListener( animationFinished );
      };

      animation.finishEmitter.addListener( animationFinished );
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

      this.dragTipToPosition( this.tip );
      // Declare this vector as active
      this.graph.activeVectorProperty.value = this;
    }

    /**
     * Removes the vector from the graph.
     * @public
     */
    popOffOfGraph() {
      this.isOnGraphProperty.value = false;
      this.graph.activeVectorProperty.value = null;
    }
  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );