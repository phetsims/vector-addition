// Copyright 2019, University of Colorado Boulder

/**
 * Model for a vector sum. A vector sum is the sum of all vectors for only one vector set.
 *
 * However, it's not as simple as just a quick add up, as vectors can change states and go from being on the graph to
 * off of the graph or vise versa.
 *
 * Vector Sums are created at the start of the sim, and exist throughout the entire simulation, leaving links as is.
 * However, they can be reset (which solely resets the location).
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
  const VECTOR_SUM_OPTIONS = {
    isTipDraggable: false, // Vector sums are not draggable by the tip.
    isRemovable: false, // Vector sums are not removable which means they are also not disposable
    isOnGraphInitially: true // Vector sums are always on the graph
  };

  class VectorSum extends VectorModel {
    /**
     * @constructor
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Graph} graph - graph the vector sum belongs to
     * @param {VectorSet} vectorSet - the vector set that the sum represents
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition, graph, vectorSet, tag ) {

      // Initialize an arbitrary vector model. Its components and magnitude to be set later.
      super( initialTailPosition, Vector2.ZERO, graph, vectorSet, tag, VECTOR_SUM_OPTIONS );

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

      //----------------------------------------------------------------------------------------
      // @private {function} isTagDisplayed - function to check if the vector sum should display its tag.
      // The vector sum only displays the tag when either a vector in its vector set is active, the sum is active, or
      // the activeVectorProperty.value is null
      this.isTagDisplayed = () => {
        return vectorSet.vectors.some( vector => vector === graph.activeVectorProperty.value )
               || graph.activeVectorProperty.value === this
               || graph.activeVectorProperty.value === null;
      };
    }

    /**
     * Resets the vector sum.
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
    dispose() { assert && assert( false, 'Vector sums should never be disposed' ); }

    /**
     * Update the vector sum components. Calculated from all the vectors that are on the graph.
     * @protected
     *
     * @param {ObservableArray.<VectorsModel>} vectors
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

    /**
     * @override
     * @public
     * See RootVectorModel.getLabelContent() for context
     *
     * Gets the label content information to display the vector model. Vector Sums only display their tag when either a
     * vector in its vector set is active, the sum is active, or the activeVectorProperty.value is null
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    coefficient: {string|null} // the coefficient (e.g. if the label displayed '3|v|=15', the coefficient would be
     *                               // 3). Null means it doesn't display a coefficient
     *    tag: {string|null} // the tag (e.g. if the label displayed '3|v|=15', the tag would be '|v|')
     *                       // Null means it doesn't display a tag
     *    value: {string|null} // the suffix (e.g. if the label displayed '3|v|=15', the value would be '=15')
     *                         // Null means it doesn't display a value
     * }
     */
    getLabelContent( valuesVisible ) {
      if ( !this.isTagDisplayed() ) {
        return _.extend( super.getLabelContent( valuesVisible ), {
          tag: null
        } );
      }
      else {
        return super.getLabelContent( valuesVisible );
      }
    }
  }

  return vectorAddition.register( 'VectorSum', VectorSum );
} );