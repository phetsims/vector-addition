// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScene is the base class for scenes in the 'Lab' screen.
 *
 * Characteristics of a LabScene are:
 *  - it has 2 vector sets
 *  - vectors snap to either Cartesian or polar coordinates
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import LabVectorSet from './LabVectorSet.js';

// Lab Graphs have the 'default' graph bounds
const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

export default class LabScene extends VectorAdditionScene {

  // This scene has two vector sets.
  public readonly vectorSet1: LabVectorSet;
  public readonly vectorSet2: LabVectorSet;

  // Initial components for all vectors in this scene.
  public readonly initialXYComponents: Vector2;

  /**
   * @param accessibleSceneNameStringProperty
   * @param coordinateSnapMode - coordinateSnapMode for the scene
   * @param initialXYComponents - initial xy-components for all vectors in the scene
   * @param symbol1Property - symbol for vector set 1
   * @param symbol2Property - symbol for vector set 2
   * @param tandemNameSymbol1 - symbol for vector set 1 used in tandem names
   * @param tandemNameSymbol2 - symbol for vector set 2 used in tandem names
   * @param vectorColorPalette1 - color palette for vector set 1
   * @param vectorColorPalette2 - color palette for vector set 2
   * @param componentVectorStyleProperty
   * @param tandem
   */
  protected constructor( accessibleSceneNameStringProperty: TReadOnlyProperty<string>,
                         coordinateSnapMode: CoordinateSnapMode,
                         initialXYComponents: Vector2,
                         symbol1Property: TReadOnlyProperty<string>,
                         symbol2Property: TReadOnlyProperty<string>,
                         tandemNameSymbol1: string,
                         tandemNameSymbol2: string,
                         vectorColorPalette1: VectorColorPalette,
                         vectorColorPalette2: VectorColorPalette,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         tandem: Tandem ) {

    super( accessibleSceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        bounds: LAB_GRAPH_BOUNDS
      },
      tandem: tandem
    } );

    this.initialXYComponents = initialXYComponents;

    // Compute values for the options that are related to ComponentVectorStyle 'projection'.
    // Projection component vectors are more closely-spaced in this screen, and we have 2 sum vectors.
    // See https://github.com/phetsims/vector-addition/issues/225
    const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth!;
    affirm( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
    const modelHeadWidth = this.graph.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth );
    const offsetDelta = -( modelHeadWidth / 2 );

    this.vectorSet1 = new LabVectorSet( this.graph, this.selectedVectorProperty,
      symbol1Property, initialXYComponents, tandemNameSymbol1, componentVectorStyleProperty, {

        coordinateSnapMode: this.coordinateSnapMode,
        vectorColorPalette: vectorColorPalette1,

        // non-sum component vectors are interleaved with vectorSet2, overlap is OK
        projectionXOffsetDelta: offsetDelta,
        projectionYOffsetDelta: offsetDelta,

        resultantTailPosition: new Vector2( 12, 10 ),

        tandem: tandem.createTandem( `${tandemNameSymbol1}VectorSet` )
      } );

    this.vectorSet2 = new LabVectorSet( this.graph, this.selectedVectorProperty,
      symbol2Property, initialXYComponents, tandemNameSymbol2, componentVectorStyleProperty, {

        coordinateSnapMode: coordinateSnapMode,
        vectorColorPalette: vectorColorPalette2,

        // non-sum component vectors are interleaved with vectorSet1, overlap is OK
        projectionXOffsetStart: this.vectorSet1.projectionXOffsetStart + offsetDelta / 2,
        projectionYOffsetStart: this.vectorSet1.projectionYOffsetStart + offsetDelta / 2,
        projectionXOffsetDelta: offsetDelta,
        projectionYOffsetDelta: offsetDelta,

        resultantTailPosition: new Vector2( 28, 10 ),

        // resultant (sum) component vectors are spaced so that they don't overlap with vectorSet1
        resultantProjectionXOffset: this.vectorSet1.resultantProjectionXOffset + modelHeadWidth,
        resultantProjectionYOffset: this.vectorSet1.resultantProjectionYOffset + modelHeadWidth,

        tandem: tandem.createTandem( `${tandemNameSymbol2}VectorSet` )
      } );

    this.vectorSets.push( this.vectorSet1, this.vectorSet2 );
  }

  public override reset(): void {
    super.reset();
    this.vectorSets.forEach( vectorSet => vectorSet.reset() );
  }

  public override erase(): void {
    super.erase();
    this.vectorSets.forEach( vectorSet => vectorSet.erase() );
  }
}

vectorAddition.register( 'LabScene', LabScene );