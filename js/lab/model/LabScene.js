// Copyright 2019, University of Colorado Boulder

/**
 * Model for the scene on the lab scene. This scene only has 2 vectorSets.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  class LabScene extends Scene {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sum1VisibleProperty - visibility of sum for group 1 vector set
     * @param {BooleanProperty} sum2VisibleProperty - visibility of sum for group 2 vector set
     */
    constructor(
      graphDimension,
      graphUpperLeftPosition,
      componentStyleProperty,
      sum1VisibleProperty,
      sum2VisibleProperty ) {

      //----------------------------------------------------------------------------------------
      // Type check arguments
      assert && assert( sum1VisibleProperty instanceof BooleanProperty,
        `invalid sum1VisibleProperty: ${sum1VisibleProperty}` );
      assert && assert( sum2VisibleProperty instanceof BooleanProperty,
        `invalid sum2VisibleProperty: ${sum2VisibleProperty}` );
      // The rest are checked in super-classes

      //-------------------------------------------
      super( graphDimension, graphUpperLeftPosition, componentStyleProperty );


      // @private {Boolean Property} this scene shares one property for the sum visibility
      this.sumGroup1VisibleProperty = sum1VisibleProperty;
      // @private {Boolean Property} this scene shares one property for the sum visibility
      this.sumGroup2VisibleProperty = sum2VisibleProperty;


      this.createVectorSets( componentStyleProperty );
    }

    /**
     * @public
     * Create the vector sets
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    createVectorSets( componentStyleProperty ) {

      // @public (read-only) {VectorSet} - the group one vector set
      this.groupOneVectorSet = new VectorSet(
        this.graph.modelViewTransformProperty,
        this.graph.graphModelBounds,
        componentStyleProperty,
        this.sumGroup1VisibleProperty,
        VectorTypes.ONE );


      // @public (read-only) {VectorSet} - the group two vector set
      this.groupTwoVectorSet = new VectorSet(
        this.graph.modelViewTransformProperty,
        this.graph.graphModelBounds,
        componentStyleProperty,
        this.sumGroup2VisibleProperty,
        VectorTypes.TWO );

      this.vectorSets.push( this.groupOneVectorSet, this.groupTwoVectorSet );

    }
  }

  return vectorAddition.register( 'LabScene', LabScene );
} );
