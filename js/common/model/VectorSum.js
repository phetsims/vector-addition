// Copyright 2019, University of Colorado Boulder

/**
 * Model for the vector sum. A vector sum is the sum of all vectors for only one vector set.
 *
 * However, it's not as simple as just a quick add up, as vectors can change states and go from being on the graph to
 * off of the graph or vise versa.
 *
 * Vector Sums are created at the start of the sim, and exist throughout the entire simulation, leaving links as is.
 * However, they can be reset (which solely resets the location).
 *
 * As of now, vector sum's tails are initiated at the center of the graph.
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

  // Vector sums may get passed a tag (i.e. 'a', 'b', 'c', ...), but also may not. However, the inspect a vector 
  // panel (and other views) sill needs a tag to display. The fall back vector tag represents this and only is used
  // if and only if a tag isn't passed to the sum. See https://github.com/phetsims/vector-addition/issues/39 for more
  // context. The reason this isn't translatable is: https://github.com/phetsims/vector-addition/issues/10.
  const SUM_FALL_BACK_TAG = 's';

  // passed to super class
  const VECTOR_SUM_OPTIONS = {
    isTipDraggable: false, // Vector sums are not draggable by the tip. Their components are calculated from the vectors
    // in a vector set that are on the graph
    isRemovable: false // Vector sums are not removable which means they are also not disposable
  };

  class VectorSum extends VectorModel {
    /**
     * @constructor
     * @param {Graph} graph - graph the vector sum belongs to
     * @param {VectorSet} - the vector set that the sum represents
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( graph, vectorSet, tag ) {

      // Get the initial position for the tail of the vector, which is the graphs center
      const initialPosition = graph.graphModelBounds.center;

      // Initialize an arbitrary vector model. Its components and magnitude to be set later.
      super( initialPosition, new Vector2( 0, 0 ), graph, vectorSet, tag, VECTOR_SUM_OPTIONS );

      // @private {string} (see declaration of SUM_FALL_BACK_TAG for documentation)
      this.fallBackTag = SUM_FALL_BACK_TAG;

      //----------------------------------------------------------------------------------------
      // Double check that vector sums are never removed from the graph

      // Vector sums are always on the graph
      this.isOnGraphProperty.value = true;

      // Doesn't need to be unlinked; vector sums are never disposed
      this.isOnGraphProperty.link( ( isOnGraph ) => {
        if ( isOnGraph === false ) {
          assert && assert( false, 'vector sums should never be off the graph' );
        }
      } );

      //----------------------------------------------------------------------------------------

      // Observe changes to the vector array. Never removed because the vector sum exists throughout the entire sim.
      vectorSet.vectors.addItemAddedListener( ( addedVector ) => {

        // Observe when the vector changes to update the sum calculation
        const addedVectorMultilink = Property.multilink(
          [ addedVector.vectorComponentsProperty, addedVector.isOnGraphProperty ], () => {
            this.updateSum( vectorSet.vectors );
          } );

        // If the vector is removed, dispose of the multilink
        const vectorRemovedListener = ( removedVector ) => {
          if ( removedVector === addedVector ) {

            // Recalculate the sum
            this.updateSum( vectorSet.vectors );

            Property.unmultilink( addedVectorMultilink );
            vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
          }
        };

        vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
      } );
    }

    /**
     * Resets the vector sum. This only resets the tail position, as its components depend on the rest of the vectors.
     * @public
     */
    reset() {
      this.tailPositionProperty.reset();
    }

    /**
     * The sum is never disposed. Double check to make sure the sum isn't ever disposed.
     * @public
     * @override
     */
    dispose() { assert && assert( false, 'vector sums should never be disposed' ); }

    /**
     * Vectors can change states and go from being on the graph to off of the graph (or vise versa). However, even
     * though these vectors are in the vectors ObservableArray, they shouldn't be calculated in the sum.
     *
     *
     * This calculates the sum of all vectors that are on the graph in an observable array
     * @param {ObservableArray.<VectorsModel>} vectors
     * @public
     */
    updateSum( vectors ) {

      // Filter to get only the vectors that are on the graph
      const onGraphVectors = vectors.filter( ( vector ) => {
        return vector.isOnGraphProperty.value;
      } );

      // Loop through and calculate the sum of all vectors that are on the graph
      const sumVectorComponents = new Vector2( 0, 0 );

      onGraphVectors.forEach( ( vector ) => {
        sumVectorComponents.add( vector.vectorComponents );
      } );

      // Set the sum to the calculated sum
      this.vectorComponents = sumVectorComponents;
    }
  }

  return vectorAddition.register( 'VectorSum', VectorSum );
} );