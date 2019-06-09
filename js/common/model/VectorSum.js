// Copyright 2019, University of Colorado Boulder

/**
 * Model for vectorial sum of all the vectors in observable array
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorSum extends Vector {

    /**
     * Create a model for the sum of vector
     * @constructor
     * @param {ObservableArray.<Vector>} vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {Object} [options]
     *
     */
    constructor( vectors, modelViewTransformProperty, options ) {

      // create a vector at origin of initial length zero
      // TODO: what should be a good tailPosition?


      options = _.extend( {
        label: 'S',
        isTipDraggable: false
      }, options );

      super( Vector2.ZERO, 0, 0, modelViewTransformProperty, options );

      const updateSum = ( attributesVector, oldAttributesVector ) =>
        this.attributesVectorProperty.set( this.attributesVectorProperty.value.plus( attributesVector ).minus( oldAttributesVector ) );

      vectors.addItemAddedListener( ( addedVector ) => {

        // calculate the sum when the vector is added
        this.attributesVectorProperty.set( this.attributesVectorProperty.value.plus( addedVector.attributesVectorProperty.value ) );

        // calculate the sum when the vector is changed
        addedVector.attributesVectorProperty.lazyLink( updateSum );
      } );

      vectors.addItemRemovedListener( ( removedVector ) => {

        // calculate the sum when the vector is removed
        this.attributesVectorProperty.set( this.attributesVectorProperty.value.minus( removedVector.attributesVectorProperty.value ) );

        // remove listener
        removedVector.attributesVectorProperty.unlink( updateSum );
      } );

    }

// @public resets the vector
    reset() {
      super.reset();
    }
  }

  return vectorAddition.register( 'VectorSum', VectorSum );
} );