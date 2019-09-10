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
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  class VectorSumNode extends VectorNode {
    /**
     * @param {VectorSum} vectorSum - the model for the vector sum
     * @param {Graph} graph - the graph the sum belongs to
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} anglesVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {Object} [options]
     */
    constructor( vectorSum, graph, valuesVisibleProperty, anglesVisibleProperty, sumVisibleProperty, options ) {

      assert && assert( vectorSum instanceof VectorSum, `invalid vectorSum: ${vectorSum}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( anglesVisibleProperty instanceof BooleanProperty,
        `invalid anglesVisibleProperty: ${anglesVisibleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {
        arrowOptions: _.extend( {}, VectorAdditionConstants.SUM_VECTOR_OPTIONS, {
          fill: vectorSum.vectorColorPalette.sumFill,
          stroke: vectorSum.vectorColorPalette.sumStroke
        } )
      }, options );

      //----------------------------------------------------------------------------------------

      super( vectorSum, graph, valuesVisibleProperty, anglesVisibleProperty, options );

      // Update the visibility of the sum node based on the sum visible Property.
      // Doesn't need to be unlinked since vector sums are never disposed
      sumVisibleProperty.linkAttribute( this, 'visible' );

      // Making an active sum vector invisible clears activeVectorProperty. See #112.
      sumVisibleProperty.link( sumVisible => {
         if ( !sumVisible && graph.activeVectorProperty.value === vectorSum ) {
           graph.activeVectorProperty.value = null;
         }
      } );

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