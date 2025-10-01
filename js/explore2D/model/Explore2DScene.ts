// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DScene is the base class for scenes in the 'Explore 2D' screen.
 *
 * Characteristics of an Explore2DScene are:
 *  - it snaps to either Cartesian or polar coordinates
 *  - it has 1 vector set
 *
 * @author Brandon Li
 */

import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector from '../../common/model/Vector.js';

export default class Explore2DScene extends VectorAdditionScene {

  // Graphs on 'Explore 2D' have exactly one vector set
  public readonly vectorSet: VectorSet;

  // Vector instances that are specific to this screen, exist for the lifetime of the sim.
  public readonly vectors: Vector[];

  protected constructor( sceneNameStringProperty: TReadOnlyProperty<string>,
                         coordinateSnapMode: CoordinateSnapMode,
                         vectorColorPalette: VectorColorPalette,
                         createVectors: ( scene: VectorAdditionScene, vectorSet: VectorSet, parentTandem: Tandem ) => Vector[],
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         tandem: Tandem ) {

    super( sceneNameStringProperty, coordinateSnapMode, {
      graphOptions: {
        initialBounds: VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS
      },
      tandem: tandem
    } );

    this.vectorSet = new VectorSet( this, componentVectorStyleProperty, vectorColorPalette, {
      tandem: tandem.createTandem( 'vectorSet' )
    } );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );

    this.vectors = createVectors( this, this.vectorSet, this.vectorSet.tandem );
  }

  public override reset(): void {
    super.reset();
    this.vectors.forEach( vector => vector.reset() );
  }
}

vectorAddition.register( 'Explore2DScene', Explore2DScene );