// Copyright 2019, University of Colorado Boulder

/**
 * Model for a VectorSet on the 'Equation' screen
 *
 * Extends VectorSet but:
 *  - locks the vector set. EquationVectorSets have a defined amount of vectors.
 *  - creates a EquationVectorSum
 *  - separate coefficient panels for each equation type.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVector = require( 'VECTOR_ADDITION/equation/model/EquationVector' );
  const EquationVectorSum = require( 'VECTOR_ADDITION/equation/model/EquationVectorSum' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const VECTOR_SET_OPTIONS = {
    initializeSum: false // Equation vector set will initialize all the vectors
  };

  // Array of the vectors in an equation set
  const EQUATION_SET_VECTORS = [ {
    vectorTail: new Vector2( 5, 10 ),
    vectorComponents: new Vector2( 0, 5 ),
    baseVectorTail: new Vector2( 45, 20 )
  }, {
    vectorTail: new Vector2( 15, 10 ),
    vectorComponents: new Vector2( 5, 5 ),
    baseVectorTail: new Vector2( 45, 5 )
  }
  ];

  class EquationVectorSet extends VectorSet {
    /**
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorGroups} vectorGroup - each vector set can only represent one vector group
     * @param {CoordinateSnapModes} coordinateSnapMode - each vector set can only represent one snap mode
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     */
    constructor( graph,
                 componentStyleProperty,
                 vectorGroup,
                 coordinateSnapMode,
                 equationTypeProperty
    ) {


      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );

      super( graph,
        componentStyleProperty,
        new BooleanProperty( true ),
        vectorGroup,
        VECTOR_SET_OPTIONS );

      // @public (read-only) {array.<string>} symbols
      this.symbols = coordinateSnapMode === CoordinateSnapModes.CARTESIAN ?
                     VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                     VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

      //----------------------------------------------------------------------------------------
      // Create the equationVectors, one less then symbols
      // For example, if symbols were [ 'A', 'B', 'C' ], 'A' and 'B' would be equation Vector modules
      // and C would be the equation vector sum
      assert && assert( this.symbols.length - 1 === EQUATION_SET_VECTORS.length );

      for ( let i = 0; i < EQUATION_SET_VECTORS.length; i++ ) {

        const equationVector = new EquationVector( EQUATION_SET_VECTORS[ i ].vectorTail,
          EQUATION_SET_VECTORS[ i ].vectorComponents,
          EQUATION_SET_VECTORS[ i ].baseVectorTail,
          graph,
          this,
          graph.equationTypeProperty,
          this.symbols[ i ] );

        this.vectors.push( equationVector );
      }

      //----------------------------------------------------------------------------------------
      // Create the vector sum

      // @public (read-only) {EquationVectorSum}
      this.vectorSum = new EquationVectorSum( graph, this, equationTypeProperty, _.last( this.symbols ) );

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