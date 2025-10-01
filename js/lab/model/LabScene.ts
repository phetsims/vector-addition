// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScene is the base class for scenes in the 'Lab' screen.
 *
 * Characteristics of a LabScene are:
 *  - it snaps to either Cartesian or polar coordinates
 *  - it has 2 vector set
 *
 * @author Brandon Li
 */

import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
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

// Lab Graphs have the 'default' graph bounds
const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

export default class LabScene extends VectorAdditionScene {

  // For this scene, we need to know about LabVectorSet instances, a specialization of VectorSet.
  public readonly vectorSet1: LabVectorSet;
  public readonly vectorSet2: LabVectorSet;
  public readonly labVectorSets: LabVectorSet[];

  // Initial components for all vectors in this scene.
  public readonly initialVectorComponents: Vector2;

  /**
   * @param sceneNameStringProperty
   * @param coordinateSnapMode - coordinateSnapMode for the scene
   * @param initialVectorComponents
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

    // Compute values for the options that are related to the PROJECTION style component vectors.
    // PROJECTION component vectors are more closely spaced in this screen, and we have 2 sum vectors.
    // See https://github.com/phetsims/vector-addition/issues/225
    const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth!;
    affirm( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
    const modelHeadWidth = this.graph.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth );
    const offsetDelta = -( modelHeadWidth / 2 );

    this.vectorSet1 = new LabVectorSet( this, symbol1Property, tandemNameSymbol1, componentVectorStyleProperty, vectorColorPalette1, {

      initialSumTailPosition: new Vector2(
        roundSymmetric( LAB_GRAPH_BOUNDS.minX + ( 1 / 3 ) * LAB_GRAPH_BOUNDS.width ),
        roundSymmetric( LAB_GRAPH_BOUNDS.centerY )
      ),

      // non-sum component vectors are interleaved with vectorSet2, overlap is OK
      projectionXOffsetDelta: offsetDelta,
      projectionYOffsetDelta: offsetDelta,

      tandem: tandem.createTandem( `${tandemNameSymbol1}VectorSet` )
    } );

    this.vectorSet2 = new LabVectorSet( this, symbol2Property, tandemNameSymbol2, componentVectorStyleProperty, vectorColorPalette2, {

      initialSumTailPosition: new Vector2(
        roundSymmetric( LAB_GRAPH_BOUNDS.minX + ( 2 / 3 ) * LAB_GRAPH_BOUNDS.width ),
        roundSymmetric( LAB_GRAPH_BOUNDS.centerY )
      ),

      // non-sum component vectors are interleaved with vectorSet1, overlap is OK
      projectionXOffsetStart: this.vectorSet1.projectionXOffsetStart + offsetDelta / 2,
      projectionYOffsetStart: this.vectorSet1.projectionYOffsetStart + offsetDelta / 2,
      projectionXOffsetDelta: offsetDelta,
      projectionYOffsetDelta: offsetDelta,

      // sum component vectors are spaced so that they don't overlap with vectorSet1
      sumProjectionXOffset: this.vectorSet1.sumProjectionXOffset + modelHeadWidth,
      sumProjectionYOffset: this.vectorSet1.sumProjectionYOffset + modelHeadWidth,

      tandem: tandem.createTandem( `${tandemNameSymbol2}VectorSet` )
    } );

    this.labVectorSets = [ this.vectorSet1, this.vectorSet2 ];

    // Add the vector sets
    this.vectorSets.push( this.vectorSet1, this.vectorSet2 );
  }
}

vectorAddition.register( 'LabScene', LabScene );