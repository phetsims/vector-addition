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
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ResultantVector from './ResultantVector.js';

type SelfOptions = {

  // Offsets for primary component vectors in ComponentVectorStyle 'projection'
  projectionXOffsetStart?: number;
  projectionYOffsetStart?: number;
  projectionXOffsetDelta?: number;
  projectionYOffsetDelta?: number;

  // false means that the default SumVector will not be created, and a subclass is responsible for initializing this.resultantVector.
  //TODO https://github.com/phetsims/vector-addition/issues/334 Rename 'sum' to 'resultant' throughout options
  initializeResultantVector?: boolean;

  // initial tail position of the resultant vector.
  initialResultantTailPosition?: Vector2;

  // Offsets for resultant component vectors in ComponentVectorStyle 'projection'
  resultantProjectionXOffset?: number;
  resultantProjectionYOffset?: number;

  // Symbol for the resultant vector used in the visual interface.
  resultantSymbolProperty?: TReadOnlyProperty<string>;

  // Symbol for the resultant vector used in tandem names.
  resultantTandemNameSymbol?: string;
};

export type VectorSetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorSet extends PhetioObject {

  // This array contains only what is referred to as main or parent vectors. It does not contain sum vectors,
  // component vectors, or base vectors.
  public readonly vectors: ObservableArray<Vector>;

  public readonly vectorColorPalette: VectorColorPalette;
  public readonly componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>;

  public readonly projectionXOffsetStart: number;
  public readonly projectionYOffsetStart: number;
  public readonly sumProjectionXOffset: number;
  public readonly sumProjectionYOffset: number;

  protected resultantVector: ResultantVector | null; // settable by subclasses, specifically EquationsVectorSet
  public readonly resultantTandemNameSymbol: string; // Symbol for the resultant vector used in tandem names.

  /**
   * @param scene - the scene the VectorSet belongs to
   * @param componentVectorStyleProperty - component style for all vectors
   * @param vectorColorPalette - color palette for vectors in this set
   * @param providedOptions
   */
  public constructor( scene: VectorAdditionScene,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorColorPalette: VectorColorPalette,
                      providedOptions: VectorSetOptions ) {

    const graph = scene.graph;

    // Compute values for the options that are related to ComponentVectorStyle 'projection'.
    // See https://github.com/phetsims/vector-addition/issues/225
    const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth!;
    affirm( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
    const modelHeadWidth = graph.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth );
    const axisSpacing = graph.modelViewTransformProperty.value.viewToModelDeltaX( 1.5 );
    const offsetStart = ( modelHeadWidth / 2 ) + axisSpacing;
    const offsetDelta = modelHeadWidth;

    const options = optionize<VectorSetOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      projectionXOffsetStart: -offsetStart,
      projectionYOffsetStart: -offsetStart,
      projectionXOffsetDelta: -offsetDelta,
      projectionYOffsetDelta: -offsetDelta,
      initializeResultantVector: true,
      initialResultantTailPosition: graph.bounds.center,
      resultantProjectionXOffset: offsetStart,
      resultantProjectionYOffset: offsetStart,
      resultantSymbolProperty: VectorAdditionSymbols.sStringProperty,
      resultantTandemNameSymbol: 's',

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.vectors = createObservableArray();
    this.vectorColorPalette = vectorColorPalette;
    this.componentVectorStyleProperty = componentVectorStyleProperty;

    this.projectionXOffsetStart = options.projectionXOffsetStart;
    this.projectionYOffsetStart = options.projectionYOffsetStart;
    this.sumProjectionXOffset = options.resultantProjectionXOffset;
    this.sumProjectionYOffset = options.resultantProjectionYOffset;
    this.resultantTandemNameSymbol = options.resultantTandemNameSymbol;

    if ( options.initializeResultantVector ) {
      this.resultantVector = new SumVector( options.initialResultantTailPosition, scene, this, options.resultantSymbolProperty,
        this.resultantTandemNameSymbol, options.tandem.createTandem( `${this.resultantTandemNameSymbol}Vector` ) );
      this.resultantVector.setProjectionOffsets( options.resultantProjectionXOffset, options.resultantProjectionYOffset );
    }
    else {
      this.resultantVector = null;
    }

    // Whenever a vector is added or removed, adjust the offsets of all component vectors for ComponentVectorStyle 'projection'.
    // See https://github.com/phetsims/vector-addition/issues/225
    this.vectors.lengthProperty.link( length => {
      for ( let i = 0; i < length; i++ ) {
        const xOffset = options.projectionXOffsetStart + i * options.projectionXOffsetDelta;
        const yOffset = options.projectionYOffsetStart + i * options.projectionYOffsetDelta;
        this.vectors.get( i ).setProjectionOffsets( xOffset, yOffset );
      }
    } );
  }

  //TODO https://github.com/phetsims/vector-addition/issues/334 Rename getResultantVector
  public getSumVector(): ResultantVector | null {
    return this.resultantVector;
  }

  public reset(): void {
    this.erase();
    this.resultantVector && this.resultantVector.reset();
  }

  /**
   * Removes all vectors from the VectorSet, and disposes them if they are disposable.
   * Called when the eraser button is pressed.
   */
  public erase(): void {
    this.vectors.forEach( vector => {
      if ( vector.isDisposable ) {
        vector.dispose();
      }
    } );
    this.vectors.clear();
  }
}

vectorAddition.register( 'VectorSet', VectorSet );