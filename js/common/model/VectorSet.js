// Copyright 2019, University of Colorado Boulder

/**
 * VectorSet is the model for a related set of vectors, and contains:
 *
 *  - an ObservableArray of vectors
 *  - a sum vector of those vectors
 *  - a color palette that is common to all vectors
 *
 * A Graph can support multiple VectorSets. (e.g. Lab screen has 2 VectorSets per Graph)
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
  const SumVector = require( 'VECTOR_ADDITION/common/model/SumVector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // The symbol for the sum vector.
  // The reason this isn't translatable is https://github.com/phetsims/vector-addition/issues/10.
  const SUM_SYMBOL = 's';

  class VectorSet {

    /**
     * @param {Graph} graph - the graph the VectorSet belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - component style for all vectors
     * @param {BooleanProperty} sumVisibleProperty - controls whether the sum vector is visible
     * @param {VectorColorPalette} vectorColorPalette - color palette for vectors in this set
     * @param {Object} [options]
     */
    constructor( graph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, options ) {

      options = _.extend( {

        // {boolean} false means that the default SumVector will not be created, and a subclass is responsible
        // for initializing this.sumVector.
        initializeSum: true,

        // {Vector2} initial tail position of the sum. Only used if options.initializeSum = true
        initialSumTailPosition: graph.graphModelBounds.center

      }, options );

      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette,
        `invalid vectorColorPalette: ${vectorColorPalette}` );

      // @public {ObservableArray.<Vector>} the vectors in the VectorSet, excluding the sum vector
      this.vectors = new ObservableArray();

      // @public (read-only) {VectorColorPalette}
      this.vectorColorPalette = vectorColorPalette;

      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = sumVisibleProperty;

      // @public (read-only) {componentStyleProperty} componentStyleProperty
      this.componentStyleProperty = componentStyleProperty;

      if ( options.initializeSum ) {
        // @public (read-only)
        this.sumVector = new SumVector( options.initialSumTailPosition, graph, this, SUM_SYMBOL );
      }
    }

    /**
     * Resets the VectorSet.  Called when the Reset All button is pressed.
     * @public
     */
    reset() {

      this.erase();

      assert && assert( this.sumVector, 'sumVector was never initialized' );
      this.sumVector.reset();
    }

    /**
     * Erases all vectors (except the sum) from the VectorSet. Called when the eraser button is pressed.
     * @public
     */
    erase() {
      while ( this.vectors.length ) {
        this.vectors.pop().dispose();
      }
    }
  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );