// Copyright 2019, University of Colorado Boulder

/**
 * View for a vector sum. Vector Sum Nodes have a distinct appearance for each vector group.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  // constants
  const VECTOR_GROUP_1_SUM = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors[ VectorGroups.ONE ].sum,
    lineWidth: 1
  } );
  const VECTOR_GROUP_2_SUM = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors[ VectorGroups.TWO ].sum,
    lineWidth: 1
  } );

  class VectorSumNode extends VectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property for the different component
     *                                                                         styles
     * @param {BooleanProperty} angleVisibleProperty - property for when the angle is visible
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {CoordinateSnapModes} coordinateSnapMode
     * @param {sumVisibleProperty} sumVisibleProperty
     */
    constructor( vectorModel,
                 graph,
                 componentStyleProperty,
                 angleVisibleProperty,
                 valuesVisibleProperty,
                 coordinateSnapMode,
                 sumVisibleProperty
    ) {

      super( vectorModel,
        graph,
        componentStyleProperty,
        angleVisibleProperty,
        valuesVisibleProperty,
        coordinateSnapMode,
        vectorModel.vectorGroup === VectorGroups.ONE ? VECTOR_GROUP_1_SUM : VECTOR_GROUP_2_SUM );

      // Doesn't need to be unlinked since vector sums are never disposed
      sumVisibleProperty.linkAttribute( this, 'visible' );
    }

    /**
     * Double check to make sure vector sums are never disposed
     */
    dispose() {
      assert && assert( false, 'vector sums are never disposed' );
    }
  }

  return vectorAddition.register( 'VectorSumNode', VectorSumNode );
} );