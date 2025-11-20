// Copyright 2019-2025, University of Colorado Boulder

/**
 * BaseVector is the abstract base class for base vectors in the Equations screens.
 * A non-base vector (EquationVector) is derived by multiplying its associated base vector by its coefficient.
 * In the view, base vectors can be directly positioned but are indirectly scaled and rotated using NumberPickers.
 * Like the other vectors in the Equations screen, they are permanently on the graph, and cannot be removed.
 *
 * See https://github.com/phetsims/vector-addition/blob/main/doc/implementation-notes.md for an overview of how
 * BaseVectors fit into the vector class hierarchy.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import Graph from './Graph.js';
import Vector, { VectorOptions } from './Vector.js';
import VectorSet from './VectorSet.js';

type SelfOptions = EmptySelfOptions;

export type BaseVectorOptions = SelfOptions &
  StrictOmit<VectorOptions, 'isRemovableFromGraph' | 'isTipDraggable' | 'isOnGraph' | 'isOnGraphPropertyInstrumented'>;

export default class BaseVector extends Vector {

  protected constructor( tailPosition: Vector2,
                         xyComponents: Vector2,
                         vectorSet: VectorSet,
                         graph: Graph,
                         selectedVectorProperty: Property<Vector | null>,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         providedOptions: BaseVectorOptions ) {

    const options = optionize<BaseVectorOptions, SelfOptions, VectorOptions>()( {

      // VectorOptions
      isRemovableFromGraph: false, // BaseVectors are not removable from the graph.
      isTipDraggable: false,    // BaseVectors are not draggable by the tip
      isOnGraph: true, // BaseVectors are always on the graph
      isOnGraphPropertyInstrumented: false // BaseVectors are always on the graph
    }, providedOptions );

    super( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );
  }
}

vectorAddition.register( 'BaseVector', BaseVector );