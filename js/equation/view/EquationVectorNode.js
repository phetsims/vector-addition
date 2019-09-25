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
     * @param {Object} [options]
     */
    constructor( vector, graph, valuesVisibleProperty, anglesVisibleProperty, options ) {

      super( vector, graph, valuesVisibleProperty, anglesVisibleProperty, options );

      // Double check that the vector node never is animated back
      // Doesn't need to be unlinked since sum vectors are never disposed.
      assert && this.animateBackProperty.link( animateBack => {
        if ( animateBack === true ) {
          assert( false, 'EquationVectorNode instances should never be animated back' );
        }
      } );

      vector.coefficientProperty.link( () => this.labelNode.update() );
    }

    /**
     * Double check to make sure EquationVectorNodes are never disposed
     * @public
     * @override
     */
    dispose() { assert && assert( false, 'EquationVectorNode instances should never be disposed' ); }
  }

  return vectorAddition.register( 'EquationVectorNode', EquationVectorNode );
} );