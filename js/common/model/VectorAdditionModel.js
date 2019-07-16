// Copyright 2019, University of Colorado Boulder

/**
 * Root class (to be subtyped) for the top level model of every screen respectively. Controls the state of the sim.
 *
 * Main responsibilities are: (See https://github.com/phetsims/vector-addition/issues/66)
 *  - Component style Property
 *
 * Meant as a superclass. Added Properties in subclasses will not be reset in this class. Graphs and sum visibility
 * Properties should be made in subclasses (varied amount of graphs and sum visibility Properties from screen to
 * screen)
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

      // @public {EnumerationProperty.<ComponentStyles>} componentStyleProperty - controls the visibility of the
      // component styles
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