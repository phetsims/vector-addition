// Copyright 2019, University of Colorado Boulder

/**
 * LabGraph is a specialization of Graph for the 'Lab' screen. 'Lab' has 2 Graph instances (polar and Cartesian).
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ComponentVectorStyles = require( 'VECTOR_ADDITION/common/model/ComponentVectorStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // Lab Graphs have the 'default' graph bounds
  const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  class LabGraph extends Graph {

    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
     * @param {Property.<boolean>} sumVisibleProperty1 - whether the sum for the first VectorSet is visible
     * @param {Property.<boolean>} sumVisibleProperty2 - whether the sum for the second VectorSet is visible
     * @param {VectorColorPalette} vectorColorPalette1 - color palette for the first VectorSet
     * @param {VectorColorPalette} vectorColorPalette2 - color palette for the second VectorSet
     */
    constructor( coordinateSnapMode, componentStyleProperty, sumVisibleProperty1, sumVisibleProperty2,
                 vectorColorPalette1, vectorColorPalette2 ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty && ComponentVectorStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( vectorColorPalette1 instanceof VectorColorPalette, `invalid vectorColorPalette1: ${vectorColorPalette1}` );
      assert && assert( vectorColorPalette2 instanceof VectorColorPalette, `invalid vectorColorPalette2: ${vectorColorPalette2}` );

      super( LAB_GRAPH_BOUNDS, coordinateSnapMode );

      // Compute values for the options that are related to the PROJECTION style component vectors.
      // PROJECTION component vectors are more closely spaced in this screen, and we have 2 sum vectors.
      // See https://github.com/phetsims/vector-addition/issues/225
      const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth;
      assert && assert( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
      const modelHeadWidth = this.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth );
      const offsetDelta = -( modelHeadWidth / 2 );

      // @public (read-only) {VectorSet} vectorSet1
      this.vectorSet1 = new VectorSet( this, componentStyleProperty, sumVisibleProperty1, vectorColorPalette1, {

        initialSumTailPosition: new Vector2(
          Utils.roundSymmetric( LAB_GRAPH_BOUNDS.minX + ( 1 / 3 ) * LAB_GRAPH_BOUNDS.width ),
          Utils.roundSymmetric( LAB_GRAPH_BOUNDS.centerY )
        ),

        // non-sum component vectors are interleaved with vectorSet2, overlap is OK
        projectionXOffsetDelta: offsetDelta,
        projectionYOffsetDelta: offsetDelta
      } );

      // @public (read-only) {VectorSet} vectorSet2
      this.vectorSet2 = new VectorSet( this, componentStyleProperty, sumVisibleProperty2, vectorColorPalette2, {

        initialSumTailPosition: new Vector2(
          Utils.roundSymmetric( LAB_GRAPH_BOUNDS.minX + ( 2 / 3 ) * LAB_GRAPH_BOUNDS.width ),
          Utils.roundSymmetric( LAB_GRAPH_BOUNDS.centerY )
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

  return vectorAddition.register( 'LabGraph', LabGraph );
} );