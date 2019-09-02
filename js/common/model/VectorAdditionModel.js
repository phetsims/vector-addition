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

  // constants
  const STARTING_COMPONENT_STYLE = ComponentStyles.INVISIBLE;

  class VectorAdditionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // @public controls the display type (positioning) for component vectors
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, STARTING_COMPONENT_STYLE );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.componentStyleProperty.reset();
    }
  }

  return vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );
} );