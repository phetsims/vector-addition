// Copyright 2019, University of Colorado Boulder

/**
 * EquationVectorSet is a specialization of VectorSet for the 'Equation' screen.  It adds:
 *
 *  - a predefined set of vectors; vectors cannot be added or removed
 *  - an EquationSumVector
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationVector = require( 'VECTOR_ADDITION/equation/model/EquationVector' );
  const EquationSumVector = require( 'VECTOR_ADDITION/equation/model/EquationSumVector' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const VECTOR_SET_OPTIONS = {
    initializeSum: false // Equation vector set will initialize all the vectors
  };

  // Describes the initial vectors for Cartesian snap mode. See https://github.com/phetsims/vector-addition/issues/227
  const CARTESTIAN_VECTOR_DESCRIPTIONS = [

    // a
    {
      vectorComponents: new Vector2( 0, 5 ),
      vectorTail: new Vector2( 5, 5 ),
      baseVectorTail: new Vector2( 35, 15 )
    },

    // b
    {
      vectorComponents: new Vector2( 5, 5 ),
      vectorTail: new Vector2( 15, 5 ),
      baseVectorTail: new Vector2( 35, 5 )
    }
  ];

  // Describes the initial vectors for polar snap mode. See https://github.com/phetsims/vector-addition/issues/227
  const POLAR_VECTOR_DESCRIPTIONS = [

    // d
    {
      vectorComponents: Vector2.createPolar( 5, 0 ),
      vectorTail: new Vector2( 5, 5 ),
      baseVectorTail: new Vector2( 35, 15 )
    },

    // e
    {
      vectorComponents: Vector2.createPolar( 8, Util.toRadians( 45 ) ),
      vectorTail: new Vector2( 15, 5 ),
      baseVectorTail: new Vector2( 35, 5 )
    }
  ];

  class EquationVectorSet extends VectorSet {

    /**
     * @param {EquationGraph} equationGraph
     * @param {BooleanProperty} sumVisibleProperty
     * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
     * @param {VectorColorPalette} vectorColorPalette - color palette for vectors in this set
     * @param {CoordinateSnapModes} coordinateSnapMode - each vector set can only represent one snap mode
     */
    constructor( equationGraph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode ) {

      super( equationGraph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, VECTOR_SET_OPTIONS );

      // @public (read-only) {string[]} symbols
      this.symbols = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) ?
                     VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                     VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

      //----------------------------------------------------------------------------------------------------
      // Create the equationVectors, one less then symbols. For example, if symbols were [ 'a', 'b', 'c' ],
      // 'a' and 'c' would be equation Vector symbols and 'c' would be the equation sum vector.

      const vectorDescriptions = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) ?
                                 CARTESTIAN_VECTOR_DESCRIPTIONS :
                                 POLAR_VECTOR_DESCRIPTIONS;
      assert && assert( vectorDescriptions.length === this.symbols.length - 1 );

      for ( let i = 0; i < vectorDescriptions.length; i++ ) {

        const equationVector = new EquationVector( vectorDescriptions[ i ].vectorTail,
          vectorDescriptions[ i ].vectorComponents,
          vectorDescriptions[ i ].baseVectorTail,
          equationGraph,
          this,
          this.symbols[ i ] );

        this.vectors.push( equationVector );
      }

      //----------------------------------------------------------------------------------------
      // Create the sum vector

      // @public (read-only) {EquationSumVector}
      this.sumVector = new EquationSumVector( equationGraph, this, equationGraph.equationTypeProperty,
        _.last( this.symbols ) );
    }

    /**
     * Resets the vector set.
     * @override
     * @public
     */
    reset() {

      // We are not calling super.reset because the default behavior is to dispose of all vectors in this.vectors.
      // In the Equations screen, vectors are created automatically at startup, and there is no way to created them
      // via the UI.  So we want to keep them around, but reset them.
      // See https://github.com/phetsims/vector-addition/issues/143
      this.vectors.forEach( vector => { vector.reset(); } );

      this.sumVector.reset();
    }
  }

  return vectorAddition.register( 'EquationVectorSet', EquationVectorSet );
} );