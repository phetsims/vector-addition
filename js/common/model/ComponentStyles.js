// Copyright 2019, University of Colorado Boulder

/**
 * Enumeration of the possible 'styles' to display component vectors.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * The component vectors can be displayed in 4 ways:
   * 'INVISIBLE': don't show the component vectors at all
   * 'PARALLELOGRAM': the component's and the vector's initial points coincide
   * 'TRIANGLE': the components are displayed head to tail
   * 'ON_AXIS': the components are displayed on the x and y axes.
   */
  const ComponentStyles = new Enumeration( [ 'INVISIBLE', 'PARALLELOGRAM', 'TRIANGLE', 'ON_AXIS' ] );

  return vectorAddition.register( 'ComponentStyles', ComponentStyles );
} );