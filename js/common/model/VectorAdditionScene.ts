// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionScene is the base class for scenes, intended to be subclassed. A screen can have multiple scenes.
 *
 * A scene is responsible for:
 *   - Keeping track of where the origin is dragged and updating a modelViewTransformProperty.
 *   - Keeping track of the selected vector on the graph.
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
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';

type SelfOptions = {
  graphOptions: StrictOmit<GraphOptions, 'tandem'>;
};

type VectorAdditionSceneOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class VectorAdditionScene extends PhetioObject {

  // The scene's name, as used in interactive descriptions.
  public readonly sceneNameStringProperty: TReadOnlyProperty<string>;

  // coordinate snap mode for the scene, Cartesian or polar
  public readonly coordinateSnapMode: CoordinateSnapMode;

  // the vectorSets for this scene
  public readonly vectorSets: VectorSet[];

  // the graph for this scene
  public readonly graph: Graph;

  // The selected vector. A scene has at most one selected vector. If null, there is no selected vector.
  public readonly selectedVectorProperty: Property<Vector | null>;

  protected constructor( sceneNameStringProperty: TReadOnlyProperty<string>,
                         coordinateSnapMode: CoordinateSnapMode,
                         providedOptions: VectorAdditionSceneOptions ) {

    const options = optionize<VectorAdditionSceneOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      phetioType: VectorAdditionScene.VectorAdditionSceneIO
    }, providedOptions );

    super( options );

    this.sceneNameStringProperty = sceneNameStringProperty;
    this.coordinateSnapMode = coordinateSnapMode;

    this.vectorSets = [];

    this.graph = new Graph( combineOptions<GraphOptions>( {
      tandem: options.tandem.createTandem( 'graph' )
    }, options.graphOptions ) );

    this.selectedVectorProperty = new Property<Vector | null>( null, {
      phetioValueType: NullableIO( Vector.VectorIO ),
      tandem: options.tandem.createTandem( 'selectedVectorProperty' ),
      phetioDocumentation: 'The selected vector on the graph.',
      phetioReadOnly: true
    } );
  }

  public reset(): void {
    // Subclasses are responsible for resetting VectorSet instances that were added to this.vectorSets.
    this.graph.reset();
    this.selectedVectorProperty.reset();
  }

  /**
   * Erases vectors from the scene.
   */
  public erase(): void {
    // Subclasses are responsible for erasing VectorSet instances that were added to this.vectorSets.
    this.selectedVectorProperty.reset();
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