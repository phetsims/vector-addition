// Copyright 2019, University of Colorado Boulder

/**
 * An Equation Vector Set is a vector set with a defined amount of vectors.
 *
 * Vectors are created by instantiating EquationVectorModel and EquationVectorSum.
 *
 * EquationVectorSets are locked after initialization.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const EquationVectorModel = require( 'VECTOR_ADDITION/equation/model/EquationVectorModel' );
  const EquationVectorSum = require( 'VECTOR_ADDITION/equation/model/EquationVectorSum' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const VECTOR_SET_OPTIONS = {
    initializeSum: false // Equation vector set will initialize all the vectors
  };
  const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;

  const VECTOR_TAGS = VectorAdditionConstants.VECTOR_TAGS_GROUP_1;
    
  class EquationVectorSet extends VectorSet {
    /**
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - each vector set has one sum visible property
     * @param {VectorGroups} vectorGroup - each vector set can only represent one vector group
     * @param {CoordinateSnapModes} coordinateSnapMode - each vector set can only represent one snap mode
     * @param {Vector2} initialVectorComponents
     */
    constructor( graph,
        componentStyleProperty,
        sumVisibleProperty,
        vectorGroup,
        coordinateSnapMode,
        equationType
    ) {

      // assert && assert( initialVectorComponents instanceof Vector2,
      //   `invalid initialVectorComponents: ${initialVectorComponents}` );
      // assert && assert( equationTypeProperty instanceof EnumerationProperty
      // && EquationTypes.includes( equationType ),
      //   `invalid equationType: ${equationType}` );

      super( graph,
        componentStyleProperty,
        sumVisibleProperty,
        vectorGroup,
        VECTOR_SET_OPTIONS );

      //----------------------------------------------------------------------------------------
      // Create the equationVectorModel, one less then tags
      // For example, if tags were [ 'A', 'B', 'C' ], 'A' and 'B' would be equation Vector modules
      // and C would be the equation vector sum
      for ( let tagIndex = 0; tagIndex < VECTOR_TAGS.length - 1; tagIndex++ ) {

        const equationVector = new EquationVectorModel( graph.graphModelBounds.center,
          DEFAULT_VECTOR_LENGTH,
          DEFAULT_VECTOR_LENGTH,
          graph,
          this,
          VECTOR_TAGS[ tagIndex ] );

        this.vectors.push( equationVector );
      }

      this.equationType = equationType;

      //----------------------------------------------------------------------------------------
      // Create the vector sum

      // @public (read-only) {EquationVectorSum}
      this.vectorSum = new EquationVectorSum( graph, this, equationType, VECTOR_TAGS[ VECTOR_TAGS.length - 1 ] );

    }

    /**
     * @public
     * Resets the vector set, by clearing the vectors array and reseting the vectorSum
     */
    reset() {
      // Dispose each vector
      this.vectors.forEach( ( vector ) => {
        vector.reset();
      } );
      this.vectorSum.reset();
    }

    /**
     * @override
     * @public
     * Creates a vector model. This doesn't get added to the vector ObservableArray
     * @param {Vector2} tailPosition
     * @param {number} xComponent
     * @param {number} yComponent
     * @param {string|null} tag
     * @param {Object} [options] - passed to the vector model
     * @returns {VectorModel} the created vector model
     */
    createVector( tailPosition, xComponent, yComponent, tag, options ) {
      assert && assert( false, 'equation vector sets are locked' );
    }
  }

  return vectorAddition.register( 'EquationVectorSet', EquationVectorSet );
} );