// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends VectorModel and adds the following functionality:
 *  - Adjust its components based on componentNumberProperties that go into a number spinner
 *  - Disables tip dragging and removing of vectors
 *
 * Base vectors are created at the start of the sim, and are never disposed. They require a tag.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );

  class BaseVectorModel extends VectorModel {
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
      // Create properties for the base vector panel

      // @public (read-only) {Property.<number>} - create a property to represent the x component
      this.xComponentSelectorProperty = new Property( this.xComponent, {
        valueType: 'number'
      } );

      // @public (read-only) {Property.<number>} - create a property to represent the y component
      this.yComponentSelectorProperty = new Property( this.yComponent, {
        valueType: 'number'
      } );

      //----------------------------------------------------------------------------------------
      // Link the base vector panel properties and update the components
      // Both don't need to be unlinked since base vectors exist for the entire sim

      this.xComponentSelectorProperty.link( xComponent => {
        this.xComponent = xComponent;
      } );

      this.yComponentSelectorProperty.link( yComponent => {
        this.yComponent = yComponent;
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
      this.yComponentSelectorProperty.reset();
      this.xComponentSelectorProperty.reset();
      this.tailPositionProperty.reset();
    }
  }

  return vectorAddition.register( 'BaseVectorModel', BaseVectorModel );
} );