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
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  
  class VectorSet {

    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property of the view/model coordinate 
     * transform of the graph
     * @param {Bounds2} graphModelBounds - the graph bounds (model coordinates)
     */
    constructor( modelViewTransformProperty, graphModelBounds ) {

      // @public {ObservableArray.<VectorModel>} - the vectors that appear on the graph (not including the sum vector)
      this.vectors = new ObservableArray();

      // @public {VectorModel} the vector sum model
      this.vectorSum = new VectorSum( this.vectors, modelViewTransformProperty, graphModelBounds );

    }
    /**
     * @public
     * reset the vector set
     */
    reset() {
      this.vectors.clear();
    }

  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );