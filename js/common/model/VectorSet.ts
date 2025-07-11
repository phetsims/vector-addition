// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorSet is the model for a related set of vectors, and contains:
 *
 *  - an ObservableArrayDef of vectors
 *  - a sum vector of those vectors
 *  - a color palette that is common to all vectors
 *
 * A VectorAdditionScene can support multiple VectorSets. (e.g. Lab screen has 2 VectorSets per VectorAdditionScene)
 *
 * @author Brandon Li
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorAdditionSymbols from '../VectorAdditionSymbols.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import SumVector from './SumVector.js';
import Vector from './Vector.js';
import VectorColorPalette from './VectorColorPalette.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {

  // false means that the default SumVector will not be created, and a subclass is responsible for initializing this.sumVector.
  initializeSum?: boolean;

  // initial tail position of the sum. Only used if options.initializeSum = true
  initialSumTailPosition?: Vector2;

  // Offsets for primary component vectors in PROJECTION style
  projectionXOffsetStart?: number;
  projectionYOffsetStart?: number;
  projectionXOffsetDelta?: number;
  projectionYOffsetDelta?: number;

  // Offsets for sum component vectors in PROJECTION style
  sumProjectionXOffset?: number;
  sumProjectionYOffset?: number;

  sumSymbolProperty?: TReadOnlyProperty<string>;
};

export type VectorSetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorSet extends PhetioObject {

  // This array contains only what is referred to as main or parent vectors. It does not contain sum vectors,
  // component vectors, or base vectors.
  public readonly vectors: ObservableArray<Vector>;

  public readonly vectorColorPalette: VectorColorPalette;
  public readonly sumVisibleProperty: Property<boolean>;
  public readonly componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>;

  public readonly projectionXOffsetStart: number;
  public readonly projectionYOffsetStart: number;
  public readonly sumProjectionXOffset: number;
  public readonly sumProjectionYOffset: number;

  protected _sumVector: SumVector | null; // settable by subclasses, specifically EquationsVectorSet

  /**
   * @param scene - the scene the VectorSet belongs to
   * @param componentVectorStyleProperty - component style for all vectors
   * @param sumVisibleProperty - controls whether the sum vector is visible
   * @param vectorColorPalette - color palette for vectors in this set
   * @param providedOptions
   */
  public constructor( scene: VectorAdditionScene,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      providedOptions: VectorSetOptions ) {

    const graph = scene.graph;

    // Compute values for the options that are related to the PROJECTION style component vectors.
    // See https://github.com/phetsims/vector-addition/issues/225
    const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth;
    assert && assert( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
    const modelHeadWidth = graph.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth! );
    const axisSpacing = graph.modelViewTransformProperty.value.viewToModelDeltaX( 1.5 );
    const offsetStart = ( modelHeadWidth / 2 ) + axisSpacing;
    const offsetDelta = modelHeadWidth;

    const options = optionize<VectorSetOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      initializeSum: true,
      initialSumTailPosition: graph.bounds.center,
      projectionXOffsetStart: -offsetStart,
      projectionYOffsetStart: -offsetStart,
      projectionXOffsetDelta: -offsetDelta,
      projectionYOffsetDelta: -offsetDelta,
      sumProjectionXOffset: offsetStart,
      sumProjectionYOffset: offsetStart,
      sumSymbolProperty: VectorAdditionSymbols.sStringProperty,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.vectors = createObservableArray();
    this.vectorColorPalette = vectorColorPalette;
    this.sumVisibleProperty = sumVisibleProperty;
    this.componentVectorStyleProperty = componentVectorStyleProperty;

    this.projectionXOffsetStart = options.projectionXOffsetStart;
    this.projectionYOffsetStart = options.projectionYOffsetStart;
    this.sumProjectionXOffset = options.sumProjectionXOffset;
    this.sumProjectionYOffset = options.sumProjectionYOffset;

    if ( options.initializeSum ) {
      this._sumVector = new SumVector( options.initialSumTailPosition, scene, this, options.sumSymbolProperty,
        options.tandem.createTandem( 'sumVector' ) );
      this._sumVector.setProjectionOffsets( options.sumProjectionXOffset, options.sumProjectionYOffset );
    }
    else {
      this._sumVector = null;
    }

    // Whenever a vector is added or removed, adjust the offsets of all component vectors for PROJECTION style.
    // See https://github.com/phetsims/vector-addition/issues/225
    // unlink is unnecessary, since VectorSet own this.vectors.
    this.vectors.lengthProperty.link( length => {
      for ( let i = 0; i < length; i++ ) {
        const xOffset = options.projectionXOffsetStart + i * options.projectionXOffsetDelta;
        const yOffset = options.projectionYOffsetStart + i * options.projectionYOffsetDelta;
        this.vectors.get( i ).setProjectionOffsets( xOffset, yOffset );
      }
    } );
  }

  public get sumVector(): SumVector | null {
    return this._sumVector;
  }

  public reset(): void {
    this.erase();
    this._sumVector && this._sumVector.reset();
  }

  /**
   * Erases all vectors (except the sum) from the VectorSet. Called when the eraser button is pressed.
   */
  public erase(): void {
    while ( this.vectors.length > 0 ) {
      this.vectors.pop()!.dispose();
    }
  }
}

vectorAddition.register( 'VectorSet', VectorSet );