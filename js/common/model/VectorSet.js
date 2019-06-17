// Copyright 2019, University of Colorado Boulder

/**
 * Model for a vectorSet. A vectorSet has two things: the vectors (ObservableArray), and a vectorSum.
 * Each scene, has an unknown amount of vectorSets.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ObservableArray = require( 'AXON/ObservableArray' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );
  // const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  class VectorSet {

    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property of the view/model coordinate
     * transform of the graph
     * @param {Bounds2} graphModelBounds - the graph bounds (model coordinates)
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( modelViewTransformProperty, graphModelBounds, componentStyleProperty, vectorType ) {

      // @public {ObservableArray.<VectorModel>} - the vectors that appear on the graph (not including the sum vector)
      this.vectors = new ObservableArray();

      // @public {VectorModel} the vector sum model
      this.vectorSum = new VectorSum( this.vectors, modelViewTransformProperty, componentStyleProperty, vectorType, graphModelBounds );

      // @public {VectorTypes}
      this.vectorType = vectorType;
    }

    /**
     * @public
     * reset the vector set
     */
    reset() {
      this.vectors.clear();
    }

    /**
     * Convenience method: Applies a callback function to iterate through each vector
     * @param {function( <VectorModel>, <boolean>)} callback
     * @public
     */
    forEachVector( callback ) {
      // combine the vectors and the vector sum into one array
      const combinedArray = this.vectors.getArray();
      combinedArray.push( this.vectorSum );

      this.vectors.forEach( ( vector ) => {
        const isSum = this.vectorSum === vector;
        callback( vector, isSum );
      });
    }

  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );