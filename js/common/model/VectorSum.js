// Copyright 2019, University of Colorado Boulder

/**
 * Model for vectorial sum of all the vectors in an observable array
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  class VectorSum extends VectorModel {
    /**
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorTypes} vectorType
     * @param {Bounds2} graphModelBounds
     * @param {Object} [options]
     *
     */
    constructor(
      vectors,
      modelViewTransformProperty,
      componentStyleProperty,
      vectorType,
      graphModelBounds,
      options ) {

      options = _.extend( {
        label: 's',// {string} - the label of the vector
        isTipDraggable: false // {boolean} - can the tip be dragged
      }, options );


      //----------------------------------------------------------------------------------------

      // Type check arguments
      assert && assert( vectors instanceof ObservableArray
      && vectors.filter( vector => !( vector instanceof VectorModel ) ).length === 0,
        `invalid vectors: ${vectors}` );
      assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds ${graphModelBounds}` );
      // The rest are checked in super classes

      //----------------------------------------------------------------------------------------

      // {Vector2} initial position of the tail of the vector sum
      const initialPosition = graphModelBounds.center;

      super( initialPosition, 0, 0, modelViewTransformProperty, componentStyleProperty, vectorType, options );


      // Function to update the sum Vector when a vector is added or modified.
      const updateSum = ( attributesVector, oldAttributesVector ) => {

        // add the current value of the new vector
        this.attributesVectorProperty.value = this.attributesVectorProperty.value.plus( attributesVector );

        // remove the old value of the vector to get the change in the vector.
        if ( oldAttributesVector ) {
          this.attributesVectorProperty.value = this.attributesVectorProperty.value.minus( oldAttributesVector );
        }
      };


      vectors.addItemAddedListener( ( addedVector ) => {

        // calculate the sum when the vector is changed or added
        addedVector.attributesVectorProperty.link( updateSum );

        const removalListener = ( removedVector ) => {
          if ( removedVector === addedVector ) {

            // recalculate the sum when the vector is removed
            this.attributesVectorProperty.value =
              this.attributesVectorProperty.value.minus( removedVector.attributesVectorProperty.value );

            // remove listener
            removedVector.attributesVectorProperty.unlink( updateSum );

            vectors.removeItemRemovedListener( removalListener );
          }
        };

        vectors.addItemRemovedListener( removalListener );
      } );
    }

    // No need to add a dispose for the new properties since the sum exists the entire sim
    // @override
    dispose() {
      throw new Error( 'Vector Sum is never disposed' );
    }
  }

  return vectorAddition.register( 'VectorSum', VectorSum );
} );