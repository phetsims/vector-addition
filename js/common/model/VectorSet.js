// Copyright 2019, University of Colorado Boulder

/**
 * Model for a 'VectorSet,' which contains two things: a vector observable array, and a vectorSum of those vectors.
 * Each graph has an unknown amount of vectorSets.
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
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  class VectorSet {

    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - property of the view/model coordinate
     * transform of the graph
     * @param {Bounds2} graphModelBounds - the graph bounds (model coordinates)
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - each vector set has one sum visible property
     * @param {VectorGroups} vectorGroup
     */
    constructor(
      modelViewTransformProperty,
      graphModelBounds,
      componentStyleProperty,
      sumVisibleProperty,
      vectorGroup ) {

      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( graphModelBounds instanceof Bounds2, `invalid graphModelBounds: ${graphModelBounds}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );

      //----------------------------------------------------------------------------------------

      // @public {ObservableArray.<VectorModel>} vectors
      this.vectors = new ObservableArray();

      // @public {VectorModel} the vector sum model
      this.vectorSum = new VectorSum(
        this.vectors,
        modelViewTransformProperty,
        componentStyleProperty,
        vectorGroup,
        graphModelBounds );

      // @public {VectorGroups} vectorGroup - one vectorSet can only represent one vectorGroup
      this.vectorGroup = vectorGroup;

      // @public {BooleanProperty} sumVisibleProperty - one vectorSet can only have on sum visible property
      this.sumVisibleProperty = sumVisibleProperty;

      //----------------------------------------------------------------------------------------
      // Create references to parameters

      // @private {Property.<ModelViewTransform>}
      this.modelViewTransformProperty = modelViewTransformProperty;

      // @private {Property.<ComponentStyles>}
      this.componentStyleProperty = componentStyleProperty;
    }

    /**
     * @public
     * Adds a 'normal' VectorModel to the vector observable array.
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
        this.vectorGroup,
        options );

      newVector.activate();

      this.vectors.push( newVector );
      return newVector;
    }

    /**
     * @public
     * Resets the vector set
     */
    reset() {
      this.vectors.clear();
    }
  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );