// Copyright 2019, University of Colorado Boulder

/**
 * Model for vectorial sum of all the vectors in observable array
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorSum extends VectorModel {

    /**
     * Create a model for the sum of vector
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {Bounds2} graphModelBounds
     * @param {Object} [options]
     *
     */
    constructor( vectors, modelViewTransformProperty, graphModelBounds, options ) {

      // get the position of where to put the vector initially
      const spawnPosition = new Vector2( graphModelBounds.centerX, graphModelBounds.centerY );

      options = _.extend( {
        label: 's',
        isTipDraggable: false
      }, options );

      super( spawnPosition, 0, 0, modelViewTransformProperty, options );

      this.isTipDraggingProperty.link( isTipDragging => {
        if ( isTipDragging ) {
          throw new Error( 'the tip of the sum vector should not be draggable' );
        }
      } );

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