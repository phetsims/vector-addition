// Copyright 2019, University of Colorado Boulder

/**
 * Vector for the equation screen
 * Responsible for updating the label when the coefficient changes.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class EquationVectorNode extends VectorNode {
    /**
     * @param {Vector} vector- the vector model
     * @param {Graph} graph - the graph the vector belongs to
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} anglesVisibleProperty
     * @param {Object} [arrowOptions]
     */
    constructor( vector, graph, valuesVisibleProperty, anglesVisibleProperty, arrowOptions ) {


      super( vector, graph, valuesVisibleProperty, anglesVisibleProperty, arrowOptions );


      // Double check that the vector node never is animated back
      // Doesn't need to be unlinked since vector sums are never disposed.
      assert && this.animateBackProperty.link( ( animateBack ) => {
        if ( animateBack === true ) {
          assert( false, 'vector sums are never animated back' );
        }
      } );


      vector.coefficientProperty.link( () => {
        this.labelNode.updateLabelNode( valuesVisibleProperty.value );
      } );

    }

    /**
     * Double check to make sure vector sums are never disposed
     * @public
     * @override
     */
    dispose() { assert && assert( false, 'vector sums are never disposed' ); }
  }

  return vectorAddition.register( 'EquationVectorNode', EquationVectorNode );
} );