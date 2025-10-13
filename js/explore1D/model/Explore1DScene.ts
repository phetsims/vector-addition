// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DScene is the base class for scenes in the 'Explore 1D' screen.
 *
 * Characteristics of an Explore1DScene are:
 *  - it has 1 vector set
 *  - the graph orientation is either horizontal or vertical
 *  - it snaps to Cartesian coordinates
 *
 * @author Brandon Li
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import { GraphOrientation } from '../../common/model/GraphOrientation.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import VectorSet from '../../common/model/VectorSet.js';
import Vector from '../../common/model/Vector.js';

const DEFAULT_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

// See https://github.com/phetsims/vector-addition/issues/127
affirm( DEFAULT_GRAPH_BOUNDS.width % 2 === 0, `DEFAULT_GRAPH_BOUNDS.width must be even: ${DEFAULT_GRAPH_BOUNDS.width}` );
affirm( DEFAULT_GRAPH_BOUNDS.height % 2 === 0, `DEFAULT_GRAPH_BOUNDS.height must be even: ${DEFAULT_GRAPH_BOUNDS.height}` );

// graph bounds for 'Explore 1D' - origin is at the center
const EXPLORE_1D_GRAPH_BOUNDS = new Bounds2( -DEFAULT_GRAPH_BOUNDS.width / 2,
  -DEFAULT_GRAPH_BOUNDS.height / 2,
  DEFAULT_GRAPH_BOUNDS.width / 2,
  DEFAULT_GRAPH_BOUNDS.height / 2 );

// All graphs on 'Explore 1D' are strictly Cartesian
const EXPLORE_1D_COORDINATE_SNAP_MODE: CoordinateSnapMode = 'cartesian';

export default class Explore1DScene extends VectorAdditionScene {

  // This scene has one vector set.
  public readonly vectorSet: VectorSet;

  // Vector instances that are specific to this scene, exist for the lifetime of the sim.
  public readonly vectors: Vector[];

  protected constructor( sceneNameStringProperty: TReadOnlyProperty<string>,
                         graphOrientation: GraphOrientation,
                         vectorColorPalette: VectorColorPalette,
                         createVectors: ( scene: VectorAdditionScene, vectorSet: VectorSet, parentTandem: Tandem ) => Vector[],
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         tandem: Tandem ) {

    affirm( _.includes( [ 'horizontal', 'vertical' ], graphOrientation ) );

    super( sceneNameStringProperty, EXPLORE_1D_COORDINATE_SNAP_MODE, {
      graphOptions: {
        initialBounds: EXPLORE_1D_GRAPH_BOUNDS,
        orientation: graphOrientation
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
    this.vectorSet.reset();
    this.vectors.forEach( vector => vector.reset() );
  }

  public override erase(): void {
    super.erase();
    this.vectorSet.erase();
  }
}

vectorAddition.register( 'Explore1DScene', Explore1DScene );