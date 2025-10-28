// Copyright 2025, University of Colorado Boulder

/**
 * ExploreVectorSet is a specialization of VectorSet for the 'Explore 1D' and 'Explore 2D' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorSet, { VectorSetOptions } from './VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import Vector from './Vector.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
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
  PickRequired<VectorSetOptions<Vector>, 'coordinateSnapMode' | 'vectorColorPalette' | 'tandem'>;

export default class ExploreVectorSet extends VectorSet<Vector> {

  public constructor( graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorDescriptions: ExploreVectorDescription[],
                      providedOptions: ExploreVectorSetOptions ) {

    // Creates the complete set of non-resultant vectors for the vector set.
    const createAllVectors = ( vectorSet: ExploreVectorSet ): Vector[] =>
      vectorDescriptions.map( vectorDescription => new Vector( vectorDescription.tailPosition, vectorDescription.xyComponents,
        vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, {
          symbolProperty: vectorDescription.symbolProperty,
          coordinateSnapMode: options.coordinateSnapMode,
          vectorColorPalette: vectorSet.vectorColorPalette,
          tandem: options.tandem.createTandem( `${vectorDescription.tandemNameSymbol}Vector` ),
          tandemNameSymbol: vectorDescription.tandemNameSymbol
        } ) );

    const options = optionize<ExploreVectorSetOptions, SelfOptions, VectorSetOptions<Vector>>()( {

      // VectorSetOptions
      createAllVectors: createAllVectors
    }, providedOptions );

    super( graph, selectedVectorProperty, componentVectorStyleProperty, options );
  }
}

vectorAddition.register( 'ExploreVectorSet', ExploreVectorSet );