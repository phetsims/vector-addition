// Copyright 2019, University of Colorado Boulder

/**
 * Vector for the vector sum.
 *
 * Extends Vector Node but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on the sumVisibleProperty
 *  - disables ability to take the sum vector node off of the graph
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  class VectorSumNode extends VectorNode {
    /**
     * @param {VectorSum} vectorSum - the model for the vector sum
     * @param {Graph} graph - the graph the sum belongs to
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {Object} [arrowOptions]
     */
    constructor( vectorSum, graph, valuesVisibleProperty, angleVisibleProperty, sumVisibleProperty, arrowOptions ) {

      assert && assert( vectorSum instanceof VectorSum, `invalid vectorSum: ${vectorSum}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( !arrowOptions || Object.getPrototypeOf( arrowOptions ) === Object.prototype,
        `Extra prototype on arrowOptions: ${arrowOptions}` );

      //----------------------------------------------------------------------------------------

      arrowOptions = _.extend( {

        // Passed to superclass
        fill: VectorAdditionColors[ vectorSum.vectorColorGroup ].sum,
        lineWidth: 0.5
      }, arrowOptions );

      //----------------------------------------------------------------------------------------

      super( vectorSum, graph, valuesVisibleProperty, angleVisibleProperty, arrowOptions );

      // Update the visibility of the sum node based on the sum visible Property.
      // Doesn't need to be unlinked since vector sums are never disposed
      sumVisibleProperty.linkAttribute( this, 'visible' );

      // Double check that the vector node never is animated back
      // Doesn't need to be unlinked since vector sums are never disposed.
      assert && vectorSum.animateBackProperty.link( ( animateBack ) => {
        if ( animateBack === true ) {
          assert( false, 'vector sums are never animated back' );
        }
      } );
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