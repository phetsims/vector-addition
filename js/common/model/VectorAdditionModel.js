// Copyright 2019, University of Colorado Boulder

/**
 * Root class (to be subclassed) for the top-level model of every screen.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // @public the representation (style) used to display component vectors
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, ComponentStyles.INVISIBLE );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.componentStyleProperty.reset();
    }

    /**
     * @public
     */
    dispose() {
      throw new Error( 'VectorAdditionModel is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );
} );