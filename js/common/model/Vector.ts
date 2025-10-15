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
import ComponentVector from './ComponentVector.js';
import RootVector, { LabelDisplayData, RootVectorOptions } from './RootVector.js';
import VectorSet from './VectorSet.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import { CoordinateSnapMode } from './CoordinateSnapMode.js';
import Graph from './Graph.js';

// Minimum time to animate a vector to a point, in seconds.
const MIN_ANIMATION_TIME = 0.9;

// Speed of animating a vector to a point, in model coordinates per second.
const ANIMATION_SPEED = 1600;

// interval spacing of vector angle (in degrees) when vector is in polar mode
const POLAR_ANGLE_INTERVAL = VectorAdditionConstants.POLAR_ANGLE_INTERVAL;

// maximum amount of dragging before the vector will be removed from the graph when attempting to drag a vector.
// See https://github.com/phetsims/vector-addition/issues/46 for more context.
const VECTOR_DRAG_THRESHOLD = VectorAdditionQueryParameters.vectorDragThreshold;

// distance between a vector's tail or tip to another vector/s tail or tip to snap to the other vectors in polar mode.
const POLAR_SNAP_DISTANCE = VectorAdditionQueryParameters.polarSnapDistance;

type SelfOptions = {

  // required
  symbolProperty: TReadOnlyProperty<string>; // the symbol used to label the vector in the visual UI
  coordinateSnapMode: CoordinateSnapMode;
  tandemNameSymbol: string; // symbol for this vector used in tandem names

  // optional
  accessibleSymbolProperty?: TReadOnlyProperty<string> | null; // the symbol used to describe the vector in interactive description
  isTipDraggable?: boolean; // flag indicating if the tip can be dragged
  isRemovableFromGraph?: boolean; // flag indicating if the vector can be removed from the graph
  isOnGraph?: boolean; // initial value of isOnGraphProperty
  isOnGraphPropertyInstrumented?: boolean; // whether isOnGraphProperty is PhET-iO instrumented
};

export type VectorOptions = SelfOptions & WithRequired<RootVectorOptions, 'tandem'>;

export default class Vector extends RootVector {

  // indicates if the tip can be dragged
  public readonly isTipDraggable: boolean;

  // indicates if the vector can be removed from the graph
  public readonly isRemovableFromGraph: boolean;

  private readonly graph: Graph;
  private readonly selectedVectorProperty: Property<Vector | null>;
  private readonly coordinateSnapMode: CoordinateSnapMode;

  // the vector set that the vector belongs to
  protected readonly vectorSet: VectorSet;

  // indicates whether the vector is on the graph
  public readonly isOnGraphProperty: Property<boolean>;

  // {Animation|null} reference to any animation that is currently in progress
  private inProgressAnimation: Animation | null;

  // indicates if the vector should be animated back to the toolbox
  public readonly animateBackProperty: Property<boolean>;

  // the vector's x and y component vectors
  public readonly xComponentVector: ComponentVector;
  public readonly yComponentVector: ComponentVector;

  // the symbol used to label the vector, contains RichText markdown
  public readonly symbolProperty: TReadOnlyProperty<string>;

  // the symbol used for the vector in interactive descriptions
  public readonly accessibleSymbolProperty: TReadOnlyProperty<string>;

  // symbol for this vector used in tandem names
  public readonly tandemNameSymbol: string;

  public constructor( tailPosition: Vector2,
                      xyComponents: Vector2,
                      vectorSet: VectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      providedOptions: VectorOptions ) {

    const options = optionize<VectorOptions, SelfOptions, RootVectorOptions>()( {

      // SelfOptions
      accessibleSymbolProperty: null,
      isTipDraggable: true,
      isRemovableFromGraph: true,
      isOnGraph: false,
      isOnGraphPropertyInstrumented: true,

      // RootVectorOptions
      isDisposable: false // For PhET-iO, all Vectors are instantiated at startup, and exist for the lifetime of the sim.
    }, providedOptions );

    super( tailPosition, xyComponents, vectorSet.vectorColorPalette, options );

    this.graph = graph;
    this.selectedVectorProperty = selectedVectorProperty;
    this.coordinateSnapMode = options.coordinateSnapMode;

    this.isTipDraggable = options.isTipDraggable;
    this.isRemovableFromGraph = options.isRemovableFromGraph;
    this.vectorSet = vectorSet;

    this.isOnGraphProperty = new BooleanProperty( options.isOnGraph, {
      tandem: options.isOnGraphPropertyInstrumented ? options.tandem.createTandem( 'isOnGraphProperty' ) : Tandem.OPT_OUT,
      phetioReadOnly: true
    } );

    this.inProgressAnimation = null;
    this.animateBackProperty = new BooleanProperty( false );

    this.xComponentVector = new ComponentVector( this, vectorSet.componentVectorStyleProperty, 'xComponent' );
    this.yComponentVector = new ComponentVector( this, vectorSet.componentVectorStyleProperty, 'yComponent' );

    this.symbolProperty = options.symbolProperty;
    this.accessibleSymbolProperty = options.accessibleSymbolProperty || RichText.getAccessibleStringProperty( options.symbolProperty );
    this.tandemNameSymbol = options.tandemNameSymbol;

    // When the scene's origin changes, update the tail position. unlink is required on dispose.
    const updateTailPosition = ( newModelViewTransform: ModelViewTransform2, oldModelViewTransform: ModelViewTransform2 ) => {
      const tailPositionView = oldModelViewTransform.modelToViewPosition( this.tail );
      this.moveToTailPosition( newModelViewTransform.viewToModelPosition( tailPositionView ) );
    };
    this.graph.modelViewTransformProperty.lazyLink( updateTailPosition );
  }

  /**
   * See RootVector.getLabelDisplayData for details.
   */
  public override getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {

    // If the 'Values' checkbox is checked, the label displays the vector's magnitude.
    const magnitude = valuesVisible ? this.magnitude : null;

    return {
      coefficient: null, // vector models don't have coefficients
      symbolProperty: this.symbolProperty,
      magnitude: magnitude,
      includeAbsoluteValueBars: ( magnitude !== null ) // absolute value bars if there is a magnitude
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
   *  - Vector tip must be rounded to ensure the magnitude of the vector is an integer
   *  - Vector tip must be rounded to ensure the vector angle is a multiple of POLAR_ANGLE_INTERVAL
   */
  protected setTipWithInvariants( tipPosition: Vector2 ): void {

    affirm( !this.inProgressAnimation, 'this.inProgressAnimation must be false' );

    // Flag to get the tip point that satisfies invariants (to be calculated below)
    let tipPositionWithInvariants: Vector2;

    if ( this.coordinateSnapMode === 'cartesian' ) {

      // Ensure that the tipPosition is on the scene
      const tipPositionOnGraph = this.graph.bounds.closestPointTo( tipPosition );

      // Round the tip to integer grid values
      tipPositionWithInvariants = tipPositionOnGraph.roundedSymmetric();
    }
    else {
      // this.coordinateSnapMode === 'polar''

      const xyComponents = tipPosition.minus( this.tail );

      const roundedMagnitude = roundSymmetric( xyComponents.magnitude );

      const angleInRadians = toRadians( POLAR_ANGLE_INTERVAL );
      const roundedAngle = angleInRadians * roundSymmetric( xyComponents.angle / angleInRadians );

      // Calculate the rounded polar vector
      const polarVector = xyComponents.setPolar( roundedMagnitude, roundedAngle );

      // Ensure that the new polar vector is in the bounds. Subtract one from the magnitude until the vector is inside
      while ( !this.graph.bounds.containsPoint( this.tail.plus( polarVector ) ) ) {
        polarVector.setMagnitude( polarVector.magnitude - 1 );
      }

      tipPositionWithInvariants = this.tail.plus( polarVector );
    }

    // Based on the vector orientation, constrain the dragging components
    if ( this.graph.orientation === 'horizontal' ) {
      tipPositionWithInvariants.setY( this.tailY );
    }
    else if ( this.graph.orientation === 'vertical' ) {
      tipPositionWithInvariants.setX( this.tailX );
    }

    // Ensure vector tip must not be set to the tail (0 magnitude)
    if ( !tipPositionWithInvariants.equals( this.tail ) ) {
      // Update the model tip
      this.setTip( tipPositionWithInvariants );
    }
  }

  /**
   * Sets the tail of the vector but ensures the vector satisfies invariants for polar/Cartesian mode.
   *
   * ## Invariants for Cartesian mode:
   *  - Vector tail must be on an exact model coordinate
   *
   * ## Invariants for polar mode:
   *  - Vector's must snap to other vectors to allow tip-to-tail comparisons.
   *    See https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit?ts=5ced51e9#
   *  - Vector tail doesn't have to be on an exact model coordinate, but should when not snapping to other vectors
   */
  private setTailWithInvariants( tailPosition: Vector2 ): void {

    affirm( !this.inProgressAnimation, 'this.inProgressAnimation must be false' );

    const constrainedTailBounds = this.getConstrainedTailBounds();

    // Ensure the tail is set in a position so the tail and the tip are on the scene
    const tailPositionOnGraph = constrainedTailBounds.closestPointTo( tailPosition );

    if ( this.coordinateSnapMode === 'polar' ) {

      // Get the tip of this vector
      const tipPositionOnGraph = tailPositionOnGraph.plus( this.xyComponents );

      // Get all the vectors in the set, including the resultant vector, and excluding this vector.
      const vectorsInVectorSet = this.vectorSet.activeVectors.filter( vector => {
        return vector !== this;
      } );
      vectorsInVectorSet.push( this.vectorSet.resultantVector );

      //----------------------------------------------------------------------------------------
      // Vector's must snap to other vectors to allow tip-to-tail comparisons.
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
          this.moveToTailPosition( vector.tail.minus( this.xyComponents ) );
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
    return this.graph.bounds.eroded( VectorAdditionConstants.VECTOR_TAIL_DRAG_MARGIN );
  }

  /**
   * Animates the vector to a specific point. Called when the user fails to drop the vector in the scene.
   * @param point - animates the center of the vector to this point
   * @param finalComponents - animates the components to the final components
   * @param finishCallback - callback when the animation finishes naturally, not when stopped
   */
  public animateToPoint( point: Vector2, finalComponents: Vector2, finishCallback: () => void ): void {

    affirm( !this.inProgressAnimation, 'Animation is already in progress.' );
    affirm( !this.isOnGraphProperty.value, 'Cannot animate when the vector is on the graph.' );

    // Calculate the tail position to animate to
    const tailPosition = point.minus( finalComponents.timesScalar( 0.5 ) );

    this.inProgressAnimation = new Animation( {
      duration: _.max( [ MIN_ANIMATION_TIME, this.tail.distance( tailPosition ) / ANIMATION_SPEED ] ),
      targets: [ {
        property: this.tailPositionProperty,
        easing: Easing.QUADRATIC_IN_OUT,
        to: tailPosition
      }, {
        property: this.xyComponentsProperty,
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
   * Drops the vector onto the graph.
   * @param tailPosition - the tail position to drop the vector onto
   */
  public dropOntoGraph( tailPosition: Vector2 ): void {

    affirm( !this.isOnGraphProperty.value, 'Vector is already on the graph.' );
    affirm( !this.inProgressAnimation, 'Cannot drop vector when it is animating.' );

    this.isOnGraphProperty.value = true;

    // Ensure dropped tail position satisfies invariants
    this.setTailWithInvariants( tailPosition );

    // When the vector is first dropped, it is selected.
    this.selectedVectorProperty.value = this;
  }

  /**
   * Pops the vector off of the scene.
   */
  public popOffOfGraph(): void {

    affirm( this.isOnGraphProperty.value, 'Attempted pop off graph when vector was already off.' );
    affirm( !this.inProgressAnimation, 'Cannot pop vector off graph when it is animating.' );

    this.isOnGraphProperty.value = false;
    this.selectedVectorProperty.value = null;
  }

  /**
   * Sets the offset from the x-axis and y-axis that is used for ComponentVectorStyle 'projection'.
   * @param projectionXOffset - x offset, in model coordinates
   * @param projectionYOffset - y offset, in model coordinates
   */
  public setProjectionOffsets( projectionXOffset: number, projectionYOffset: number ): void {
    this.xComponentVector.setProjectionOffsets( projectionXOffset, projectionYOffset );
    this.yComponentVector.setProjectionOffsets( projectionXOffset, projectionYOffset );
  }

  /**
   * Returns true when the Vector is animating.
   */
  public isAnimating(): boolean {
    return this.inProgressAnimation !== null;
  }

  /**
   * VectorIO handles PhET-iO serialization of Vector instances. Since all Vector instances are static instances,
   * it implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly VectorIO = new IOType<Vector, ReferenceIOState>( 'VectorIO', {
    valueType: Vector,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}

vectorAddition.register( 'Vector', Vector );