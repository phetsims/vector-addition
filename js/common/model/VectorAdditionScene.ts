// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionScene is the base class for scenes, intended to be subclassed. A screen can have multiple scenes.
 *
 * A scene is responsible for:
 *   - Keeping track of where the origin is dragged and updating a modelViewTransformProperty.
 *   - Keeping track of the active (selected) vector on the graph.
 *   - Managing one or more VectorSets.
 *   - Creating the scene.
 *
 * @author Brandon Li
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import { CoordinateSnapMode } from './CoordinateSnapMode.js';
import Vector from './Vector.js';
import VectorSet from './VectorSet.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Graph, { GraphOptions } from './Graph.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {
  graphOptions: StrictOmit<GraphOptions, 'tandem'>;
};

type VectorAdditionSceneOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorAdditionScene {

  // coordinate snap mode for the scene, Cartesian or polar
  public readonly coordinateSnapMode: CoordinateSnapMode;

  // the vectorSets for this scene
  public readonly vectorSets: VectorSet[];

  // the graph for this scene
  public readonly graph: Graph;

  // The active (selected) vector. A scene has at most one active vector. If null, there is no active vector.
  public readonly activeVectorProperty: Property<Vector | null>;

  protected constructor( coordinateSnapMode: CoordinateSnapMode, providedOptions: VectorAdditionSceneOptions ) {

    const options = providedOptions;

    this.coordinateSnapMode = coordinateSnapMode;

    this.vectorSets = [];

    this.graph = new Graph( combineOptions<GraphOptions>( {
      tandem: options.tandem.createTandem( 'graph' )
    }, options.graphOptions ) );

    this.activeVectorProperty = new Property<Vector | null>( null );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {
    this.vectorSets.forEach( vectorSet => vectorSet.reset() );
    this.graph.reset();
    this.activeVectorProperty.reset();
  }

  /**
   * Erases vectors from the scene.
   */
  public erase(): void {
    this.vectorSets.forEach( vectorSet => vectorSet.erase() );
    this.activeVectorProperty.reset();
  }
}

vectorAddition.register( 'VectorAdditionScene', VectorAdditionScene );