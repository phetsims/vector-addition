// Copyright 2019, University of Colorado Boulder

/**
 * Model for a 'VectorSet,' which contains two things: a vector observable array, and a vectorSum of those vectors.
 * A model graph can support multiple vectorSets.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorSum = require( 'VECTOR_ADDITION/common/model/VectorSum' );

  class VectorSet {

    /**
     * @constructor
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - each vector set has one sum visible property
     * @param {VectorGroups} vectorGroup - each vector set can only represent one vector group
     * @param {CoordinateSnapModes} coordinateSnapMode - each vector set can only represent one snap mode
     */
    constructor( graph, componentStyleProperty, sumVisibleProperty, vectorGroup, coordinateSnapMode ) {

      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );

      //----------------------------------------------------------------------------------------

      // @public {ObservableArray.<VectorModel>} vectors
      this.vectors = new ObservableArray();

      // @public {VectorModel} the vector sum model
      this.vectorSum = new VectorSum( this.vectors, graph, componentStyleProperty, vectorGroup );

      // @public {VectorGroups} vectorGroup - one vectorSet can only represent one vectorGroup
      this.vectorGroup = vectorGroup;

      // @public {BooleanProperty} sumVisibleProperty - one vectorSet can only have one sum visible property
      this.sumVisibleProperty = sumVisibleProperty;

      // TODO: indicate type
      // @public (read-only)
      this.coordinateSnapMode = coordinateSnapMode;

      //----------------------------------------------------------------------------------------
      // Create references to parameters

      // TODO wrong type
      // @private {Property.<ModelViewTransform>}
      this.graph = graph;

      // @private {Property.<ComponentStyles>}
      this.componentStyleProperty = componentStyleProperty;
    }

    /**
     * @public
     * Resets the vector set, by clearing the vectors array and reset the vectorSum
     */
    reset() {
      this.vectors.clear();
      this.vectorSum.reset();
    }

    /**
     * @public
     * Adds a VectorModel to the vector observable array.
     * @param {Vector2} tailPosition
     * @param {number} xComponent
     * @param {number} yComponent
     * @param {Object} [options]
     * @returns {VectorModel} the vector model added
     */
    addVector( tailPosition, xComponent, yComponent, options ) {

      // Keep a reference
      const vector = new VectorModel(
        tailPosition,
        xComponent,
        yComponent,
        this.graph,
        this.componentStyleProperty,
        this.vectorGroup,
        options );

      //TODO: this is not a good practice since this method is returning an object AND has a side effect
      //TODO: break down into two function
      // Activate the new vector
      vector.activate();

      this.vectors.push( vector );
      return vector;
    }
  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );