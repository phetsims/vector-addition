// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScene is the base class for scenes in the 'Lab' screen.
 *
 * Characteristics of a LabScene are:
 *  - it snaps to either Cartesian or polar coordinates
 *  - it has 2 vector sets
 *
 * @author Brandon Li
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LabVectorSet from './LabVectorSet.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Vector from '../../common/model/Vector.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// Lab Graphs have the 'default' graph bounds
const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

export default class LabScene extends VectorAdditionScene {

  // This scene has two vector sets.
  public readonly vectorSet1: LabVectorSet;
  public readonly vectorSet2: LabVectorSet;

  // The complete set of vectors for vectorSet1 and vectorSet2, allocated when the sim starts.
  // Ordered by increasing vector index, e.g. v1, v2, v3,...
  public readonly allVectors1: Vector[];
  public readonly allVectors2: Vector[];

  // Initial components for all vectors in this scene.
  public readonly initialVectorComponents: Vector2;

  /**
   * @param sceneNameStringProperty
   * @param coordinateSnapMode - coordinateSnapMode for the scene
   * @param initialVectorComponents - initial xy-components for all vectors in the scene
   * @param symbol1Property - symbol for vector set 1
   * @param symbol2Property - symbol for vector set 2
   * @param tandemNameSymbol1 - symbol for vector set 1 used in tandem names
   * @param tandemNameSymbol2 - symbol for vector set 2 used in tandem names
   * @param vectorColorPalette1 - color palette for vector set 1
   * @param vectorColorPalette2 - color palette for vector set 2
   * @param componentVectorStyleProperty
   * @param tandem
   */
  protected constructor( sceneNameStringProperty: TReadOnlyProperty<string>,
                         coordinateSnapMode: CoordinateSnapMode,
                         initialVectorComponents: Vector2,
                         symbol1Property: TReadOnlyProperty<string>,
                         symbol2Property: TReadOnlyProperty<string>,
                         tandemNameSymbol1: string,
                         tandemNameSymbol2: string,
                         vectorColorPalette1: VectorColorPalette,
                         vectorColorPalette2: VectorColorPalette,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         tandem: Tandem ) {

    super( sceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        initialBounds: LAB_GRAPH_BOUNDS
      },
      tandem: tandem
    } );

    this.initialVectorComponents = initialVectorComponents;

    // Compute values for the options that are related to ComponentVectorStyle 'projection'.
    // Projection component vectors are more closely-spaced in this screen, and we have 2 sum vectors.
    // See https://github.com/phetsims/vector-addition/issues/225
    const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth!;
    affirm( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
    const modelHeadWidth = this.graph.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth );
    const offsetDelta = -( modelHeadWidth / 2 );

    this.vectorSet1 = new LabVectorSet( this, symbol1Property, tandemNameSymbol1, componentVectorStyleProperty, vectorColorPalette1, {

      // non-sum component vectors are interleaved with vectorSet2, overlap is OK
      projectionXOffsetDelta: offsetDelta,
      projectionYOffsetDelta: offsetDelta,

      initialResultantTailPosition: new Vector2( 12, 10 ),

      tandem: tandem.createTandem( `${tandemNameSymbol1}VectorSet` )
    } );

    this.vectorSet2 = new LabVectorSet( this, symbol2Property, tandemNameSymbol2, componentVectorStyleProperty, vectorColorPalette2, {

      // non-sum component vectors are interleaved with vectorSet1, overlap is OK
      projectionXOffsetStart: this.vectorSet1.projectionXOffsetStart + offsetDelta / 2,
      projectionYOffsetStart: this.vectorSet1.projectionYOffsetStart + offsetDelta / 2,
      projectionXOffsetDelta: offsetDelta,
      projectionYOffsetDelta: offsetDelta,

      initialResultantTailPosition: new Vector2( 28, 10 ),

      // resultant (sum) component vectors are spaced so that they don't overlap with vectorSet1
      resultantProjectionXOffset: this.vectorSet1.resultantProjectionXOffset + modelHeadWidth,
      resultantProjectionYOffset: this.vectorSet1.resultantProjectionYOffset + modelHeadWidth,

      tandem: tandem.createTandem( `${tandemNameSymbol2}VectorSet` )
    } );

    this.vectorSets.push( this.vectorSet1, this.vectorSet2 );

    // Create vector instances.
    this.allVectors1 = createAllVectors( initialVectorComponents, this, this.vectorSet1, this.vectorSet1.tandem );
    this.allVectors2 = createAllVectors( initialVectorComponents, this, this.vectorSet2, this.vectorSet2.tandem );
  }

  public override reset(): void {
    super.reset();
    this.vectorSets.forEach( vectorSet => vectorSet.reset() );
    this.allVectors1.forEach( vector => vector.reset() );
    this.allVectors2.forEach( vector => vector.reset() );
  }

  public override erase(): void {
    super.erase();
    this.vectorSets.forEach( vectorSet => vectorSet.erase() );
  }
}

/**
 * Creates all vectors related to a vector set.
 */
function createAllVectors( initialVectorComponents: Vector2,
                           scene: LabScene,
                           vectorSet: LabVectorSet,
                           parentTandem: Tandem ): Vector[] {
  const vectors: Vector[] = [];

  // Iterate from 1 so that tandem names have 1-based indices.
  for ( let i = 1; i <= VectorAdditionConstants.LAB_VECTORS_PER_VECTOR_SET; i++ ) {

    // Symbol for the vector is the vector set symbol with an index subscript.
    const symbolProperty = new DerivedProperty( [ vectorSet.symbolProperty ], symbol => `${symbol}<sub>${i}</sub>` );

    const vector = new Vector( new Vector2( 0, 0 ), initialVectorComponents, scene, vectorSet, symbolProperty, {
      isDisposable: false,
      tandem: parentTandem.createTandem( `${vectorSet.tandemNameSymbol}${i}Vector` ),
      tandemNameSymbol: `a${i}`
    } );
    vectors.push( vector );
  }
  return vectors;
}

vectorAddition.register( 'LabScene', LabScene );