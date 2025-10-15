// Copyright 2019-2025, University of Colorado Boulder

/**
 * BaseVector is the abstract base class for base vectors.  It disables tip dragging and removal of vectors.
 * Base vectors are created at the start of the sim, and are never disposed.
 * See https://github.com/phetsims/vector-addition/issues/63 for an overview of how BaseVectors fit into the class
 * hierarchy.
 *
 * @author Brandon Li
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import Vector, { VectorOptions } from './Vector.js';
import VectorSet from './VectorSet.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

export type BaseVectorOptions = SelfOptions &
  PickRequired<VectorOptions, 'symbolProperty' | 'tandem' | 'tandemNameSymbol' | 'coordinateSnapMode' | 'vectorColorPalette'>;

export default class BaseVector extends Vector {

  protected constructor( tailPosition: Vector2,
                         xyComponents: Vector2,
                         vectorSet: VectorSet,
                         graph: Graph,
                         selectedVectorProperty: Property<Vector | null>,
                         providedOptions: BaseVectorOptions ) {

    const options = optionize<BaseVectorOptions, SelfOptions, VectorOptions>()( {

      // VectorOptions
      isRemovableFromGraph: false, // BaseVectors are not removable from the graph.
      isTipDraggable: false,    // BaseVectors are not draggable by the tip
      isOnGraph: true, // BaseVectors are always on the graph
      isOnGraphPropertyInstrumented: false // BaseVectors are always on the graph
    }, providedOptions );

    super( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, options );
  }
}

vectorAddition.register( 'BaseVector', BaseVector );