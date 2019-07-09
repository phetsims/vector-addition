// Copyright 2019, University of Colorado Boulder

/**
 * Model for a 'VectorSet,' which contains two things:
 *  - an observable array of vectors that are dragged from the vector creator panel
 *  - a vector sum of those vectors.
 *
 * A model graph can support multiple vectorSets. (e.g. lab screen has 2 vector sets per scene)
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

  // The tag for the vector sum. The reason this isn't translatable is:
  // https://github.com/phetsims/vector-addition/issues/10.
  const SUM_TAG = 's';

  class VectorSet {
    /**
     * @constructor
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - each vector set has one sum visible property
     * @param {VectorGroups} vectorGroup - each vector set can only represent one vector group
     * @param {CoordinateSnapModes} coordinateSnapMode - each vector set can only represent one snap mode
     * @param {Object} [options]
     */
    constructor( graph, componentStyleProperty, sumVisibleProperty, vectorGroup, coordinateSnapMode, options ) {

      options = _.extend( {
        initializeSum: true // {boolean} false means the vector sum will not be initialized upon instantiation
      }, options );

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

      // @public (read-only) {VectorGroups} vectorGroup - one vectorSet can only represent one vectorGroup
      this.vectorGroup = vectorGroup;

      // @public (read-only) {BooleanProperty} sumVisibleProperty - one vectorSet can only have one sum visible property
      this.sumVisibleProperty = sumVisibleProperty;

      // @public (read-only) {CoordinateSnapModes}
      this.coordinateSnapMode = coordinateSnapMode;

      //----------------------------------------------------------------------------------------
      // Create private references

      // @private {Graph}
      this.graph = graph;

      // @private {Property.<ComponentStyles>}
      this.componentStyleProperty = componentStyleProperty;

      //----------------------------------------------------------------------------------------
      // Create the sum

      if ( options.initializeSum ) {
        // @public (read-only) {VectorModel} the vector sum model
        this.vectorSum = new VectorSum( graph, this, SUM_TAG );
      }
    }

    /**
     * @public
     * Resets the vector set, by clearing the vectors array and reseting the vectorSum
     */
    reset() {

      // Dispose each vector
      while ( this.vectors.length ) {
        this.vectors.pop().dispose();
      }
      this.vectorSum.reset();
    }

    /**
     * @public
     * Creates a vector model. This doesn't get added to the vector ObservableArray
     * @param {Vector2} tailPosition
     * @param {number} xComponent
     * @param {number} yComponent
     * @param {string|null} tag
     * @param {Object} [options] - passed to the vector model
     * @returns {VectorModel} the created vector model
     */
    createVector( tailPosition, initalComponents, tag, options ) {
      return new VectorModel( tailPosition, initalComponents, this.graph, this, tag, options );
    }
  }

  return vectorAddition.register( 'VectorSet', VectorSet );
} );