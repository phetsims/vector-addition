// Copyright 2014-2018, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Brandon Li
 */

define( function( require ) {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  const VectorAdditionQueryParameters = QueryStringMachine.getAll( {

    /**
     * The maximum amount of dragging before the vector will be removed from the graph when attempting to drag a vector
     * outside the graph. See https://github.com/phetsims/vector-addition/issues/46.
     *
     * For internal testing only.
     */
    vectorDragThreshold: {
      type: 'number',
      isValidValue: value => ( value > 0 ),
      defaultValue: VectorAdditionConstants.DEFAULT_VECTOR_LENGTH
    }

  } );


  vectorAddition.register( 'VectorAdditionQueryParameters', VectorAdditionQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( VectorAdditionQueryParameters, null, 2 ) );

  return VectorAdditionQueryParameters;
} );
