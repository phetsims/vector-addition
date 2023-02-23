// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationsVectorSet is a specialization of VectorSet for the 'Equations' screen.  It adds:
 *
 *  - a predefined set of vectors; vectors cannot be added or removed
 *  - an EquationsSumVector
 *
 * @author Brandon Li
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsSumVector from './EquationsSumVector.js';
import EquationsVector from './EquationsVector.js';

// Describes the initial vectors for Cartesian snap mode. See https://github.com/phetsims/vector-addition/issues/227
const CARTESIAN_VECTOR_DESCRIPTIONS = [

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
    vectorComponents: Vector2.createPolar( 8, Utils.toRadians( 45 ) ),
    vectorTail: new Vector2( 15, 5 ),
    baseVectorTail: new Vector2( 35, 5 )
  }
];

export default class EquationsVectorSet extends VectorSet {

  /**
   * @param {EquationsGraph} graph
   * @param {BooleanProperty} sumVisibleProperty
   * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
   * @param {VectorColorPalette} vectorColorPalette - color palette for vectors in this set
   * @param {CoordinateSnapModes} coordinateSnapMode - each vector set can only represent one snap mode
   * @param {Object} [options]
   */
  constructor( graph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode, options ) {

    options = merge( {

      // EquationsVectorSet will initialize its own sum vector, because the sum vector in this screen is different.
      // It's not truly a sum, and its computation depends on which equation type is selected (see EquationTypes).
      initializeSum: false,

      // offsets for sum component vectors in PROJECTION style
      sumProjectionXOffset: 0.5,
      sumProjectionYOffset: 0.5
    }, options );

    super( graph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, options );

    // @public (read-only) {string[]} symbols
    this.symbols = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) ?
                   VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                   VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

    //----------------------------------------------------------------------------------------------------
    // Create the vectors, one less than symbols. For example, if symbols were [ 'a', 'b', 'c' ],
    // 'a' and 'c' would be vector symbols and 'c' would be the sum vector.

    const vectorDescriptions = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) ?
                               CARTESIAN_VECTOR_DESCRIPTIONS :
                               POLAR_VECTOR_DESCRIPTIONS;
    assert && assert( vectorDescriptions.length === this.symbols.length - 1 );

    for ( let i = 0; i < vectorDescriptions.length; i++ ) {

      const vectorDescription = vectorDescriptions[ i ];

      // verify that all fields in the description are present
      assert && assert( vectorDescription.vectorTail, 'missing vectorTail' );
      assert && assert( vectorDescription.vectorComponents, 'missing vectorComponents' );
      assert && assert( vectorDescription.baseVectorTail, 'missing baseVectorTail' );

      const vector = new EquationsVector(
        vectorDescription.vectorTail,
        vectorDescription.vectorComponents,
        vectorDescription.baseVectorTail,
        graph,
        this,
        this.symbols[ i ] );

      this.vectors.push( vector );
    }

    //----------------------------------------------------------------------------------------
    // Create the sum vector

    // @public (read-only) {EquationsSumVector}
    this.sumVector = new EquationsSumVector( graph, this, graph.equationTypeProperty,
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

vectorAddition.register( 'EquationsVectorSet', EquationsVectorSet );