// Copyright 2019, University of Colorado Boulder

/**
 * Vector for the vector sum. Each vector set will have exactly one sum. Vector Sum Nodes have a distinct appearance for
 * each vector set.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
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

      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( !arrowOptions || Object.getPrototypeOf( arrowOptions ) === Object.prototype,
        `Extra prototype on arrowOptions: ${arrowOptions}` );

      arrowOptions = _.extend( {
        // Passed to superclass
        fill: VectorAdditionColors[ vectorModel.vectorGroup ].sum
      }, arrowOptions );

      //----------------------------------------------------------------------------------------

      super( vectorModel, graph, valuesVisibleProperty, angleVisibleProperty, arrowOptions );

      // Update the visibility of the sum node based on the sum visible property.
      // Doesn't need to be unlinked since vector sums are never disposed
      sumVisibleProperty.linkAttribute( this, 'visible' );
    }

    /**
     * Double check to make sure vector sums are never disposed
     * @public
     * @override
     */
    dispose() { assert && assert( false, 'vector sums are never disposed' ); }
  }

  return vectorAddition.register( 'VectorSumNode', VectorSumNode );
} );