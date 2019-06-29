// Copyright 2019, University of Colorado Boulder

/**
 * Model for vectorial sum of all the vectors of a vector set
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const Vector2 = require( 'DOT/Vector2' );
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

      this.isOnGraphProperty.value = true;
      //----------------------------------------------------------------------------------------

      // Observe changes to the vector array. Never removed because the vector sum exists throughout the entire sim.
      vectorSet.vectors.addItemAddedListener( ( addedVector ) => {

        //----------------------------------------------------------------------------------------
        // Since vectors are created the second the creator icon is clicked, but still aren't on the graph, this is also
        // called when the vector's isOnGraph Property changes. Vectors are also not removed until animated back, but
        // those vectors shouldn't be calculated in the sum
        //----------------------------------------------------------------------------------------

        // ** a multilink doesn't work for this situation since we need the old attributes vector ** //
       
        const attributesVectorListener = ( attributesVector, oldAttributesVector ) => {
          this.updateSum( attributesVector, oldAttributesVector );
        }

        const isOnGraphListener = ( isOnGraph ) => {
          if ( isOnGraph ) {
            // Calculate the sum when the vector is changed or added. Unable to use a multilink because the old value is
            // needed
            addedVector.attributesVectorProperty.link( attributesVectorListener );
          }
          else {
            addedVector.attributesVectorProperty.unlink( attributesVectorListener );
          } 
        }

        addedVector.isOnGraphProperty.lazyLink( isOnGraphListener );


        const vectorRemovedListener = ( removedVector ) => {
          if ( removedVector === addedVector ) {

            // Recalculate the sum when the vector is removed
            this.attributesVector = this.attributesVector.minus( removedVector.attributesVector );

            // Remove listeners
            removedVector.isOnGraphProperty.unlink( isOnGraphListener );

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
     * Updates the sum. Called when either a vector is added, removed. This assumes the vector isOnGraph is true.
     * @param {Vector2} attributesVector - the attributesVector of the updated vector
     * @param {Vector2} oldAttributesVector - needed to subtract the previous value
     */
    updateSum( attributesVector, oldAttributesVector ) {

      assert && assert( attributesVector instanceof Vector2, `invalid attributesVector: ${attributesVector}` );
      assert && assert( !oldAttributesVector || oldAttributesVector instanceof Vector2,
        `invalid oldAttributesVector: ${oldAttributesVector}` );

      // Add the current value of the new vector
      this.attributesVector = this.attributesVector.plus( attributesVector );

      // Remove the old value of the vector to get the change in the vector.
      if ( oldAttributesVector ) {
        this.attributesVector = this.attributesVector.minus( oldAttributesVector );
      }
 
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