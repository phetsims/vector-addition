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
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  class VectorSum extends VectorModel {
    /**
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectors
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStylesProperty
     * @param {VectorTypes} vectorType
     * @param {Bounds2} graphModelBounds
     * @param {Object} [options]
     *
     */
    constructor( 
      vectors, 
      modelViewTransformProperty, 
      componentStylesProperty, 
      vectorType, 
      graphModelBounds, 
      options ) {

      options = _.extend( {
        label: 's',// {string} - the label of the vector
        isTipDraggable: true // {boolean} - can the tip be dragged
      }, options );

      //----------------------------------------------------------------------------------------

      // Type check arguments
      assert && assert( vectors instanceof ObservableArray 
        && vectors.filter( vector => ! ( vector instanceof VectorModel ) ).length === 0,
        `invalid vectors: ${vectors}` );
      assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds ${graphModelBounds}` );
      // The rest are checked in super classes

      //----------------------------------------------------------------------------------------

      // get the position of where to put the vector initially
      const spawnPosition = new Vector2( graphModelBounds.centerX, graphModelBounds.centerY );

      super( spawnPosition, 0, 0, modelViewTransformProperty, componentStylesProperty, vectorType, options );

      // isTipDraggingProperty shouldn't ever change for the sum
      // link exists for the lifetime of the simulation
      this.isTipDraggingProperty.link( isTipDragging => {
        if ( isTipDragging ) {
          throw new Error( 'the tip of the sum vector should not be draggable' );
        }
      } );


      // Function to update the sum Vector
      const updateSum = ( attributesVector, oldAttributesVector ) =>
        this.attributesVectorProperty.set( this.attributesVectorProperty.value
          .plus( attributesVector )
          .minus( oldAttributesVector ) );

      vectors.addItemAddedListener( ( addedVector ) => {

        // calculate the sum when the vector is added
        this.attributesVectorProperty.set(
          this.attributesVectorProperty.value.plus( addedVector.attributesVectorProperty.value ) );

        // calculate the sum when the vector is changed
        addedVector.attributesVectorProperty.lazyLink( updateSum );
      } );

      vectors.addItemRemovedListener( ( removedVector ) => {

        // calculate the sum when the vector is removed
        this.attributesVectorProperty.set( this.attributesVectorProperty.value.minus( removedVector.attributesVectorProperty.value ) );

        // remove listener
        removedVector.attributesVectorProperty.unlink( updateSum );
      } );
      // No need to remove the vector add/remove listeners because the sum exists throughout the entirety of the sim.
    }
    
    // No need to add a dispose for the new properties since the sum exists the entire sim
    // @override
    dispose() {
      throw new Error( 'Vector Sums are never disposed' );
    }
  }

  return vectorAddition.register( 'VectorSum', VectorSum );
} );