// Copyright 2019, University of Colorado Boulder

/**
 * Model for vectorial sum of all the vectors of a vector set. Only calculates the sum of the vectors
 * that are on the graph.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants

  // The label of the vector when its active if and only if the user doesn't provide the label option.
  // The reason this isn't translatable is: https://github.com/phetsims/vector-addition/issues/10.
  const FALLBACK_VECTOR_LABEL = 'v';


  class VectorSum extends VectorModel {
    /**
     * @constructor
     * @param {Graph} graph - graph to add the vector to
     * @param {VectorSet} - the vector set that the sum represents
     * @param {Object} [options]
     */
    constructor( graph, vectorSet, options ) {

      options = _.extend( {

        // Passed to super class
        label: 's', // {string|null} - the label of the vector. If null, the vector will display a the fallback label
        // when its active

        isTipDraggable: false // {boolean} - false means the tip won't be draggable
      }, options );


      //----------------------------------------------------------------------------------------

      // Get the initial position for the tail of the vector, which is the graphs center
      const initialPosition = graph.graphModelBounds.center;

      super( initialPosition, 0, 0, graph, vectorSet, options );

      // @public (read-only)
      this.fallbackLabel = FALLBACK_VECTOR_LABEL;

      // Vector sums are always on the graph
      this.isOnGraphProperty.value = true;

      // @private {ObservableArray.<VectorModel>}
      this.vectors = vectorSet.vectors;

      //----------------------------------------------------------------------------------------

      // Observe changes to the vector array. Never removed because the vector sum exists throughout the entire sim.
      vectorSet.vectors.addItemAddedListener( ( addedVector ) => {

        const vectorObserver = Property.multilink(
          [ addedVector.attributesVectorProperty, addedVector.isOnGraphProperty ], () => {
            this.updateSum();
          } );
        
        const vectorRemovedListener = ( removedVector ) => {
          if ( removedVector === addedVector ) {

            this.updateSum();
            vectorObserver.dispose();
            vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
          }
        };

        vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
      } );
    }

    /** 
     * The sum is never disposed. Check to make sure the sum isn't disposed.
     * @public
     * @override
     */
    dispose() { throw new Error( 'Vector Sum is never disposed' ); }

    /**
     * Updates the sum. Since vectors are created the second the creator icon is clicked, but still aren't on the graph
     * and shouldn't be apart of the sum, create a multilink. Vectors are also not removed until animated back, but also
     * those vectors shouldn't be calculated in the sum.
     * In short, this calculates the sum based on the sum of the vectors that are on graph
     * @public
     */
    updateSum() {

      const onGraphVectors = this.vectors.filter( ( vector ) => {
        return vector.isOnGraphProperty.value;
      } );

      let sumVector = Vector2.ZERO;

      onGraphVectors.forEach( ( vector ) => {
        sumVector = sumVector.plus( vector.attributesVector );
      } );

      this.attributesVector = sumVector;
    }



    /**
     * Resets the position vector sum. This only resets the tail position, as its components depend on the rest of the
     * vector set.
     * @public
     */
    reset() {
      this.tailPositionProperty.reset();
    }

  }

  return vectorAddition.register( 'VectorSum', VectorSum );
} );