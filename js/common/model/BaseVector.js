// Copyright 2019-2023, University of Colorado Boulder

/**
 * BaseVector is the abstract base class for base vectors.  It disables tip dragging and removal of vectors.
 * Base vectors are created at the start of the sim, and are never disposed.
 * See https://github.com/phetsims/vector-addition/issues/63 for an overview of how BaseVectors fit into the class
 * hierarchy.
 *
 * @author Brandon Li
 */

import vectorAddition from '../../vectorAddition.js';
import Vector from './Vector.js';

// constants
const OPTIONS = {
  isRemovable: false,       // BaseVectors are not removable
  isTipDraggable: false,    // BaseVectors are not draggable by the tip
  isOnGraphInitially: true  // BaseVectors are always on the graph
};

export default class BaseVector extends Vector {

  /**
   * @abstract
   * @param {Vector2} initialTailPosition - starting tail position of the BaseVector
   * @param {Vector2} initialComponents - starting components of the BaseVector
   * @param {EquationsGraph} graph - the graph the BaseVector belongs to
   * @param {EquationsVectorSet} vectorSet - the set that the BaseVector belongs to
   * @param {string|null} symbol - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
   */
  constructor( initialTailPosition, initialComponents, graph, vectorSet, symbol ) {

    super( initialTailPosition, initialComponents, graph, vectorSet, symbol, OPTIONS );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'BaseVector is not intended to be disposed' );
  }
}

vectorAddition.register( 'BaseVector', BaseVector );