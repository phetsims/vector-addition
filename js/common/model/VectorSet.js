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
  const ComponentVectorStyles = require( 'VECTOR_ADDITION/common/model/ComponentVectorStyles' );
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
     * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty - component style for all vectors
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
        initialSumTailPosition: graph.graphModelBounds.center,

        // Offsets from the x and y axes, used for the PROJECTION style for the primary vectors' component vectors,
        // in model coordinates. See https://github.com/phetsims/vector-addition/issues/225
        projectionXOffsetStart: -0.5,
        projectionYOffsetStart: -0.5,
        projectionXOffsetDelta: -0.7,
        projectionYOffsetDelta: -0.7,
        sumProjectionXOffset: 0.5,
        sumProjectionYOffset: 0.5

      }, options );

      assert && assert( componentStyleProperty instanceof EnumerationProperty && ComponentVectorStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

      // @public {ObservableArray.<Vector>} the vectors in the VectorSet
      // This array contains only what is referred to as main or parent vectors. It does not contain sum vectors,
      // component vectors, or base vectors.
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
        this.sumVector.setProjectionOffsets( options.sumProjectionXOffset, options.sumProjectionYOffset );
      }

      // Whenever a vector is added or removed, adjust the offsets of all component vectors for PROJECTION style.
      // See https://github.com/phetsims/vector-addition/issues/225
      // unlink is unnecessary, since VectorSet own this.vectors.
      this.vectors.lengthProperty.link( length => {
        for ( let i = 0; i < length; i++ ) {
          const xOffset = options.projectionXOffsetStart + i * options.projectionXOffsetDelta;
          const yOffset = options.projectionYOffsetStart + i * options.projectionYOffsetDelta;
          this.vectors.get( i ).setProjectionOffsets( xOffset, yOffset );
        }
      } );
    }

    /**
     * @public
     */
    dispose() {
      assert && assert( false, 'VectorSet is not intended to be disposed' );
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