// Copyright 2019-2025, University of Colorado Boulder

/**
 * BaseVector is the abstract base class for base vectors.  It disables tip dragging and removal of vectors.
 * Base vectors are created at the start of the sim, and are never disposed.
 * See https://github.com/phetsims/vector-addition/issues/63 for an overview of how BaseVectors fit into the class
 * hierarchy.
 *
 * @author Brandon Li
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import Vector, { VectorOptions } from './Vector.js';
import VectorSet from './VectorSet.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;

export type BaseVectorOptions = SelfOptions &
  PickOptional<VectorOptions, 'isDisposable'> &
  PickRequired<VectorOptions, 'tandem'>;

export default abstract class BaseVector extends Vector {

  /**
   * @param initialTailPosition - starting tail position of the BaseVector
   * @param initialComponents - starting components of the BaseVector
   * @param scene - the scene the BaseVector belongs to
   * @param vectorSet - the set that the BaseVector belongs to
   * @param symbolProperty - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
   * @param tandemNameSymbol - symbol for the vector used in tandem names
   * @param providedOptions
   */
  protected constructor( initialTailPosition: Vector2,
                         initialComponents: Vector2,
                         scene: VectorAdditionScene,
                         vectorSet: VectorSet,
                         symbolProperty: TReadOnlyProperty<string>,
                         tandemNameSymbol: string,
                         providedOptions: BaseVectorOptions ) {

    const options = optionize<BaseVectorOptions, SelfOptions, VectorOptions>()( {

      // VectorOptions
      isDisposable: false,
      isRemovable: false,       // BaseVectors are not removable
      isTipDraggable: false,    // BaseVectors are not draggable by the tip
      isOnGraphInitially: true, // BaseVectors are always on the graph
      isOnGraphPropertyInstrumented: false, // BaseVectors are always on the graph
      tandemNameSymbol: tandemNameSymbol
    }, providedOptions );

    super( initialTailPosition, initialComponents, scene, vectorSet, symbolProperty, options );
  }
}

vectorAddition.register( 'BaseVector', BaseVector );