// Copyright 2019, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  const VectorAdditionQueryParameters = QueryStringMachine.getAll( {

    /**
     * The maximum amount of dragging before the vector will be removed from the graph when attempting to drag a vector
     * outside the graph. See https://github.com/phetsims/vector-addition/issues/46
     *
     * For internal testing only.
     */
    vectorDragThreshold: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 10
    },


    /**
     * The minimum distance between a vectors tail to another vectors tail or tip to snap to the other vector in polar
     * mode. See https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit?ts=5ced51e9#
     *
     * For internal testing only.
     */
    polarSnapDistance: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: 1
    }

  } );


  vectorAddition.register( 'VectorAdditionQueryParameters', VectorAdditionQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( VectorAdditionQueryParameters, null, 2 ) );

  return VectorAdditionQueryParameters;
} );