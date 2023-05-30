// Copyright 2019-2023, University of Colorado Boulder

/**
 * Vector is the model for a vector that can be directly manipulated.  It can be translated and (optionally)
 * scaled and rotated.
 *
 * Extends RootVector but adds the following functionality (annotated in the file):
 *  1. update the tail when the origin moves (modelViewTransformProperty)
 *  2. instantiate x and y component vectors
 *  3. ability to correctly drag the vector by the tail and the tip in both polar and Cartesian mode
 *  4. methods to drop a vector, to animate a vector, and to pop a vector off the graph
 *
 * @author Brandon Li
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionQueryParameters from '../VectorAdditionQueryParameters.js';
import ComponentVector from './ComponentVector.js';
import ComponentVectorTypes from './ComponentVectorTypes.js';
import CoordinateSnapModes from './CoordinateSnapModes.js';
import GraphOrientations from './GraphOrientations.js';
import RootVector from './RootVector.js';

//----------------------------------------------------------------------------------------
// constants
const AVERAGE_ANIMATION_SPEED = 1600; // in model coordinates
const MIN_ANIMATION_TIME = 0.9; // in seconds

// interval spacing of vector angle (in degrees) when vector is in polar mode
const POLAR_ANGLE_INTERVAL = VectorAdditionConstants.POLAR_ANGLE_INTERVAL;

// fall back symbol for the vector model if a symbol isn't provided. The reason this isn't translatable is:
// https://github.com/phetsims/vector-addition/issues/10.
const VECTOR_FALL_BACK_SYMBOL = 'v';

// maximum amount of dragging before the vector will be removed from the graph when attempting to drag a vector.
// See https://github.com/phetsims/vector-addition/issues/46 for more context.
const VECTOR_DRAG_THRESHOLD = VectorAdditionQueryParameters.vectorDragThreshold;

// distance between a vector's tail or tip to another vector/s tail or tip to snap to the other vectors in polar mode.
const POLAR_SNAP_DISTANCE = VectorAdditionQueryParameters.polarSnapDistance;

export default class Vector extends RootVector {

  /**
   * @param {Vector2} initialTailPosition - starting tail position of the vector
   * @param {Vector2} initialComponents - starting components of the vector
   * @param {Graph} graph - the graph the vector belongs to
   * @param {VectorSet} vectorSet - the vector set the vector belongs to
   * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   * @param {Object} [options] - not propagated to super
   */
  constructor( initialTailPosition, initialComponents, graph, vectorSet, symbol, options ) {

    options = merge( {
      isTipDraggable: true, // {boolean} - flag indicating if the tip can be dragged
      isRemovable: true, // {boolean} - flag indicating if the vector can be removed from the graph
      isOnGraphInitially: false // {boolean} - flag indicating if the vector is on the graph upon initialization
    }, options );

    super( initialTailPosition, initialComponents, vectorSet.vectorColorPalette, symbol );

    // @public (read-only) {boolean} indicates if the tip can be dragged
    this.isTipDraggable = options.isTipDraggable;

    // @public (read-only) {boolean} indicates if the vector can be removed
    this.isRemovable = options.isRemovable;

    // @public (read-only) {string} fallBackSymbol (see declaration of VECTOR_FALL_BACK_SYMBOL for documentation)
    this.fallBackSymbol = VECTOR_FALL_BACK_SYMBOL;

    // @protected {Graph} the graph that the vector model belongs to
    this.graph = graph;

    // @protected {VectorSet} the vector set that the vector belongs to
    this.vectorSet = vectorSet;

    // @public (read-only) indicates whether the vector is in on the graph
    this.isOnGraphProperty = new BooleanProperty( options.isOnGraphInitially );

    // @public (read-only) {Animation|null} reference to any animation that is currently in progress
    this.inProgressAnimation = null;

    // @public (read-only) indicates if the vector should be animated back to the toolbox
    this.animateBackProperty = new BooleanProperty( false );

    // @public (read only) the vector's x component vector
    this.xComponentVector = new ComponentVector( this,
      vectorSet.componentStyleProperty,
      graph.activeVectorProperty,
      ComponentVectorTypes.X_COMPONENT
    );

    // @public (read only) the vector's y component vector
    this.yComponentVector = new ComponentVector( this,
      vectorSet.componentStyleProperty,
      graph.activeVectorProperty,
      ComponentVectorTypes.Y_COMPONENT
    );

    // When the graph's origin changes, update the tail position. unlink is required on dispose.
    const updateTailPosition = ( newModelViewTransform, oldModelViewTransform ) => {
      const tailPositionView = oldModelViewTransform.modelToViewPosition( this.tail );
      this.moveToTailPosition( newModelViewTransform.viewToModelPosition( tailPositionView ) );
    };
    this.graph.modelViewTransformProperty.lazyLink( updateTailPosition );

    // @private
    this.disposeVector = () => {
      this.graph.modelViewTransformProperty.unlink( updateTailPosition );
      this.xComponentVector.dispose();
      this.yComponentVector.dispose();
      this.inProgressAnimation && this.inProgressAnimation.stop();
    };
  }

  /**
   * @public
   */
  dispose() {
    this.disposeVector();
  }

  /**
   * Gets the label content information to be displayed on the vector.
   * See RootVector.getLabelContent for details.
   * @override
   * @public
   * @param {boolean} valuesVisible - whether the values are visible
   * @returns {Object} see RootVector.getLabelContent
   */
  getLabelContent( valuesVisible ) {

    // Get the rounded magnitude
    const roundedMagnitude = Utils.toFixed( this.magnitude, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );

    // Create flags to indicate the symbol and the value
    let symbol = null;
    let value = null;

    // If the vector has a symbol or is active, the vector always displays a symbol.
    if ( this.symbol || this.graph.activeVectorProperty.value === this ) {
      symbol = ( this.symbol || this.fallBackSymbol );
    }

    // If the values are on, the vector always displays a value.
    if ( valuesVisible ) {
      value = roundedMagnitude;
    }

    return {
      coefficient: null, // vector models don't have coefficients
      symbol: symbol,
      value: value,
      includeAbsoluteValueBars: ( value !== null && symbol !== null ) // absolute value bars if there is a value
    };
  }

  /**
   * Sets the tip of the vector but ensures the vector satisfies invariants for polar/Cartesian mode.
   * @protected
   *
   * ## Common Invariants (for both Cartesian and polar mode):
   *  - Vector must not be set to the tail (0 magnitude)
   *
   * ## Invariants for Cartesian mode:
   *  - Vector tip must be on an exact model coordinate
   *
   * ## Invariants for polar mode:
   *  - Vector tip must be rounded to ensure the magnitude of the vector is a integer
   *  - Vector tip must be rounded to ensure the vector angle is a multiple of POLAR_ANGLE_INTERVAL
   *
   * @param {Vector2} tipPosition
   */
  setTipWithInvariants( tipPosition ) {

    assert && assert( tipPosition instanceof Vector2, `invalid tipPosition: ${tipPosition}` );
    assert && assert( !this.inProgressAnimation, 'this.inProgressAnimation must be false' );

    // Flag to get the tip point that satisfies invariants (to be calculated below)
    let tipPositionWithInvariants;

    if ( this.graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

      // Ensure that the tipPosition is on the graph
      const tipPositionOnGraph = this.graph.graphModelBounds.closestPointTo( tipPosition );

      // Round the tip to integer grid values
      tipPositionWithInvariants = tipPositionOnGraph.roundedSymmetric();
    }
    else if ( this.graph.coordinateSnapMode === CoordinateSnapModes.POLAR ) {

      const vectorComponents = tipPosition.minus( this.tail );

      const roundedMagnitude = Utils.roundSymmetric( vectorComponents.magnitude );

      const angleInRadians = Utils.toRadians( POLAR_ANGLE_INTERVAL );
      const roundedAngle = angleInRadians * Utils.roundSymmetric( vectorComponents.angle / angleInRadians );

      // Calculate the rounded polar vector
      const polarVector = vectorComponents.setPolar( roundedMagnitude, roundedAngle );

      // Ensure that the new polar vector is in the bounds. Subtract one from the magnitude until the vector is inside
      while ( !this.graph.graphModelBounds.containsPoint( this.tail.plus( polarVector ) ) ) {
        polarVector.setMagnitude( polarVector.magnitude - 1 );
      }

      tipPositionWithInvariants = this.tail.plus( polarVector );
    }

    // Based on the vector orientation, constrain the dragging components
    if ( this.graph.orientation === GraphOrientations.HORIZONTAL ) {
      tipPositionWithInvariants.setY( this.tailY );
    }
    else if ( this.graph.orientation === GraphOrientations.VERTICAL ) {
      tipPositionWithInvariants.setX( this.tailX );
    }

    // Ensure vector tip must not be set to the tail (0 magnitude)
    if ( !tipPositionWithInvariants.equals( this.tail ) ) {
      // Update the model tip
      this.tip = tipPositionWithInvariants;
    }
  }

  /**
   * Sets the tail of the vector but ensures the vector satisfies invariants for polar/Cartesian mode.
   * @private
   *
   * ## Invariants for Cartesian mode:
   *  - Vector tail must be on an exact model coordinate
   *
   * ## Invariants for polar mode:
   *  - Vector's must snap to other vectors to allow tip to tail sum comparisons.
   *    See https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit?ts=5ced51e9#
   *  - Vector tail doesn't have to be on an exact model coordinate, but should when not snapping to other vectors
   *
   * @param {Vector2} tailPosition
   */
  setTailWithInvariants( tailPosition ) {

    assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
    assert && assert( !this.inProgressAnimation, 'this.inProgressAnimation must be false' );

    const constrainedTailBounds = this.getConstrainedTailBounds();

    // Ensure the tail is set in a position so the tail and the tip are on the graph
    const tailPositionOnGraph = constrainedTailBounds.closestPointTo( tailPosition );

    if ( this.graph.coordinateSnapMode === CoordinateSnapModes.POLAR ) {

      // Get the tip of this vector
      const tipPositionOnGraph = tailPositionOnGraph.plus( this.vectorComponents );

      // Get all the vectors in the vector including the sum and excluding this vector
      const vectorsInVectorSet = this.vectorSet.vectors.filter( vector => {
        return vector !== this;
      } );
      vectorsInVectorSet.push( this.vectorSet.sumVector );

      //----------------------------------------------------------------------------------------
      // Vector's must snap to other vectors to allow tip to tail sum comparisons.
      for ( let i = 0; i < vectorsInVectorSet.length; i++ ) {

        const vector = vectorsInVectorSet[ i ];

        // Snap tail to other vector's tails
        if ( vector.tail.distance( tailPositionOnGraph ) < POLAR_SNAP_DISTANCE ) {
          this.moveToTailPosition( vector.tail );
          return;
        }

        // Snap tail to other vector's tip
        if ( vector.tip.distance( tailPositionOnGraph ) < POLAR_SNAP_DISTANCE ) {
          this.moveToTailPosition( vector.tip );
          return;
        }

        // Snap tip to other vector's tail
        if ( vector.tail.distance( tipPositionOnGraph ) < POLAR_SNAP_DISTANCE ) {
          this.moveToTailPosition( vector.tail.minus( this.vectorComponents ) );
          return;
        }
      }
    }

    this.moveToTailPosition( tailPositionOnGraph.roundedSymmetric() );
  }

  /**
   * Moves the tip to this position but ensures it satisfies invariants for polar and Cartesian mode.
   * @public
   * @param {Vector2} tipPosition
   */
  moveTipToPosition( tipPosition ) {
    this.setTipWithInvariants( tipPosition );
  }

  /**
   * Moves the tail to this position but ensures it satisfies invariants for polar and Cartesian mode.
   * @public
   * @param {Vector2} tailPosition
   */
  moveTailToPosition( tailPosition ) {

    // Ensure that the tail satisfies invariants for polar/Cartesian mode
    this.setTailWithInvariants( tailPosition );

    // Add ability to remove vectors
    if ( this.isRemovable ) {
      const constrainedTailBounds = this.getConstrainedTailBounds();

      // Offset of the cursor to the vector. This allows users to remove vectors based on the displacement of the
      // cursor. See https://github.com/phetsims/vector-addition/issues/46#issuecomment-506726262
      const dragOffset = constrainedTailBounds.closestPointTo( tailPosition ).minus( tailPosition );

      if ( Math.abs( dragOffset.x ) > VECTOR_DRAG_THRESHOLD || Math.abs( dragOffset.y ) > VECTOR_DRAG_THRESHOLD ) {
        this.popOffOfGraph();
      }
    }
  }

  /**
   * Gets the constrained bounds of the tail. The tail must be within VECTOR_TAIL_DRAG_MARGIN units of the edges
   * of the graph. See https://github.com/phetsims/vector-addition/issues/152
   * @private
   */
  getConstrainedTailBounds() {
    return this.graph.graphModelBounds.eroded( VectorAdditionConstants.VECTOR_TAIL_DRAG_MARGIN );
  }

  /**
   * Animates the vector to a specific point. Called when the user fails to drop the vector in the graph.
   * @public
   *
   * @param {Vector2} point - animates the center of the vector to this point
   * @param {Vector2} finalComponents - animates the components to the final components
   * @param {function} finishCallback - callback when the animation finishes naturally, not when stopped
   */
  animateToPoint( point, finalComponents, finishCallback ) {

    assert && assert( !this.inProgressAnimation, 'Can\'t animate to position when we are in animation currently' );
    assert && assert( !this.isOnGraphProperty.value, 'Can\'t animate when the vector is on the graph' );
    assert && assert( point instanceof Vector2, `invalid point: ${point}` );
    assert && assert( finalComponents instanceof Vector2, `invalid finalComponents: ${finalComponents}` );
    assert && assert( typeof finishCallback === 'function', `invalid finishCallback: ${finishCallback}` );

    // Calculate the tail position to animate to
    const tailPosition = point.minus( finalComponents.timesScalar( 0.5 ) );

    this.inProgressAnimation = new Animation( {
      duration: _.max( [ MIN_ANIMATION_TIME, this.tail.distance( tailPosition ) / AVERAGE_ANIMATION_SPEED ] ),
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

    // Called when the animation finishes naturally
    const finishListener = () => {
      this.inProgressAnimation.finishEmitter.removeListener( finishListener );
      this.inProgressAnimation = null;
      finishCallback();
    };
    this.inProgressAnimation.finishEmitter.addListener( finishListener );
  }

  /**
   * Drops the vector onto the graph.
   * @public
   * @param {Vector2} tailPosition - the tail position to drop the vector onto
   */
  dropOntoGraph( tailPosition ) {

    assert && assert( !this.isOnGraphProperty.value, 'vector is already on the graph' );
    assert && assert( !this.inProgressAnimation, 'cannot drop vector when it\'s animating' );

    this.isOnGraphProperty.value = true;

    // Ensure dropped tail position satisfies invariants
    this.setTailWithInvariants( tailPosition );

    // When the vector is first dropped, it is active
    this.graph.activeVectorProperty.value = this;
  }

  /**
   * Pops the vector off of the graph.
   * @public
   */
  popOffOfGraph() {

    assert && assert( this.isOnGraphProperty.value === true, 'attempted pop off graph when vector was already off' );
    assert && assert( !this.inProgressAnimation, 'cannot pop vector off when it\'s animating' );

    this.isOnGraphProperty.value = false;
    this.graph.activeVectorProperty.value = null;
  }

  /**
   * Sets the offset from the x and y axis that is used for PROJECTION style for component vectors.
   * @param projectionXOffset - x offset, in model coordinates
   * @param projectionYOffset - y offset, in model coordinates
   * @public
   */
  setProjectionOffsets( projectionXOffset, projectionYOffset ) {
    this.xComponentVector.setProjectionOffsets( projectionXOffset, projectionYOffset );
    this.yComponentVector.setProjectionOffsets( projectionXOffset, projectionYOffset );
  }
}

vectorAddition.register( 'Vector', Vector );