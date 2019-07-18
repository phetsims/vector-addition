// Copyright 2019, University of Colorado Boulder

/**
 * Model for a VectorSet which contains:
 *  - an observable array of vectors
 *  - a vector sum of those vectors.
 *
 * A model graph can support multiple vectorSets. (e.g. lab screen has 2 vector sets per graph)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  // The symbol for the vector sum. The reason this isn't translatable is:
  // https://github.com/phetsims/vector-addition/issues/10.
  const SUM_SYMBOL = 's';


  class VectorSet {

    /**
     * @param {Graph} graph - the graph the vector set belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - each vector set has one sum visible Property
     * @param {VectorColorGroups} vectorColorGroup - each vector set can only represent one vector group
     * @param {Object} [options]
     */
    constructor( graph, componentStyleProperty, sumVisibleProperty, vectorColorGroup, options ) {

      options = _.extend( {

        initializeSum: true, // {boolean} false means the vector sum will not be initialized upon instantiation
        initialSumTailPosition: graph.graphModelBounds.center // {Vector2} initial tail position of the sum. Only used
                                                              // if options.initializeSum = true

      }, options );

      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup ), `invalid vectorColorGroup: ${vectorColorGroup}` );

      //----------------------------------------------------------------------------------------

      // @public {ObservableArray.<Vector>} vectors - ObservableArray of the vectors in the vector set excluding
      // sum
      this.vectors = new ObservableArray();

      // @public (read-only) {VectorColorGroups} vectorColorGroup - one vectorSet can only represent one vectorColorGroup
      this.vectorColorGroup = vectorColorGroup;

      // @public (read-only) {BooleanProperty} sumVisibleProperty - one vectorSet can only have one sum visible Property
      this.sumVisibleProperty = sumVisibleProperty;

      // @public (read-only) {componentStyleProperty} componentStyleProperty
      this.componentStyleProperty = componentStyleProperty;

      //----------------------------------------------------------------------------------------
      // Create the sum

      if ( options.initializeSum ) {
        // @public (read-only) {Vector} the vector sum model
        this.vectorSum = new VectorSum( options.initialSumTailPosition, graph, this, SUM_SYMBOL );
      }
    }

    /**
     * Resets the vector set, by clearing the vectors array and reseting the vectorSum. Called when the graph is erased.
     * @public
     */
    reset() {

      // Dispose each vector
      while ( this.vectors.length ) {
        this.vectors.pop().dispose();
      }

      assert && assert( this.vectorSum, 'vector sum was never instantiated' );
      this.vectorSum.reset();
    }
  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );