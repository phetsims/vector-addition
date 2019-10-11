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
  const merge = require( 'PHET_CORE/merge' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

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
     * @param {Object} [options]
     */
    constructor( equationGraph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode, options ) {

      options = merge( {

        // EquationVectorSet will initialize its own sum vector, because the sum vector in this screen is different.
        // It's not truly a sum, and its computation depends on which equation type is selected (see EquationTypes).
        initializeSum: false,

        // offsets for sum component vectors in PROJECTION style
        sumProjectionXOffset: 0.5,
        sumProjectionYOffset: 0.5
      }, options );

      super( equationGraph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, options );

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

        const vectorDescription = vectorDescriptions[ i ];

        // verify that all fields in the description are present
        assert && assert( vectorDescription.vectorTail, 'missing vectorTail' );
        assert && assert( vectorDescription.vectorComponents, 'missing vectorComponents' );
        assert && assert( vectorDescription.baseVectorTail, 'missing baseVectorTail' );

        const equationVector = new EquationVector(
          vectorDescription.vectorTail,
          vectorDescription.vectorComponents,
          vectorDescription.baseVectorTail,
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
      this.sumVector.setProjectionOffsets( options.sumProjectionXOffset, options.sumProjectionYOffset );
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