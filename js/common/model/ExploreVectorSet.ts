// Copyright 2025, University of Colorado Boulder

/**
 * ExploreVectorSet is a specialization of VectorSet for the 'Explore 1D' and 'Explore 2D' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorSet, { VectorSetOptions } from './VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import Vector from './Vector.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { CreateAllExploreVectorsFunction } from './ExploreScene.js';
import { CoordinateSnapMode } from './CoordinateSnapMode.js';

type SelfOptions = EmptySelfOptions;

type ExploreVectorSetOptions = SelfOptions &
  PickRequired<VectorSetOptions, 'coordinateSnapMode' | 'vectorColorPalette' | 'tandem'>;

export default class ExploreVectorSet extends VectorSet {

  // The complete set of vectors for this scene, allocated when the sim starts.
  public readonly allVectors: Vector[];

  // Number of vectors that are on the graph, and therefore contributing to the sum.
  public numberOfVectorsOnGraphProperty: TReadOnlyProperty<number>;

  public constructor(
    graph: Graph,
    selectedVectorProperty: Property<Vector | null>,
    componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
    coordinateSnapMode: CoordinateSnapMode,
    createAllVectors: CreateAllExploreVectorsFunction,
    providedOptions: ExploreVectorSetOptions
  ) {
    const options = providedOptions;

    super( graph, selectedVectorProperty, componentVectorStyleProperty, options );

    this.allVectors = createAllVectors( this, graph, selectedVectorProperty, componentVectorStyleProperty, coordinateSnapMode, options.tandem );

    this.numberOfVectorsOnGraphProperty = DerivedProperty.deriveAny( this.allVectors.map( vector => vector.isOnGraphProperty ),
      () => this.allVectors.filter( vector => vector.isOnGraphProperty.value ).length );
  }

  public override reset(): void {
    super.reset();
    this.allVectors.forEach( vector => vector.reset() );
  }
}

vectorAddition.register( 'ExploreVectorSet', ExploreVectorSet );