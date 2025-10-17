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
import VectorSet from './VectorSet.js';
import Vector from './Vector.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class ExploreScene extends VectorAdditionScene {

  // This scene has one vector set.
  public readonly vectorSet: VectorSet;

  // The complete set of vectors for this scene, allocated when the sim starts.
  //TODO https://github.com/phetsims/vector-addition/issues/258 Move allVectors to ExploreVectorSet, like other screens.
  public readonly allVectors: Vector[];

  // Number of vectors that are on the graph, and therefore contributing to the sum.
  //TODO https://github.com/phetsims/vector-addition/issues/258 Move to ExploreVectorSet, like LabVectorSet.
  public numberOfVectorsOnGraphProperty: TReadOnlyProperty<number>;

  protected constructor( sceneNameStringProperty: TReadOnlyProperty<string>,
                         graphBounds: Bounds2,
                         graphOrientation: GraphOrientation,
                         coordinateSnapMode: CoordinateSnapMode,
                         vectorColorPalette: VectorColorPalette,
                         createAllVectors: ( scene: VectorAdditionScene, vectorSet: VectorSet, componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>, parentTandem: Tandem ) => Vector[],
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         tandem: Tandem ) {

    super( sceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        bounds: graphBounds,
        orientation: graphOrientation
      },
      tandem: tandem
    } );

    this.vectorSet = new VectorSet( this.graph, this.selectedVectorProperty, componentVectorStyleProperty, {
      coordinateSnapMode: coordinateSnapMode,
      vectorColorPalette: vectorColorPalette,
      tandem: tandem.createTandem( 'vectorSet' )
    } );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );

    this.allVectors = createAllVectors( this, this.vectorSet, componentVectorStyleProperty, this.vectorSet.tandem );

    this.numberOfVectorsOnGraphProperty = DerivedProperty.deriveAny( this.allVectors.map( vector => vector.isOnGraphProperty ),
      () => this.allVectors.filter( vector => vector.isOnGraphProperty.value ).length );
  }

  public override reset(): void {
    super.reset();
    this.vectorSet.reset();
    this.allVectors.forEach( vector => vector.reset() );
  }

  public override erase(): void {
    super.erase();
    this.vectorSet.erase();
  }
}

vectorAddition.register( 'ExploreScene', ExploreScene );