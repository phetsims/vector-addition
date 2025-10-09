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
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import Vector from './Vector.js';
import VectorSet from './VectorSet.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ResultantVector from './ResultantVector.js';

export default class SumVector extends ResultantVector {

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param scene - scene the sum vector belongs to
   * @param vectorSet - the VectorSet that the sum represents
   * @param symbolProperty - the symbol for the sum vector (e.g. 's', 'c', 'f')
   * @param tandemNameSymbol - symbol for the sum vector used in tandem names
   * @param tandem
   */
  public constructor( initialTailPosition: Vector2,
                      scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      symbolProperty: TReadOnlyProperty<string>,
                      tandemNameSymbol: string,
                      tandem: Tandem ) {

    // Initialize an arbitrary vector model. Its components and magnitude to be set later.
    super( initialTailPosition, Vector2.ZERO, scene, vectorSet, symbolProperty, {
      tandemNameSymbol: tandemNameSymbol,
      tandem: tandem
    } );

    // Observe changes to the vector array.
    const vectorAddedListener = ( addedVector: Vector ) => {

      // When the vector changes, update the sum calculation. Must be disposed.
      const addedVectorMultilink = Multilink.multilink(
        [ addedVector.xyComponentsProperty, addedVector.isOnGraphProperty ], () => {
          this.updateSum( vectorSet.vectors );
        } );

      // Clean up when the vector is removed.
      const vectorRemovedListener = ( removedVector: Vector ) => {
        if ( removedVector === addedVector ) {
          this.updateSum( vectorSet.vectors );
          addedVectorMultilink.dispose();
          vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
        }
      };
      vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
    };
    vectorSet.vectors.addItemAddedListener( vectorAddedListener );
    vectorSet.vectors.forEach( vector => vectorAddedListener( vector ) );
  }

  /**
   * WORKAROUND: xyComponentsProperty was initialized with a bogus value of Vector2.ZERO in the
   * call to the superclass constructor above. So call updateSum after calling super.reset.
   * See https://github.com/phetsims/vector-addition/issues/328.
   */
  public override reset(): void {
    super.reset();
    this.updateSum( this.vectorSet.vectors );
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