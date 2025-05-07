// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScene is a scene in the 'Lab' screen.
 *
 * Characteristics of a LabScene are:
 *  - it snaps to either Cartesian or polar coordinates
 *  - it has 2 vector set
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// Lab Graphs have the 'default' graph bounds
const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

export default class LabScene extends VectorAdditionScene {

  public readonly vectorSet1: VectorSet;
  public readonly vectorSet2: VectorSet;

  /**
   * @param coordinateSnapMode - coordinateSnapMode for the graph
   * @param componentVectorStyleProperty
   * @param sum1VisibleProperty - whether the sum for the first VectorSet is visible
   * @param sum2VisibleProperty - whether the sum for the second VectorSet is visible
   * @param vectorColorPalette1 - color palette for the first VectorSet
   * @param vectorColorPalette2 - color palette for the second VectorSet
   * @param tandem
   */
  public constructor( coordinateSnapMode: CoordinateSnapMode,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sum1VisibleProperty: Property<boolean>,
                      sum2VisibleProperty: Property<boolean>,
                      vectorColorPalette1: VectorColorPalette,
                      vectorColorPalette2: VectorColorPalette,
                      tandem: Tandem ) {

    super( LAB_GRAPH_BOUNDS, coordinateSnapMode, {
      tandem: tandem
    } );

    // Compute values for the options that are related to the PROJECTION style component vectors.
    // PROJECTION component vectors are more closely spaced in this screen, and we have 2 sum vectors.
    // See https://github.com/phetsims/vector-addition/issues/225
    const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth;
    assert && assert( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
    const modelHeadWidth = this.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth! );
    const offsetDelta = -( modelHeadWidth / 2 );

    this.vectorSet1 = new VectorSet( this, componentVectorStyleProperty, sum1VisibleProperty, vectorColorPalette1, {

      initialSumTailPosition: new Vector2(
        roundSymmetric( LAB_GRAPH_BOUNDS.minX + ( 1 / 3 ) * LAB_GRAPH_BOUNDS.width ),
        roundSymmetric( LAB_GRAPH_BOUNDS.centerY )
      ),

      // non-sum component vectors are interleaved with vectorSet2, overlap is OK
      projectionXOffsetDelta: offsetDelta,
      projectionYOffsetDelta: offsetDelta
    } );

    this.vectorSet2 = new VectorSet( this, componentVectorStyleProperty, sum2VisibleProperty, vectorColorPalette2, {

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
      sumProjectionYOffset: this.vectorSet1.sumProjectionYOffset + modelHeadWidth
    } );

    // Add the vector sets
    this.vectorSets.push( this.vectorSet1, this.vectorSet2 );
  }
}

vectorAddition.register( 'LabScene', LabScene );