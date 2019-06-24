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
     * @param {VectorGroups} vectorGroup
     * @param {Bounds2} graphModelBounds
     * @param {Object} [options]
     */
    constructor( vectors, modelViewTransformProperty, componentStyleProperty, vectorGroup, graphModelBounds, options ) {

      options = _.extend( {
        label: 's',// {string} - the label of the vector
        isTipDraggable: false // {boolean} - can the tip be dragged
      }, options );

      assert && assert( vectors instanceof ObservableArray
      && vectors.filter( vector => !( vector instanceof VectorModel ) ).length === 0,
        `invalid vectors: ${vectors}` );
      assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds ${graphModelBounds}` );

      //----------------------------------------------------------------------------------------

      // Get the initial position for the tail of the vector, which is the graphs center
      const initialPosition = graphModelBounds.center;

      super( initialPosition, 0, 0, modelViewTransformProperty, componentStyleProperty, vectorGroup, options );

      //----------------------------------------------------------------------------------------
      // Function to update the Sum when a vector is added or modified.
      const updateSum = ( attributesVector, oldAttributesVector ) => {

        // Add the current value of the new vector
        this.attributesVector = this.attributesVector.plus( attributesVector );

        // Remove the old value of the vector to get the change in the vector.
        if ( oldAttributesVector ) {
          this.attributesVector = this.attributesVector.minus( oldAttributesVector );
        }
      };

      // Observe changes to the vector array to update the sum
      vectors.addItemAddedListener( ( addedVector ) => {

        // Calculate the sum when the vector is changed or added
        addedVector.attributesVectorProperty.link( updateSum );

        const vectorRemovedListener = ( removedVector ) => {
          if ( removedVector === addedVector ) {

            // Recalculate the sum when the vector is removed
            this.attributesVector = this.attributesVector.minus( removedVector.attributesVectorProperty.value );

            // Remove listener
            removedVector.attributesVectorProperty.unlink( updateSum );

            vectors.removeItemRemovedListener( vectorRemovedListener );
          }
        };

        vectors.addItemRemovedListener( vectorRemovedListener );
      } );
    }

    /**
     * The sum is never disposed. Check to make sure the sum isn't disposed.
     * @public
     * @override
     */
    dispose() { throw new Error( 'Vector Sum is never disposed' ); }
  }

  return vectorAddition.register( 'VectorSum', VectorSum );
} );