// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorSet is the model for a related set of vectors, and contains:
 *
 *  - an array of vectors
 *  - a resultant vector, derived from those vectors
 *  - a color palette that is common to all vectors in the vector set
 *
 * A scene can support multiple VectorSets. For example, the Lab screen has 2 VectorSets per scene.
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
import SumVector from './SumVector.js';
import Vector from './Vector.js';
import VectorColorPalette from './VectorColorPalette.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ResultantVector from './ResultantVector.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';
import { CoordinateSnapMode } from './CoordinateSnapMode.js';

type SelfOptions = {

  // Offsets for primary component vectors in ComponentVectorStyle 'projection'
  projectionXOffsetStart?: number;
  projectionYOffsetStart?: number;
  projectionXOffsetDelta?: number;
  projectionYOffsetDelta?: number;

  // Creates the resultant vector for this VectorSet.
  createResultantVector?: ( tailPosition: Vector2,
                            vectorSet: VectorSet,
                            symbolProperty: TReadOnlyProperty<string>,
                            tandemNameSymbol: string,
                            tandem: Tandem ) => ResultantVector;

  // initial value of resultantVector.tailPositionProperty
  resultantTailPosition?: Vector2;

  // Offsets for resultant component vectors in ComponentVectorStyle 'projection'
  resultantProjectionXOffset?: number;
  resultantProjectionYOffset?: number;

  // Symbol for the resultant vector used in the visual interface.
  resultantSymbolProperty?: TReadOnlyProperty<string>;

  // Symbol for the resultant vector used in tandem names.
  resultantTandemNameSymbol?: string;

  // Whether to PhET-iO instrument the activeVectors observable array.
  activeVectorsInstrumented?: boolean;
};

export type VectorSetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorSet extends PhetioObject {

  public readonly resultantVector: ResultantVector;

  // Vectors that are active - that is, not in the toolbox. This array changes as vectors are dragged to/from the
  // toolbox. Active vectors with isOnGraphProperty.value === true contribute to the resultant vector.
  public readonly activeVectors: ObservableArray<Vector>;

  public readonly vectorColorPalette: VectorColorPalette;
  public readonly componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>;

  public readonly projectionXOffsetStart: number;
  public readonly projectionYOffsetStart: number;
  public readonly resultantProjectionXOffset: number;
  public readonly resultantProjectionYOffset: number;

  public constructor( graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      coordinateSnapMode: CoordinateSnapMode,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorColorPalette: VectorColorPalette,
                      providedOptions: VectorSetOptions ) {

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
      createResultantVector: ( tailPosition: Vector2,
                               vectorSet: VectorSet,
                               symbolProperty: TReadOnlyProperty<string>,
                               tandemNameSymbol: string,
                               tandem: Tandem ) =>
        new SumVector( tailPosition, vectorSet, graph, selectedVectorProperty, {
          symbolProperty: symbolProperty,
          coordinateSnapMode: coordinateSnapMode,
          vectorColorPalette: vectorSet.vectorColorPalette,
          tandemNameSymbol: tandemNameSymbol,
          tandem: tandem
        } ),
      resultantTailPosition: graph.bounds.center,
      resultantProjectionXOffset: offsetStart,
      resultantProjectionYOffset: offsetStart,
      resultantSymbolProperty: VectorAdditionSymbols.sStringProperty,
      resultantTandemNameSymbol: 's',
      activeVectorsInstrumented: true,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.activeVectors = createObservableArray( {
      tandem: options.activeVectorsInstrumented ? options.tandem.createTandem( 'activeVectors' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioType: createObservableArray.ObservableArrayIO( Vector.VectorIO ),
      phetioDocumentation: 'Vectors that are not in the toolbox.'
    } );

    this.vectorColorPalette = vectorColorPalette;
    this.componentVectorStyleProperty = componentVectorStyleProperty;

    this.projectionXOffsetStart = options.projectionXOffsetStart;
    this.projectionYOffsetStart = options.projectionYOffsetStart;
    this.resultantProjectionXOffset = options.resultantProjectionXOffset;
    this.resultantProjectionYOffset = options.resultantProjectionYOffset;

    this.resultantVector = options.createResultantVector( options.resultantTailPosition, this, options.resultantSymbolProperty,
      options.resultantTandemNameSymbol, options.tandem.createTandem( `${options.resultantTandemNameSymbol}Vector` ) );
    this.resultantVector.setProjectionOffsets( options.resultantProjectionXOffset, options.resultantProjectionYOffset );

    // Whenever a vector is added or removed, adjust the offsets of all component vectors for ComponentVectorStyle 'projection'.
    // See https://github.com/phetsims/vector-addition/issues/225
    this.activeVectors.lengthProperty.link( length => {
      for ( let i = 0; i < length; i++ ) {
        const xOffset = options.projectionXOffsetStart + i * options.projectionXOffsetDelta;
        const yOffset = options.projectionYOffsetStart + i * options.projectionYOffsetDelta;
        this.activeVectors.get( i ).setProjectionOffsets( xOffset, yOffset );
      }
    } );
  }

  public reset(): void {
    this.erase();
    this.resultantVector.reset();
  }

  /**
   * Makes all vectors inactive, returning them to the toolbox. Called when the eraser button is pressed.
   */
  public erase(): void {
    this.activeVectors.clear();
  }
}

vectorAddition.register( 'VectorSet', VectorSet );