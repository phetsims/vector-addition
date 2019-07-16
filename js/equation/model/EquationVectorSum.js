// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends Vector and adds the following functionality:
 *  - Takes an array of EquationVectors and calculates its components based on the vectors and the
 *    equationType
 *  - Disables tip dragging and removing of vectors
 *
 * Equation sum vectors are created at the start of the sim, and are never disposed. They require a symbol.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants

  class EquationVectorSum extends VectorSum {
    /**
     * @param {Graph} graph - graph the vector sum belongs to
     * @param {VectorSet} - the vector set that the sum represents
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( graph, vectorSet, equationType, symbol ) {

      // assert && assert( equationTypeProperty instanceof EnumerationProperty
      // && EquationTypes.includes( equationTypeProperty.value ),
      //   `invalid equationTypeProperty: ${equationTypeProperty}` );

      super( graph.graphModelBounds.center, graph, vectorSet, symbol );

      //----------------------------------------------------------------------------------------

      // @private {EquationTypes}
      this.equationType = equationType;

      //----------------------------------------------------------------------------------------
      // Observe when each vector changes and/or when the equationType changes to calculate the sum
      const dependencies = [];

      vectorSet.vectors.forEach( vector => {
        dependencies.push( vector.vectorComponentsProperty );
      } );

      // Doesn't need to be unlinked since each vector in equationvectorSet are never disposed and the equation vector
      // sum is never disposed
      Property.multilink( dependencies,
        () => {
          this.updateSum( vectorSet.vectors );
        } );

    }

    /**
     * @override
     * Calculate the vector sum for the equation screen.
     *
     * @param {ObservableArray.<VectorsModel>} vectors
     * @public
     */
    updateSum( vectors ) {

      const equationType = this.equationType;

      // Denoted by 'a' + 'b' = 'c'
      if ( equationType === EquationTypes.ADDITION ) {
        const sum = new Vector2( 0, 0 );

        vectors.forEach( vector => {
          sum.add( vector.vectorComponents );
        } );

        this.vectorComponents = sum;
      }
      else if ( equationType === EquationTypes.SUBTRACTION ) {
        const difference = new Vector2( 0, 0 );

        let vectorIndex = 0;
        vectors.forEach( vector => {
          if ( !vectorIndex ) {
            difference.add( vector.vectorComponents );
          }
          else {
            difference.subtract( vector.vectorComponents );
          }
          vectorIndex++;
        } );

        this.vectorComponents = difference;
      }
      else if ( equationType === EquationTypes.NEGATION ) {
        // Same as addition but negated  : a + b = -c or a + b + c = 0

        const sum = new Vector2( 0, 0 );

        vectors.forEach( vector => {
          sum.add( vector.vectorComponents );
        } );

        this.vectorComponents = sum.negate();
      }
    }

  }

  return vectorAddition.register( 'EquationVectorSum', EquationVectorSum );
} );