// Copyright 2019-2025, University of Colorado Boulder

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
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionQueryParameters from '../VectorAdditionQueryParameters.js';
import VectorAdditionSymbols from '../VectorAdditionSymbols.js';
import ComponentVector from './ComponentVector.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import RootVector, { LabelDisplayData, RootVectorOptions } from './RootVector.js';
import VectorSet from './VectorSet.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

const AVERAGE_ANIMATION_SPEED = 1600; // in model coordinates
const MIN_ANIMATION_TIME = 0.9; // in seconds

// interval spacing of vector angle (in degrees) when vector is in polar mode
const POLAR_ANGLE_INTERVAL = VectorAdditionConstants.POLAR_ANGLE_INTERVAL;

// maximum amount of dragging before the vector will be removed from the graph when attempting to drag a vector.
// See https://github.com/phetsims/vector-addition/issues/46 for more context.
const VECTOR_DRAG_THRESHOLD = VectorAdditionQueryParameters.vectorDragThreshold;

// distance between a vector's tail or tip to another vector/s tail or tip to snap to the other vectors in polar mode.
const POLAR_SNAP_DISTANCE = VectorAdditionQueryParameters.polarSnapDistance;

type SelfOptions = {
  isTipDraggable?: boolean; // flag indicating if the tip can be dragged
  isRemovableFromGraph?: boolean; // flag indicating if the vector can be removed from the graph
  isOnGraphInitially?: boolean; // flag indicating if the vector is on the graph upon initialization
  isOnGraphPropertyInstrumented?: boolean; // whether isOnGraphProperty is PhET-iO instrumented
  tandemNameSymbol: string; // symbol for this vector used in tandem names
};

export type VectorOptions = SelfOptions & RootVectorOptions;

export default class Vector extends RootVector {

  // indicates if the tip can be dragged
  public readonly isTipDraggable: boolean;

  // indicates if the vector can be removed from the graph
  public readonly isRemovableFromGraph: boolean;

  // the scene that the vector model belongs to
  public readonly scene: VectorAdditionScene;

  // the vector set that the vector belongs to
  public readonly vectorSet: VectorSet;

  // indicates whether the vector is on the graph
  public readonly isOnGraphProperty: Property<boolean>;

  // {Animation|null} reference to any animation that is currently in progress
  public inProgressAnimation: Animation | null;

  // indicates if the vector should be animated back to the toolbox
  public readonly animateBackProperty: Property<boolean>;

  // the vector's x and y component vectors
  public readonly xComponentVector: ComponentVector;
  public readonly yComponentVector: ComponentVector;

  // symbol for this vector used in tandem names
  public readonly tandemNameSymbol: string;

  private readonly disposeVector: () => void;

  // Fallback symbol to use if a symbol isn't provided.
  public static readonly FALLBACK_SYMBOL_PROPERTY = VectorAdditionSymbols.vStringProperty;

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param initialComponents - starting components of the vector
   * @param scene - the scene the vector belongs to
   * @param vectorSet - the vector set the vector belongs to
   * @param symbolProperty - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   * @param [providedOptions]
   */
  public constructor( initialTailPosition: Vector2,
                      initialComponents: Vector2,
                      scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      symbolProperty: TReadOnlyProperty<string> | null,
                      //TODO https://github.com/phetsims/vector-addition/issues/258 providedOptions should be required because tandemNameSymbol is required.
                      providedOptions?: VectorOptions ) {

    const options = optionize<VectorOptions, SelfOptions, RootVectorOptions>()( {

      // SelfOptions
      isTipDraggable: true,
      isRemovableFromGraph: true,
      isOnGraphInitially: false,
      isOnGraphPropertyInstrumented: true,
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    super( initialTailPosition, initialComponents, vectorSet.vectorColorPalette, symbolProperty, options );

    this.isTipDraggable = options.isTipDraggable;
    this.isRemovableFromGraph = options.isRemovableFromGraph;
    this.scene = scene;
    this.vectorSet = vectorSet;

    this.isOnGraphProperty = new BooleanProperty( options.isOnGraphInitially, {
      tandem: options.isOnGraphPropertyInstrumented ? options.tandem.createTandem( 'isOnGraphProperty' ) : Tandem.OPT_OUT,
      phetioReadOnly: true
    } );

    this.inProgressAnimation = null;
    this.animateBackProperty = new BooleanProperty( false );

    this.xComponentVector = new ComponentVector( this,
      vectorSet.componentVectorStyleProperty,
      scene.selectedVectorProperty,
      'xComponent'
    );

    this.yComponentVector = new ComponentVector( this,
      vectorSet.componentVectorStyleProperty,
      scene.selectedVectorProperty,
      'yComponent'
    );

    this.tandemNameSymbol = options.tandemNameSymbol;

    // When the scene's origin changes, update the tail position. unlink is required on dispose.
    const updateTailPosition = ( newModelViewTransform: ModelViewTransform2, oldModelViewTransform: ModelViewTransform2 ) => {
      const tailPositionView = oldModelViewTransform.modelToViewPosition( this.tail );
      this.moveToTailPosition( newModelViewTransform.viewToModelPosition( tailPositionView ) );
    };
    this.scene.graph.modelViewTransformProperty.lazyLink( updateTailPosition );

    this.disposeVector = () => {
      this.scene.graph.modelViewTransformProperty.unlink( updateTailPosition );
      this.xComponentVector.dispose();
      this.yComponentVector.dispose();
      this.inProgressAnimation && this.inProgressAnimation.stop();
    };
  }

  public override dispose(): void {
    this.disposeVector();
    super.dispose();
  }

  /**
   * See RootVector.getLabelDisplayData for details.
   */
  public getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {

    // If the vector has a symbol or is selected, the vector always displays a symbol.
    let symbolProperty: TReadOnlyProperty<string> | null = null;
    if ( this.symbolProperty || this.scene.selectedVectorProperty.value === this ) {
      symbolProperty = ( this.symbolProperty || Vector.FALLBACK_SYMBOL_PROPERTY );
    }

    // If the values are on, the vector always displays a value.
    let magnitude: number | null = null;
    if ( valuesVisible ) {
      magnitude = this.magnitude;
    }

    return {
      coefficient: null, // vector models don't have coefficients
      symbolProperty: symbolProperty,
      magnitude: magnitude,
      includeAbsoluteValueBars: ( magnitude !== null && symbolProperty !== null ) // absolute value bars if there is a magnitude
    };
  }

  /**
   * Sets the tip of the vector but ensures the vector satisfies invariants for polar/Cartesian mode.
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
   */
  protected setTipWithInvariants( tipPosition: Vector2 ): void {

    affirm( !this.inProgressAnimation, 'this.inProgressAnimation must be false' );

    const graph = this.scene.graph;

    // Flag to get the tip point that satisfies invariants (to be calculated below)
    let tipPositionWithInvariants: Vector2;

    if ( this.scene.coordinateSnapMode === 'cartesian' ) {

      // Ensure that the tipPosition is on the scene
      const tipPositionOnGraph = graph.bounds.closestPointTo( tipPosition );

      // Round the tip to integer grid values
      tipPositionWithInvariants = tipPositionOnGraph.roundedSymmetric();
    }
    else {
      // this.scene.coordinateSnapMode === CoordinateSnapMode.POLAR

      const vectorComponents = tipPosition.minus( this.tail );

      const roundedMagnitude = roundSymmetric( vectorComponents.magnitude );

      const angleInRadians = toRadians( POLAR_ANGLE_INTERVAL );
      const roundedAngle = angleInRadians * roundSymmetric( vectorComponents.angle / angleInRadians );

      // Calculate the rounded polar vector
      const polarVector = vectorComponents.setPolar( roundedMagnitude, roundedAngle );

      // Ensure that the new polar vector is in the bounds. Subtract one from the magnitude until the vector is inside
      while ( !graph.bounds.containsPoint( this.tail.plus( polarVector ) ) ) {
        polarVector.setMagnitude( polarVector.magnitude - 1 );
      }

      tipPositionWithInvariants = this.tail.plus( polarVector );
    }

    // Based on the vector orientation, constrain the dragging components
    if ( graph.orientation === 'horizontal' ) {
      tipPositionWithInvariants.setY( this.tailY );
    }
    else if ( graph.orientation === 'vertical' ) {
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
   *
   * ## Invariants for Cartesian mode:
   *  - Vector tail must be on an exact model coordinate
   *
   * ## Invariants for polar mode:
   *  - Vector's must snap to other vectors to allow tip to tail sum comparisons.
   *    See https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit?ts=5ced51e9#
   *  - Vector tail doesn't have to be on an exact model coordinate, but should when not snapping to other vectors
   */
  private setTailWithInvariants( tailPosition: Vector2 ): void {

    affirm( !this.inProgressAnimation, 'this.inProgressAnimation must be false' );

    const constrainedTailBounds = this.getConstrainedTailBounds();

    // Ensure the tail is set in a position so the tail and the tip are on the scene
    const tailPositionOnGraph = constrainedTailBounds.closestPointTo( tailPosition );

    if ( this.scene.coordinateSnapMode === 'polar' ) {

      // Get the tip of this vector
      const tipPositionOnGraph = tailPositionOnGraph.plus( this.vectorComponents );

      // Get all the vectors in the set, including the sum and excluding this vector
      const vectorsInVectorSet = this.vectorSet.vectors.filter( vector => {
        return vector !== this;
      } );
      if ( this.vectorSet.sumVector ) {
        vectorsInVectorSet.push( this.vectorSet.sumVector );
      }

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
   */
  public moveTipToPosition( tipPosition: Vector2 ): void {
    this.setTipWithInvariants( tipPosition );
  }

  /**
   * Moves the tail to this position but ensures it satisfies invariants for polar and Cartesian mode.
   */
  public moveTailToPosition( tailPosition: Vector2 ): void {

    // Ensure that the tail satisfies invariants for polar/Cartesian mode
    this.setTailWithInvariants( tailPosition );

    // For a vector that can be removed from the graph...
    if ( this.isRemovableFromGraph ) {
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
   * of the scene. See https://github.com/phetsims/vector-addition/issues/152
   */
  private getConstrainedTailBounds(): Bounds2 {
    return this.scene.graph.bounds.eroded( VectorAdditionConstants.VECTOR_TAIL_DRAG_MARGIN );
  }

  /**
   * Animates the vector to a specific point. Called when the user fails to drop the vector in the scene.
   * @param point - animates the center of the vector to this point
   * @param finalComponents - animates the components to the final components
   * @param finishCallback - callback when the animation finishes naturally, not when stopped
   */
  public animateToPoint( point: Vector2, finalComponents: Vector2, finishCallback: () => void ): void {

    affirm( !this.inProgressAnimation, 'Can\'t animate to position when we are in animation currently' );
    affirm( !this.isOnGraphProperty.value, 'Can\'t animate when the vector is on the scene' );

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
      this.inProgressAnimation!.finishEmitter.removeListener( finishListener );
      this.inProgressAnimation = null;
      finishCallback();
    };
    this.inProgressAnimation.finishEmitter.addListener( finishListener );
  }

  /**
   * Drops the vector onto the scene.
   * @param tailPosition - the tail position to drop the vector onto
   */
  public dropOntoGraph( tailPosition: Vector2 ): void {

    affirm( !this.isOnGraphProperty.value, 'vector is already on the scene' );
    affirm( !this.inProgressAnimation, 'cannot drop vector when it\'s animating' );

    this.isOnGraphProperty.value = true;

    // Ensure dropped tail position satisfies invariants
    this.setTailWithInvariants( tailPosition );

    // When the vector is first dropped, it is selected.
    this.scene.selectedVectorProperty.value = this;
  }

  /**
   * Pops the vector off of the scene.
   */
  public popOffOfGraph(): void {

    affirm( this.isOnGraphProperty.value, 'attempted pop off scene when vector was already off' );
    affirm( !this.inProgressAnimation, 'cannot pop vector off when it\'s animating' );

    this.isOnGraphProperty.value = false;
    this.scene.selectedVectorProperty.value = null;
  }

  /**
   * Sets the offset from the x-axis and y-axis that is used for PROJECTION style for component vectors.
   * @param projectionXOffset - x offset, in model coordinates
   * @param projectionYOffset - y offset, in model coordinates
   */
  public setProjectionOffsets( projectionXOffset: number, projectionYOffset: number ): void {
    this.xComponentVector.setProjectionOffsets( projectionXOffset, projectionYOffset );
    this.yComponentVector.setProjectionOffsets( projectionXOffset, projectionYOffset );
  }
}

vectorAddition.register( 'Vector', Vector );