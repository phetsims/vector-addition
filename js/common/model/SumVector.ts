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
 */

import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
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
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

type SelfOptions = EmptySelfOptions;

type SumVectorOptions = SelfOptions & ResultantVectorOptions;

export default class SumVector extends ResultantVector {

  public constructor( tailPosition: Vector2,
                      vectorSet: VectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      providedOptions: SumVectorOptions ) {

    const options = providedOptions;

    // Initialize an arbitrary vector model. Its components and magnitude to be set later.
    super( tailPosition, Vector2.ZERO, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );

    // Observe changes to the vector array.
    const vectorAddedListener = ( addedVector: Vector ) => {

      // When the vector changes, update the sum calculation. Must be disposed.
      const addedVectorMultilink = Multilink.multilink(
        [ addedVector.xyComponentsProperty, addedVector.isOnGraphProperty ], () => {
          if ( !isSettingPhetioStateProperty.value ) {
            this.updateSum( vectorSet.activeVectors );
          }
        } );

      // Clean up when the vector is removed.
      const vectorRemovedListener = ( removedVector: Vector ) => {
        if ( removedVector === addedVector ) {
          this.updateSum( vectorSet.activeVectors );
          addedVectorMultilink.dispose();
          vectorSet.activeVectors.removeItemRemovedListener( vectorRemovedListener );
        }
      };
      vectorSet.activeVectors.addItemRemovedListener( vectorRemovedListener );
    };
    vectorSet.activeVectors.addItemAddedListener( vectorAddedListener );
    vectorSet.activeVectors.forEach( vector => vectorAddedListener( vector ) );
  }

  /**
   * WORKAROUND: xyComponentsProperty was initialized with a bogus value of Vector2.ZERO in the
   * call to the superclass constructor above. So call updateSum after calling super.reset.
   * See https://github.com/phetsims/vector-addition/issues/328.
   */
  public override reset(): void {
    super.reset();
    this.updateSum( this.vectorSet.activeVectors );
  }

  /**
   * Update the sum's xy-components. Calculated from all the vectors that are on the graph.
   */
  private updateSum( vectors: ObservableArray<Vector> ): void {

    // Filter to get only the vectors that are on the graph.
    const onGraphVectors = vectors.filter( vector => vector.isOnGraphProperty.value );

    // Sum all vectors that are on the graph.
    const sumVectorComponents = new Vector2( 0, 0 );
    onGraphVectors.forEach( vector => sumVectorComponents.add( vector.xyComponents ) );

    // Set the sum to the calculated sum.
    this.xyComponentsProperty.value = sumVectorComponents;
  }
}

vectorAddition.register( 'SumVector', SumVector );