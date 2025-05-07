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

import Property from '../../../../axon/js/Property.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import { CoordinateSnapMode } from './CoordinateSnapMode.js';
import Vector from './Vector.js';
import VectorSet from './VectorSet.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Graph, { GraphOptions } from './Graph.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';

type SelfOptions = {
  graphOptions: StrictOmit<GraphOptions, 'tandem'>;
};

type VectorAdditionSceneOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorAdditionScene extends PhetioObject {

  // coordinate snap mode for the scene, Cartesian or polar
  public readonly coordinateSnapMode: CoordinateSnapMode;

  // the vectorSets for this scene
  public readonly vectorSets: VectorSet[];

  // the graph for this scene
  public readonly graph: Graph;

  // The active (selected) vector. A scene has at most one active vector. If null, there is no active vector.
  public readonly activeVectorProperty: Property<Vector | null>;

  protected constructor( coordinateSnapMode: CoordinateSnapMode, providedOptions: VectorAdditionSceneOptions ) {

    const options = optionize<VectorAdditionSceneOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: VectorAdditionScene.VectorAdditionSceneIO
    }, providedOptions );

    super( options );

    this.coordinateSnapMode = coordinateSnapMode;

    this.vectorSets = [];

    this.graph = new Graph( combineOptions<GraphOptions>( {
      tandem: options.tandem.createTandem( 'graph' )
    }, options.graphOptions ) );

    this.activeVectorProperty = new Property<Vector | null>( null );
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

  /**
   * VectorAdditionSceneIO handles serialization of a VectorAdditionScene. It implements reference-type serialization, as
   * described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly VectorAdditionSceneIO = new IOType<VectorAdditionScene, ReferenceIOState>( 'VectorAdditionSceneIO', {
    valueType: VectorAdditionScene,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}

vectorAddition.register( 'VectorAdditionScene', VectorAdditionScene );