// Copyright 2019, University of Colorado Boulder

/**
 * BaseVector is the abstract base class for base vectors.  It disables tip dragging and removal of vectors.
 * Base vectors are created at the start of the sim, and are never disposed.
 * See https://github.com/phetsims/vector-addition/issues/63 for an overview of how BaseVectors fit into the class
 * hierarchy.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const OPTIONS = {
    isRemovable: false,       // BaseVectors are not removable
    isTipDraggable: false,    // BaseVectors are not draggable by the tip
    isOnGraphInitially: true  // BaseVectors are always on the equationGraph
  };

  class BaseVector extends Vector {

    /**
     * @abstract
     * @param {Vector2} initialTailPosition - starting tail position of the BaseVector
     * @param {Vector2} initialComponents - starting components of the BaseVector
     * @param {EquationGraph} equationGraph - the equation graph the BaseVector belongs to
     * @param {EquationVectorSet} equationVectorSet - the set that the BaseVector belongs to
     * @param {string|null} symbol - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition, initialComponents, equationGraph, equationVectorSet, symbol ) {

      super( initialTailPosition, initialComponents, equationGraph, equationVectorSet, symbol, OPTIONS );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'BaseVector is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'BaseVector', BaseVector );
} );