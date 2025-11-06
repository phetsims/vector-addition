// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreScene is the base class for scenes in the 'Explore 1D' and 'Explore 2D' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import { CoordinateSnapMode } from './CoordinateSnapMode.js';
import ExploreVectorSet, { ExploreVectorDescription } from './ExploreVectorSet.js';
import { GraphOrientation } from './GraphOrientation.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import VectorColorPalette from './VectorColorPalette.js';

export default class ExploreScene extends VectorAdditionScene {

  // This scene has one vector set.
  public readonly vectorSet: ExploreVectorSet;

  protected constructor( accessibleSceneNameStringProperty: TReadOnlyProperty<string>,
                         graphBounds: Bounds2,
                         graphOrientation: GraphOrientation,
                         coordinateSnapMode: CoordinateSnapMode,
                         vectorColorPalette: VectorColorPalette,
                         vectorDescriptions: ExploreVectorDescription[],
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         tandem: Tandem ) {

    super( accessibleSceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        bounds: graphBounds,
        orientation: graphOrientation
      },
      tandem: tandem
    } );

    this.vectorSet = new ExploreVectorSet( this.graph, this.selectedVectorProperty, componentVectorStyleProperty, vectorDescriptions, {
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