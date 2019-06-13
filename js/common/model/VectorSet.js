// Copyright 2019, University of Colorado Boulder

/**
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  
  class VectorSet {

    /**
     * @constructor
     */
    constructor( modelViewTransformProperty, graphModelBounds ) {
      // TODO: make a model enumeration for the different types of vectors
      // VECTOR_TYPES.BLUE
      // TODO: find better names for these types of variables, having the color in the name is bad.

      @public {ObservableArray.<VectorModel>} - the vectors that appear on the graph (not including the sum vector)
      this.vectors = new ObservableArray();

      // @public {VectorModel} the vector sum model
      this.vectorSum = new VectorSum( this.vectors, modelViewTransformProperty, graphModelBounds );

      // @public (read-only)
      // this.vectorOrientation = vectorOrientation;
    }

  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );