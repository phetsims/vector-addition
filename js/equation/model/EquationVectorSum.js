// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends VectorModel and adds the following functionality:
 *  - Takes an array of EquationVectors and calculates its components based on the vectors and the
 *    equationType
 *  - Disables tip dragging and removing of vectors
 *
 * Equation sum vectors are created at the start of the sim, and are never disposed. They require a tag.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants

  // passed to super class
  const VECTOR_SUM_OPTIONS = {
    isTipDraggable: false, // Vector sums are not draggable by the tip. Their components are calculated from the vectors
    // in a vector set that are on the graph
    isRemovable: false // Vector sums are not removable which means they are also not disposable
  };

  class EquationVectorSum extends VectorModel {
    /**
     * @constructor
     * @param {Graph} graph - graph the vector sum belongs to
     * @param {VectorSet} - the vector set that the sum represents
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( graph, vectorSet, equationTypeProperty, tag ) {

      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );

      // Get the initial position for the tail of the vector, which is the graphs center
      const initialPosition = graph.graphModelBounds.center;

      // Initialize an arbitrary vector model. Its components and magnitude to be set later.
      super( initialPosition, 0, 0, graph, vectorSet, tag, VECTOR_SUM_OPTIONS );

      //----------------------------------------------------------------------------------------

      // Function to update the equation sum based on the vectors and the equation type
      const updateEquationSum = ( equationType ) => {

        // Denoted by 'a' + 'b' = 'c'
        if ( equationType === EquationTypes.ADDITION ) {
          const sum = new Vector2( 0, 0 );

          vectorSet.vectors.forEach( vector => {
            sum.add( vector.vectorComponents );
          } );

          this.vectorComponents = sum;
        }
        else if ( equationType === EquationTypes.SUBTRACTION ) {
          const difference = new Vector2( 0, 0 );

          vectorSet.vectors.forEach( vector => {
            difference.subtract( vector.vectorComponents );
          } );

          this.vectorComponents = difference;
        }
        else if ( equationType === EquationTypes.NEGATION ) {
          // Same as addition but negated  : a + b = -c or a + b + c = 0

          const sum = new Vector2( 0, 0 );

          vectorSet.vectors.forEach( vector => {
            sum.add( vector.vectorComponents );
          } );

          this.vectorComponents = sum.negate();
        }
      };

      //----------------------------------------------------------------------------------------
      // Observe when each vector changes and/or when the equationType changes to calculate the sum
      const dependencies = [ equationTypeProperty ];

      vectorSet.vectors.forEach( vector => {
        dependencies.push( vector.vectorComponentsProperty );
      } );

      // Doesn't need to be unlinked since each vector in equationvectorSet are never disposed and the equation vector
      // sum is never disposed
      Property.multilink( dependencies,
        ( equationType ) => {
          updateEquationSum( equationType );
        } );

      //----------------------------------------------------------------------------------------
      // Double check that base vectors are never removed from the graph

      this.isOnGraphProperty.value = true;

      // Doesn't need to be unlinked; base vectors are never disposed
      this.isOnGraphProperty.link( ( isOnGraph ) => {
        if ( isOnGraph === false ) {
          assert && assert( false, 'vector sums should never be off the graph' );
        }
      } );

    }

    reset() {

    }
  }

  return vectorAddition.register( 'EquationVectorSum', EquationVectorSum );
} );