// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for the class hierarchy overview.
 *
 * Extends VectorModel and adds the following functionality:
 *  - A coefficient property, and would scale the components/magnitude to the coefficient.
 *  - Instantiate a ghost vector model.
 *  - Instantiate number properties for the x and y so the user can change the base vector.
 *  - Disables tip dragging and removing of vectors
 *
 * EquationVectorModels should have a tag. They are also never disposed.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const GhostVectorModel = require( 'VECTOR_ADDITION/equation/model/GhostVectorModel' );
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
     * @param {VectorSet} the vectorSet that the vector belongs to
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     * @param {Object} [options]
     */
    constructor( tailPosition, xComponent, yComponent, graph, vectorSet, tag, options ) {

      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        // super class options
        isRemovable: false,
        isTipDraggable: false
      }, options );

      super( tailPosition, xComponent, yComponent, graph, vectorSet, tag, options );

      //----------------------------------------------------------------------------------------
      // @public (read-only) {Property.<number>} - create a property to represent the position.
      this.coefficientProperty = new Property( DEFAULT_COEFFICIENT, {
        isValidValue: ( value ) => {
          return typeof value === 'number';
        }
      } );

      // @public (read-only) {GhostVectorModel}
      this.ghostVector = new GhostVectorModel( tailPosition,
        xComponent / this.coefficientProperty.value,
        yComponent / this.coefficientProperty.value,
        graph,
        vectorSet,
        tag );

      // Observe when the ghost vectors change, or when the coefficient property changes and update the vector
      // Doesn't need to be unlinked since equation vectors are never disposed
      Property.multilink( [ this.ghostVector.vectorComponentsProperty, this.coefficientProperty ],
        ( ghostVector, coefficient ) => {
          this.vectorComponents = ghostVector.vectorComponents.timesScalar( coefficient );
        } );


      //----------------------------------------------------------------------------------------
      // Double check that vector sums are never removed from the graph

      // Vector sums are always on the graph
      this.isOnGraphProperty.value = true;

      // Doesn't need to be unlinked; vector sums are never disposed
      this.isOnGraphProperty.link( ( isOnGraph ) => {
        if ( isOnGraph === false ) {
          assert && assert( false, 'vector sums should never be off the graph' );
        }
      } );

    }

  }

  return vectorAddition.register( 'EquationVectorModel', EquationVectorModel );
} );