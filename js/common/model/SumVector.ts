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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import Vector from './Vector.js';
import VectorSet from './VectorSet.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class SumVector extends Vector {

  // Whether the sum is defined.  The sum is defined if there is at least one vector on the graph. It would be
  // preferable to set its Vector2 value to null, but this was discovered very late in development, when that
  // was not practical. See https://github.com/phetsims/vector-addition/issues/187
  public readonly isDefinedProperty: Property<boolean>;

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param scene - scene the sum vector belongs to
   * @param vectorSet - the VectorSet that the sum represents
   * @param symbolProperty - the symbol for the sum vector (e.g. 's', 'c', 'f')
   * @param tandemSymbol - symbol for the sum vector used in tandem names
   * @param tandem
   */
  public constructor( initialTailPosition: Vector2,
                      scene: VectorAdditionScene,
                      vectorSet: VectorSet,
                      symbolProperty: TReadOnlyProperty<string>,
                      tandemSymbol: string,
                      tandem: Tandem ) {

    // Initialize an arbitrary vector model. Its components and magnitude to be set later.
    super( initialTailPosition, Vector2.ZERO, scene, vectorSet, symbolProperty, {
      isDisposable: false,
      isTipDraggable: false, // Sum vectors are not draggable by the tip.
      isRemovable: false, // Sum vectors are not removable which means they are also not disposable
      isOnGraphInitially: true, // Sum vectors are always on the graph
      tandemSymbol: tandemSymbol,
      tandem: tandem
    } );

    this.isDefinedProperty = new BooleanProperty( vectorSet.vectors.lengthProperty.value > 0 );

    // Observe changes to the vector array.
    vectorSet.vectors.addItemAddedListener( addedVector => {

      // When the vector changes, update the sum calculation.
      // unmultilink is required when the vector is removed.
      const addedVectorMultilink = Multilink.multilink(
        [ addedVector.vectorComponentsProperty, addedVector.isOnGraphProperty ], () => {
          this.updateSum( vectorSet.vectors );
        } );

      // If the vector is removed, dispose of the multilink
      const vectorRemovedListener = ( removedVector: Vector ) => {
        if ( removedVector === addedVector ) {

          // Recalculate the sum
          this.updateSum( vectorSet.vectors );

          Multilink.unmultilink( addedVectorMultilink );
          vectorSet.vectors.removeItemRemovedListener( vectorRemovedListener );
        }
      };

      vectorSet.vectors.addItemRemovedListener( vectorRemovedListener );
    } );
  }

  /**
   * Update the sum vector components. Calculated from all the vectors that are on the scene.
   */
  protected updateSum( vectors: ObservableArray<Vector> ): void {

    // Filter to get only the vectors that are on the scene
    const onGraphVectors = vectors.filter( vector => {
      return vector.isOnGraphProperty.value;
    } );

    // Loop through and calculate the sum of all vectors that are on the scene
    const sumVectorComponents = new Vector2( 0, 0 );

    onGraphVectors.forEach( vector => {
      sumVectorComponents.add( vector.vectorComponents );
    } );

    // Set the sum to the calculated sum
    this.vectorComponents = sumVectorComponents;

    // The sum is defined if there is at least one vector on the scene.
    this.isDefinedProperty.value = ( onGraphVectors.length > 0 );
  }
}

vectorAddition.register( 'SumVector', SumVector );