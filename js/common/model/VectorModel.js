// Copyright 2019, University of Colorado Boulder

/**
 * Model for a vector.
 *
 * Extends RootVectorModel but adds the following functionality:
 *  - update the tail when the origin moves (modelViewTransformProperty)
 *  - methods to drop a vector, to animate a vector, and to pop a vector off the graph
 *  - ability to drag the vector by the tail and the tip in both polar and cartesian mode
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

  //----------------------------------------------------------------------------------------
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

  // distance between a vector's tail or tip to another vector/s tail or tip to snap to the other vector in polar
  // mode. See https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit?ts=5ced51e9#
  const POLAR_SNAP_DISTANCE = VectorAdditionQueryParameters.polarSnapDistance;

  // rounding for the vector value (on the label with values checked)
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;


  class VectorModel extends RootVectorModel {

    /**
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Vector2} initialComponents - starting components of the vector
     * @param {Graph} graph - the graph the vector belongs to
     * @param {VectorSet} vectorSet - the vector set the vector belongs to
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     * @param {Object} [options]
     */
    constructor( initialTailPosition, initialComponents, graph, vectorSet, tag, options ) {

      options = _.extend( {

        isTipDraggable: true, // {boolean} - false means the tip won't be draggable, true means the tip can be dragged
        isRemovable: true, // {boolean} - false means the user will not be able to drag a vector off the graph
        isOnGraphInitially: false // {boolean} - flag indicating if the vector is on the graph upon initialization

      }, options );

      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid options.isTipDraggable: ${options.isTipDraggable}` );
      assert && assert( typeof options.isRemovable === 'boolean',
        `invalid options.isRemovable: ${options.isRemovable}` );

      //----------------------------------------------------------------------------------------
      super( initialTailPosition, initialComponents, vectorSet.vectorGroup, tag );

      // @public (read-only) {boolean} isTipDraggable - indicates if the tip can be dragged
      this.isTipDraggable = options.isTipDraggable;

      // @public (read-only) {boolean} isRemovable - indicates if the vector can be removed
      this.isRemovable = options.isRemovable;

      // @public (read-only) coordinateSnapMode - indicates the coordinate snap mode
      this.coordinateSnapMode = graph.coordinateSnapMode;

      // @private {Graph} graph - indicates the graph the vector model belongs to
      this.graph = graph;

      // @private {string} fallBackTag (see declaration of VECTOR_FALL_BACK_TAG for documentation)
      this.fallBackTag = VECTOR_FALL_BACK_TAG;

      // @private {VectorSet} vectorSet - indicates the vector set the vector belongs in.
      this.vectorSet = vectorSet;

      //----------------------------------------------------------------------------------------

      // Function to update the position of the tail of the vector based on the modelViewTransform. The tail view
      // position stays the same, but the tail position changes.
      const updateTailPosition = ( newModelViewTransform, oldModelViewTransform ) => {

        // Get the tail location on the old graph, and move the vector to the new model position of the old location
        const oldTailLocation = oldModelViewTransform.modelToViewPosition( this.tail );
        this.translateTailToPoint( newModelViewTransform.viewToModelPosition( oldTailLocation ) );
      };

      // Observe when the graph model view transform property changes, and update the tail position
      this.graph.modelViewTransformProperty.lazyLink( updateTailPosition );

      // @private {function} unlinkTailUpdateListener - unlink the modelViewTransform link, called in the dispose method
      this.unlinkTailUpdateListener = () => {
        this.graph.modelViewTransformProperty.unlink( updateTailPosition );
      };

      //----------------------------------------------------------------------------------------
      // Create Vector Component Models

      // @public (read only) {VectorComponentModel} xVectorComponentModel
      this.xVectorComponentModel = new VectorComponentModel( this,
        vectorSet.componentStyleProperty,
        graph.activeVectorProperty,
        VectorComponentModel.COMPONENT_TYPES.X_COMPONENT );

      // @public (read only) {VectorComponentModel} yVectorComponentModel
      this.yVectorComponentModel = new VectorComponentModel( this,
        vectorSet.componentStyleProperty,
        graph.activeVectorProperty,
        VectorComponentModel.COMPONENT_TYPES.Y_COMPONENT );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {BooleanProperty} isOnGraphProperty - indicates if the vector is in the play area
      this.isOnGraphProperty = new BooleanProperty( options.isOnGraphInitially );

      // @public (read-only) {Property.<Animation|null>} inProgressAnimationProperty - tracks any animation that is
      // currently in progress.
      this.inProgressAnimationProperty = new Property( null, {
        isValidValue: ( value ) => {
          return value === null || value instanceof Animation;
        }
      } );
    }

    /**
     * Disposes the vector. Called when either the graph is erased or the vector is animated off the graph.
     * @public
     * @override
     */
    dispose() {
      this.unlinkTailUpdateListener();
      this.xVectorComponentModel.dispose();
      this.yVectorComponentModel.dispose();
      this.isOnGraphProperty.dispose();
      this.inProgressAnimationProperty.value && this.inProgressAnimationProperty.value.stop();
      this.inProgressAnimationProperty.dispose();

      super.dispose();
    }

    /**
     * @override
     * @public
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

      // Create flags to indicate the tag and the value
      let tag;
      let value;

      // If the vector has a tag, display the tag. If the vector is active, display the fallBackTag.
      if ( this.tag || this.graph.activeVectorProperty.value === this ) {
        tag = this.tag ? this.tag : this.fallBackTag;
      }

      // If the values are on and its not 0 magnitude, display the magnitude
      if ( valuesVisible ) {
        value = tag ? ` = ${roundedMagnitude}` : roundedMagnitude;
      }

      return {
        coefficient: null, // vector models don't have coefficient
        tag: value && tag ? `|${tag}|` : tag, // surround the tag in absolute value bars if there is a value
        value: value
      };
    }

    /**
     * Moves the tip to this position but ensures it satisfies invariants for polar and cartesian mode.
     * @public
     *
     * Invariants for cartesian mode:
     *  - Vector tip must be within the graph bounds
     *  - Vector tip must be on an exact model coordinate
     *  - Vector must not be dragged to make the vector 0 magnitude
     *
     * Invariants for polar mode:
     *  - Vector tip must be rounded to ensure the magnitude of the vector is a integer
     *  - Vector tip must be rounded to ensure the vector angle is a multiple of POLAR_ANGLE_INTERVAL
     *  - Vector tip must be within the graph bounds
     *  - Vector must not be dragged to make the vector 0 magnitude
     *
     * @param {Vector2} tipPosition
     */
    dragTipToPosition( tipPosition ) {

      assert && assert( !this.inProgressAnimationProperty.value, 'Cannot drag tip when vector is animating' );
      assert && assert( this.isOnGraphProperty.value, 'Cannot drag tip when vector isn\'t on the graph' );
      assert && assert( tipPosition instanceof Vector2, `invalid tipPosition: ${tipPosition}` );

      // Declare this vector as active when it's dragging
      this.graph.activeVectorProperty.value = this;

      // No-op if attempting to drag the vector to 0 magnitude
      if ( tipPosition.minus( this.tail ).roundSymmetric().magnitude === 0 ) {
        return;
      }

      // Flag to get the tip point that satisfies invariants
      let correctedTipPosition;

      if ( this.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

        // Ensure that the tipPosition is on the graph
        const tipPositionOnGraph = this.graph.graphModelBounds.closestPointTo( tipPosition );

        // Rounded the tip to integer grid values
        correctedTipPosition = tipPositionOnGraph.roundedSymmetric();
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

        correctedTipPosition = this.tail.plus( polarVector );
      }


      // Based on the vector orientation, constrain the dragging components
      if ( this.graph.orientation === GraphOrientations.HORIZONTAL ) {
        correctedTipPosition.setY( this.tailY );
      }
      else if ( this.graph.orientation === GraphOrientations.VERTICAL ) {
        correctedTipPosition.setX( this.tailX );
      }

      // Update the model tip
      this.tip = correctedTipPosition;
    }

    /**
     * Moves the tail to this position but ensures it satisfies invariants for polar and cartesian mode. See
     * moveVectorTailToFitInGraph( tailPosition ) for documentation of the invariants.
     * @public
     *
     * @param {Vector2} tailPosition
     */
    dragTailToPosition( tailPosition ) {

      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( this.isOnGraphProperty.value === true, 'should be in graph to drag' );
      assert && assert( !this.inProgressAnimationProperty.value, 'can\'t drag vector when animating' );

      // Declare this vector as active when it's dragging
      this.graph.activeVectorProperty.value = this;

      // Ensure that the tail satisfies invariants for polar/cartesian mode
      this.moveVectorTailToFitInGraph( tailPosition );

      /*---------------------------------------------------------------------------*
       * Add ability to remove vectors
       *---------------------------------------------------------------------------*/
      if ( this.isRemovable ) {
        const constrainedTailBounds = this.getConstrainedTailBounds();

        // Offset of the cursor to the vector. This is users will remove vector according to displacement of the cursor.
        // See https://github.com/phetsims/vector-addition/issues/46#issuecomment-506726262
        const dragOffset = constrainedTailBounds.closestPointTo( tailPosition ).minus( tailPosition );

        if ( Math.abs( dragOffset.x ) > VECTOR_DRAG_THRESHOLD || Math.abs( dragOffset.y ) > VECTOR_DRAG_THRESHOLD ) {
          this.popOffOfGraph();
        }
      }
    }

    /**
     * Moves the tail to this position but ensures it satisfies invariants for polar and cartesian mode.
     * @private
     *
     * Invariants for cartesian mode:
     *  - Vector tail must be in a position that both the tail and tip are in the graph
     *  - Vector tail must be on an exact model coordinate
     *
     * Invariants for polar mode:
     *  - Vector tail must be in a position that both the tail and tip are in the graph
     *  - Vector's must snap to other vectors to allow tip to tail sum comparisons.
     *    See https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit?ts=5ced51e9#
     *  - Vector tail doesn't have to be on an exact model coordinate, but should when not snapping to other vectors
     *
     * @param {Vector2} tailPosition
     */
    moveVectorTailToFitInGraph( tailPosition ) {

      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( this.isOnGraphProperty.value === true, 'should be in graph to fit in to graph' );
      assert && assert( !this.inProgressAnimationProperty.value, 'can\'t move vector when animating' );

      const constrainedTailBounds = this.getConstrainedTailBounds();

      const tailPositionOnGraph = constrainedTailBounds.closestPointTo( tailPosition );

      if ( this.coordinateSnapMode === CoordinateSnapModes.POLAR ) {

        // Get the tip of this vector
        const tipPositionOnGraph = tailPositionOnGraph.plus( this.vectorComponents );

        // Get the all the vectors in the vector including the sum and excluding this vector
        const vectorsInVectorSet = this.vectorSet.vectors.getArray().filter( ( vector ) => {
          return vector !== this;
        } );
        vectorsInVectorSet.push( this.vectorSet.vectorSum );


        //----------------------------------------------------------------------------------------
        for ( let i = 0; i < vectorsInVectorSet.length; i++ ) {

          const vector = vectorsInVectorSet[ i ];

          // Snap tail to other vector's tails
          if ( vector.tail.distance( tailPositionOnGraph ) < POLAR_SNAP_DISTANCE ) {
            this.translateTailToPoint( vector.tail );
            return;
          }

          // Snap tail to other vector's tip
          if ( vector.tip.distance( tailPositionOnGraph ) < POLAR_SNAP_DISTANCE ) {
            this.translateTailToPoint( vector.tip );
            return;
          }

          // Snap tip to other vector's tail
          if ( vector.tail.distance( tipPositionOnGraph ) < POLAR_SNAP_DISTANCE ) {
            this.translateTailToPoint( vector.tail.minus( this.vectorComponents ) );
            return;
          }
        }
      }

      this.translateTailToPoint( tailPositionOnGraph.roundedSymmetric() );
    }

    /**
     * Gets the constrained bounds of the tail. In other words, based on the tip and the components of the vector, this
     * returns a new bounds that is for the tail and ensures that in this bounds the vector will stay in the graph.
     * @private
     *
     * See https://user-images.githubusercontent.com/42391580/60908828-065be780-a23a-11e9-9a02-01a6ca52f73d.png
     * for an annotated image.
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
     *
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

      // Convert the point into where the tail would be in that position
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

      //----------------------------------------------------------------------------------------
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
     * @public
     *
     * @param {Vector2} tailPosition - the tail position to drop the vector onto
     */
    dropOntoGraph( tailPosition ) {

      assert && assert( !this.isOnGraphProperty.value, 'vector is already on the graph' );
      assert && assert( !this.inProgressAnimationProperty.value, 'cannot drop vector when it\'s animating' );

      this.isOnGraphProperty.value = true;

      // Ensure dropped tail position satisfies invariants
      this.moveVectorTailToFitInGraph( tailPosition );

      // Declare this vector as active
      this.graph.activeVectorProperty.value = this;
    }

    /**
     * Pops the vector off of the graph.
     * @public
     */
    popOffOfGraph() {
      this.isOnGraphProperty.value = false;
      this.graph.activeVectorProperty.value = null;
    }
  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );