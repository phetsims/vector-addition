// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreScene is the base class for scenes in the 'Explore 1D' and 'Explore 2D' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import { CoordinateSnapMode } from './CoordinateSnapMode.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import { GraphOrientation } from './GraphOrientation.js';
import VectorColorPalette from './VectorColorPalette.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector from './Vector.js';
import ExploreVectorSet from './ExploreVectorSet.js';
import Graph from './Graph.js';
import Property from '../../../../axon/js/Property.js';

// Function to create all vectors for a scene in the 'Explore 1D' and 'Explore 2D' screens.
export type CreateAllExploreVectorsFunction = ( vectorSet: ExploreVectorSet,
                                                graph: Graph,
                                                selectedVectorProperty: Property<Vector | null>,
                                                componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                                                coordinateSnapMode: CoordinateSnapMode,
                                                parentTandem: Tandem ) => Vector[];

export default class ExploreScene extends VectorAdditionScene {

  // This scene has one vector set.
  public readonly vectorSet: ExploreVectorSet;

  protected constructor( sceneNameStringProperty: TReadOnlyProperty<string>,
                         graphBounds: Bounds2,
                         graphOrientation: GraphOrientation,
                         coordinateSnapMode: CoordinateSnapMode,
                         vectorColorPalette: VectorColorPalette,
                         createAllVectors: CreateAllExploreVectorsFunction,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         tandem: Tandem ) {

    super( sceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        bounds: graphBounds,
        orientation: graphOrientation
      },
      tandem: tandem
    } );

    this.vectorSet = new ExploreVectorSet( this.graph, this.selectedVectorProperty, componentVectorStyleProperty, coordinateSnapMode, createAllVectors, {
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorColorPalette,
      tandem: tandem.createTandem( 'vectorSet' )
    } );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );
  }

  public override reset(): void {
    super.reset();
    this.vectorSet.reset();
  }

  public override erase(): void {
    super.erase();
    this.vectorSet.erase();
  }
}

vectorAddition.register( 'ExploreScene', ExploreScene );