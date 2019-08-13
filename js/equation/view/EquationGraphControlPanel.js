// Copyright 2019, University of Colorado Boulder

/**
 * View for the 'Control Panel' that appears on the upper-right corner of the 'Equation' screen.
 *
 * Extends GraphControlPanel but adds the following functionality:
 *  - Has both an angle checkbox and a component style radio button group
 *  - Provides symmetry in the model-view hierarchy
 *
 * @author Brandon Li
 */


define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );


  class EquationGraphControlPanel extends GraphControlPanel {

    /**
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>}
     */
    constructor( valuesVisibleProperty, angleVisibleProperty, gridVisibleProperty, componentStyleProperty ) {

      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------

      super( valuesVisibleProperty, gridVisibleProperty, {
        angleVisibleProperty: angleVisibleProperty,
        componentStyleProperty: componentStyleProperty
      } );
    }
  }

  return vectorAddition.register( 'EquationGraphControlPanel', EquationGraphControlPanel );
} );