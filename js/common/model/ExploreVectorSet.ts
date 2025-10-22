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
import Vector2 from '../../../../dot/js/Vector2.js';

// Describes a non-resultant vector for the Explore 1D and Explore 2D screens.
export type ExploreVectorDescription = {
  symbolProperty: TReadOnlyProperty<string>; // symbol for the vector used in the user interface
  tandemNameSymbol: string; // symbol for the vector used in tandem names
  tailPosition: Vector2;
  xyComponents: Vector2;
};

type SelfOptions = EmptySelfOptions;

type ExploreVectorSetOptions = SelfOptions &
  PickRequired<VectorSetOptions, 'coordinateSnapMode' | 'vectorColorPalette' | 'tandem'>;

export default class ExploreVectorSet extends VectorSet {

  // The complete set of non-resultant vectors for this vector set, allocated when the sim starts.
  public readonly allVectors: Vector[];

  // Number of vectors that are on the graph, and therefore contributing to the sum.
  public readonly numberOfVectorsOnGraphProperty: TReadOnlyProperty<number>;

  public constructor( graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorDescriptions: ExploreVectorDescription[],
                      providedOptions: ExploreVectorSetOptions ) {

    const options = providedOptions;

    super( graph, selectedVectorProperty, componentVectorStyleProperty, options );

    this.allVectors = [];

    // Create the individual vectors.
    for ( let i = 0; i < vectorDescriptions.length; i++ ) {
      const vectorDescription = vectorDescriptions[ i ];
      const vector = new Vector( vectorDescription.tailPosition, vectorDescription.xyComponents, this, graph,
        selectedVectorProperty, componentVectorStyleProperty, {
          symbolProperty: vectorDescription.symbolProperty,
          coordinateSnapMode: options.coordinateSnapMode,
          vectorColorPalette: this.vectorColorPalette,
          tandem: options.tandem.createTandem( `${vectorDescription.tandemNameSymbol}Vector` ),
          tandemNameSymbol: vectorDescription.tandemNameSymbol
        } );
      this.allVectors.push( vector );
    }

    this.numberOfVectorsOnGraphProperty = DerivedProperty.deriveAny( this.allVectors.map( vector => vector.isOnGraphProperty ),
      () => this.allVectors.filter( vector => vector.isOnGraphProperty.value ).length );
  }
}

vectorAddition.register( 'ExploreVectorSet', ExploreVectorSet );