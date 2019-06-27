// Copyright 2019, University of Colorado Boulder

/**
 * A Vector Representation Model is the model for the arrow that gets dragged from the vector creator panel
 * onto the graph. Vector Representations when 'dropped' are either animated back to the creator panel
 * or dropped onto the graph.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  // const Easing = require( 'TWIXT/Easing' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );


  class VectorReprentationModel {
    /**
     * @constructor
     * @param {Vector2} initialVector - the initial vector components of the vector when first dropped onto the graph
     * @param {Graph} graph - the graph that the vector representation drops the vector onto
     * @param {VectorSet} vectorSet - the vectorSet that the vector thats going to be created belongs to
     * @param {Object} [options]
     */
    constructor( initialVector, graph, vectorSet, options ) {
       
      options = _.extend( {
        slotLabel: null, // {string|null} the label for the vector at the SLOT. If this is null, it will create a vector
        // without passing the label options, otherwise it will.
        isSlotInfinite: false // {boolean} true means the slot will regenerate vectors to be dragged
      }, options );

      assert && assert( initialVector instanceof Vector2, `invalid initialVector: ${initialVector}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( !options.slotLabel || typeof options.slotLabel === 'string',
        `invalid options.slotLabel: ${options.slotLabel}` );
      assert && assert( typeof options.isSlotInfinite === 'boolean',
        `invalid options.isSlotInfinite: ${options.isSlotInfinite}` );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {Animation|null} - tracks any animation that is currently in progress. When the vector
      // representation arrow is animating, the user will not be able to pick it up until it goes all the way back to
      // vector creator panel slot
      this.inProgressAnimationProperty = new Property( null, {
        validValues: [ Animation, null ]
      } );

      // @public (read-only) {Vector2Property} - track the CENTER of the vector representation.
      this.positionProperty = new Vector2Property( Vector2.ZERO );

      this.isBeingDragged = new BooleanProperty();

      //----------------------------------------------------------------------------------------
      // Create references

      // @public (read-only) {boolean}
      this.isSlotInfinite = options.isSlotInfinite;

      // @public (read-only) {string|null}
      this.slotLabel = options.slotLabel;

      // @private {VectorSet}
      this.vectorSetToAddTo = vectorSet;

      // @private {Graph}
      this.graphToAddTo = graph;

    }

  }

  return vectorAddition.register( 'VectorReprentationModel', VectorReprentationModel );
} );