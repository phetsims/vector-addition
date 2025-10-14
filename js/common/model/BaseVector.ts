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
import VectorAdditionScene from './VectorAdditionScene.js';
import Vector, { VectorOptions } from './Vector.js';
import VectorSet from './VectorSet.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

export type BaseVectorOptions = SelfOptions & PickRequired<VectorOptions, 'symbolProperty' | 'tandem' | 'tandemNameSymbol'>;

export default class BaseVector extends Vector {

  /**
   * @param tailPosition - initial tail position of the BaseVector
   * @param xyComponents - initial xy-components of the BaseVector
   * @param scene - the scene the BaseVector belongs to
   * @param vectorSet - the set that the BaseVector belongs to
   * @param providedOptions
   */
  protected constructor( tailPosition: Vector2,
                         xyComponents: Vector2,
                         scene: VectorAdditionScene,
                         vectorSet: VectorSet,
                         providedOptions: BaseVectorOptions ) {

    const options = optionize<BaseVectorOptions, SelfOptions, VectorOptions>()( {

      // VectorOptions
      isRemovableFromGraph: false, // BaseVectors are not removable from the graph.
      isTipDraggable: false,    // BaseVectors are not draggable by the tip
      isOnGraph: true, // BaseVectors are always on the graph
      isOnGraphPropertyInstrumented: false // BaseVectors are always on the graph
    }, providedOptions );

    super( tailPosition, xyComponents, scene, vectorSet, options );
  }
}

vectorAddition.register( 'BaseVector', BaseVector );