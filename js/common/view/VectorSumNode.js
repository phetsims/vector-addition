// Copyright 2019, University of Colorado Boulder

/**
 * View for a vector sum. Vector Sum Nodes have a distinct appearance for each vector group.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class VectorSumNode extends VectorNode {
    /**
     * @constructor
     * @param {VectorModel} vectorModel- the vector model
     * @param {Graph} graph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {Object} [arrowOptions]
     */
    constructor( vectorModel, graph, valuesVisibleProperty, angleVisibleProperty, sumVisibleProperty, arrowOptions ) {

      arrowOptions = _.extend( {

        // Passed to superclass
        fill: VectorAdditionColors[ vectorModel.vectorGroup ].sum
      }, arrowOptions );

      super( vectorModel, graph, valuesVisibleProperty, angleVisibleProperty, arrowOptions );

      // Update the visibility of the sum node based on the sum checkbox
      // Doesn't need to be unlinked since vector sums are never disposed
      sumVisibleProperty.linkAttribute( this, 'visible' );
    }

    /**
     * Double check to make sure vector sums are never disposed
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'vector sums are never disposed' );
    }
  }

  return vectorAddition.register( 'VectorSumNode', VectorSumNode );
} );