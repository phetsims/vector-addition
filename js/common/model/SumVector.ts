// Copyright 2019-2025, University of Colorado Boulder

/**
 * SumVector is the model of a sum vector. A sum vector is the sum of all vectors for one VectorSet.
 * However, it's not as simple as just a quick add up, as vectors can change states and go from being on the graph to
 * off of the graph or vise versa.
 *
 * SumVectors can be directly manipulated. They can be translated, but not rotated or scale.
 *
 * SumVectors are created at the start of the sim, and exist for the lifetime of the sim.
 *
 * @author Martin Veillette
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import Vector from './Vector.js';
import VectorSet from './VectorSet.js';
import ResultantVector, { ResultantVectorOptions } from './ResultantVector.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';

type SelfOptions = EmptySelfOptions;

type SumVectorOptions = SelfOptions & ResultantVectorOptions;

export default class SumVector extends ResultantVector {

  public constructor( tailPosition: Vector2,
                      vectorSet: VectorSet<Vector>,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      providedOptions: SumVectorOptions ) {

    const options = providedOptions;

    super( tailPosition, computeSum( vectorSet.allVectors ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );

    // When a vector is added or removed from the graph, or xy-components change, update the sum.
    Multilink.multilinkAny( [
        ...vectorSet.allVectors.map( vector => vector.isOnGraphProperty ),
        ...vectorSet.allVectors.map( vector => vector.xyComponentsProperty )
      ], () => {
      this.xyComponentsProperty.value = computeSum( vectorSet.allVectors );
    } );
  }
}

/**
 * Computes the sum of all vectors that are on the graph.
 */
function computeSum( vectors: Vector[] ): Vector2 {

  // Filter to get only the vectors that are on the graph.
  const vectorsOnGraph = vectors.filter( vector => vector.isOnGraphProperty.value );

  // Sum all vectors that are on the graph.
  const sum = new Vector2( 0, 0 );
  vectorsOnGraph.forEach( vector => sum.add( vector.xyComponents ) );

  return sum;
}

vectorAddition.register( 'SumVector', SumVector );