// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends VectorModel and adds the following functionality:
 *  - A coefficient property, and would scale the components/magnitude to the coefficient.
 *  - Instantiate a Base vector model. When the base vector model changes, this vector changes (multiply by coefficient)
 *  - Disables tip dragging and removing of vectors
 *
 * Equation vectors are created at the start of the sim, and are never disposed. They require a tag.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorModel = require( 'VECTOR_ADDITION/equation/model/BaseVectorModel' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  // constants
  const DEFAULT_COEFFICIENT = 1;

  class EquationVectorModel extends VectorModel {
    /**
     * @param {Vector2} tailPosition
     * @param {number} xComponent horizontal component of the vector
     * @param {number} yComponent vertical component of the vector
     * @param {Graph} the graph the vector belongs to
     * @param {EquationVectorSet} the equationVectorSet that the vector belongs to
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     * @param {Object} [options]
     */
    constructor( tailPosition, xComponent, yComponent, graph, equationVectorSet, tag, options ) {

      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      // Disable tip dragging and removing of vectors
      options = _.extend( {

        // super class options
        isRemovable: false,
        isTipDraggable: false
      }, options );


      super( tailPosition, xComponent, yComponent, graph, equationVectorSet, tag, options );

      //----------------------------------------------------------------------------------------
      // @public (read-only) {Property.<number>} - create a property to represent the coefficient.
      this.coefficientProperty = new Property( DEFAULT_COEFFICIENT, {
        isValidValue: ( value ) => {
          return typeof value === 'number';
        }
      } );

      // @public (read-only) {BaseVectorModel}
      this.baseVector = new BaseVectorModel( tailPosition,
        xComponent / this.coefficientProperty.value,
        yComponent / this.coefficientProperty.value,
        graph,
        equationVectorSet,
        tag );

      // Observe when the base vector changes, or when the coefficient property changes and update the vector.
      // Doesn't need to be unlinked since equation vectors are never disposed
      Property.multilink( [ this.baseVector.vectorComponentsProperty, this.coefficientProperty ],
        ( baseVector, coefficient ) => {
          this.vectorComponents = baseVector.timesScalar( coefficient );
        } );

      //----------------------------------------------------------------------------------------
      // Double check that equation vectors are never removed from the graph

      // Equation vectors are always on the graph
      this.isOnGraphProperty.value = true;

      // Doesn't need to be unlinked; equation vectors are never disposed
      this.isOnGraphProperty.link( ( isOnGraph ) => {
        if ( isOnGraph === false ) {
          assert && assert( false, 'vector sums should never be off the graph' );
        }
      } );
      
    }
  }

  return vectorAddition.register( 'EquationVectorModel', EquationVectorModel );
} );