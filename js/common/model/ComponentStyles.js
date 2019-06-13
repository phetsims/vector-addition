// Copyright 2019, University of Colorado Boulder

/**
 * Possible orientations for a vector components
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  /**
   * The components can be displayed in 4 ways:
   * 'INVISIBLE': don't show the components at all
   * 'PARALLELOGRAM': the component's and the vector's initial points coincide
   * 'TRIANGLE': the components are displayed head to tail
   * 'ON_AXIS': the components are displayed on the x and y axis.
   */
  const ComponentStyles = new Enumeration( [ 'INVISIBLE', 'PARALLELOGRAM', 'TRIANGLE', 'ON_AXIS' ] );

  return vectorAddition.register( 'ComponentStyles', ComponentStyles );
} );
