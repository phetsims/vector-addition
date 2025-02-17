// Copyright 2019-2024, University of Colorado Boulder

/**
 * BaseVector is the abstract base class for base vectors.  It disables tip dragging and removal of vectors.
 * Base vectors are created at the start of the sim, and are never disposed.
 * See https://github.com/phetsims/vector-addition/issues/63 for an overview of how BaseVectors fit into the class
 * hierarchy.
 *
 * @author Brandon Li
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import Graph from './Graph.js';
import Vector from './Vector.js';
import VectorSet from './VectorSet.js';

// constants
const OPTIONS = {
  isRemovable: false,       // BaseVectors are not removable
  isTipDraggable: false,    // BaseVectors are not draggable by the tip
  isOnGraphInitially: true, // BaseVectors are always on the graph
  isDisposable: false
};

export default abstract class BaseVector extends Vector {

  /**
   * @param initialTailPosition - starting tail position of the BaseVector
   * @param initialComponents - starting components of the BaseVector
   * @param graph - the graph the BaseVector belongs to
   * @param vectorSet - the set that the BaseVector belongs to
   * @param symbolProperty - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
   */
  protected constructor( initialTailPosition: Vector2, initialComponents: Vector2, graph: Graph,
                         vectorSet: VectorSet, symbolProperty: TReadOnlyProperty<string> ) {

    super( initialTailPosition, initialComponents, graph, vectorSet, symbolProperty, OPTIONS );
  }
}

vectorAddition.register( 'BaseVector', BaseVector );