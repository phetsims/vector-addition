// Copyright 2019, University of Colorado Boulder

/**
 * Model for a VectorSet on the 'Equation' screen
 *
 * Extends VectorSet but:
 *  - locks the vector set. EquationVectorSets have a defined amount of vectors.
 *  - creates a EquationVectorSum
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationVector = require( 'VECTOR_ADDITION/equation/model/EquationVector' );
  const EquationVectorSum = require( 'VECTOR_ADDITION/equation/model/EquationVectorSum' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const VECTOR_SET_OPTIONS = {
    initializeSum: false // Equation vector set will initialize all the vectors
  };

  // Array of the Object literals that represent the initial state of Vectors on a Equation Vector Set
  const EQUATION_SET_VECTORS = [ {
    vectorTail: new Vector2( 5, 10 ),
    vectorComponents: new Vector2( 0, 5 ),
    baseVectorTail: new Vector2( 45, 20 )
  }, {
    vectorTail: new Vector2( 15, 10 ),
    vectorComponents: new Vector2( 5, 5 ),
    baseVectorTail: new Vector2( 45, 5 )
  } ];

  const SUM_VISIBLE_PROPERTY = new BooleanProperty( true ); // Equation Vector Sums are always visible

  class EquationVectorSet extends VectorSet {

    /**
     * @param {EquationGraph} equationGraph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorColorGroups} vectorColorGroup - each vector set can only represent one vector color group
     * @param {CoordinateSnapModes} coordinateSnapMode - each vector set can only represent one snap mode
     */
    constructor( equationGraph, componentStyleProperty, vectorColorGroup, coordinateSnapMode ) {

      super( equationGraph,
        componentStyleProperty,
        SUM_VISIBLE_PROPERTY,
        vectorColorGroup,
        VECTOR_SET_OPTIONS );

      // @public (read-only) {array.<string>} symbols
      this.symbols = coordinateSnapMode === CoordinateSnapModes.CARTESIAN ?
                     VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                     VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

      //----------------------------------------------------------------------------------------
      // Create the equationVectors, one less then symbols
      // For example, if symbols were [ 'A', 'B', 'C' ], 'A' and 'B' would be equation Vector symbols
      // and C would be the equation vector sum
      assert && assert( this.symbols.length - 1 === EQUATION_SET_VECTORS.length );

      for ( let i = 0; i < EQUATION_SET_VECTORS.length; i++ ) {

        const equationVector = new EquationVector( EQUATION_SET_VECTORS[ i ].vectorTail,
          EQUATION_SET_VECTORS[ i ].vectorComponents,
          EQUATION_SET_VECTORS[ i ].baseVectorTail,
          equationGraph,
          this,
          this.symbols[ i ] );

        this.vectors.push( equationVector );
      }

      //----------------------------------------------------------------------------------------
      // Create the vector sum

      // @public (read-only) {EquationVectorSum}
      this.vectorSum = new EquationVectorSum( equationGraph,
        this,
        equationGraph.equationTypeProperty,
        _.last( this.symbols ) );

    }

    /**
     * Resets the vector set.
     * @override
     * @public
     */
    reset() {
      this.vectors.forEach( ( vector ) => {
        vector.reset();
      } );
      this.vectorSum.reset();
    }
  }

  return vectorAddition.register( 'EquationVectorSet', EquationVectorSet );
} );