// Copyright 2019, University of Colorado Boulder

/**
 * Model for a vectorSet. A vectorSet has two things: the vectors (ObservableArray), and a vectorSum.
 * Each scene, has an unknown amount of vectorSets.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  class VectorSet {

    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property of the view/model coordinate
     * transform of the graph
     * @param {Bounds2} graphModelBounds - the graph bounds (model coordinates)
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {VectorTypes} vectorType
     */
    constructor( modelViewTransformProperty, graphModelBounds, componentStyleProperty, sumVisibleProperty, vectorType ) {

      // Type check arguments
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds: ${graphModelBounds}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorTypes.includes( vectorType ), `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      // @public {ObservableArray.<VectorModel>} - the vectors that appear on the graph (not including the sum vector)
      this.vectors = new ObservableArray();

      // @public {VectorModel} the vector sum model
      this.vectorSum = new VectorSum(
        this.vectors,
        modelViewTransformProperty,
        componentStyleProperty,
        vectorType,
        graphModelBounds );

      // @public {VectorTypes} vectorType - one vectorSet can only represent one vectorType
      this.vectorType = vectorType;

      // @public {BooleanProperty}
      this.sumVisibleProperty = sumVisibleProperty;


      //----------------------------------------------------------------------------------------
      // Create references

      // @private {Property.<ModelViewTransform>}
      this.modelViewTransformProperty = modelViewTransformProperty;

      // @private {Property.<ComponentStyles>}
      this.componentStyleProperty = componentStyleProperty;


    }

    /**
     * @public
     * Add a vector to this.vectors
     * @param {Vector2} tailPosition
     * @param {number} xComponent
     * @param {number} yComponent
     * @param {Object} [options]
     * @returns {VectorModel} the vector model added
     */
    addVector( tailPosition, xComponent, yComponent, options ) {

      const newVector = new VectorModel(
        tailPosition,
        xComponent,
        yComponent,
        this.modelViewTransformProperty,
        this.componentStyleProperty,
        this.vectorType,
        options );

      // Active the new vector
      newVector.isActiveProperty.value = true;

      this.vectors.push( newVector );
      return newVector;
    }

    /**
     * @public
     * Reset the vector set
     */
    reset() { this.vectors.clear(); }

    /**
     * Convenience method: Applies a callback function to iterate through each vector
     * @param {function( <VectorModel>, <boolean> )} callback
     * @public
     */
    forEachVector( callback ) {

      // Combine the vectors and the vector sum into one array.
      const combinedArray = this.vectors.getArray();
      combinedArray.push( this.vectorSum );

      this.vectors.forEach( ( vector ) => {
        const isSum = this.vectorSum === vector;
        callback( vector, isSum );
      } );
    }

  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );