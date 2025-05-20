// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DScene is a scene in the 'Explore 1D' screen.
 *
 * Characteristics of an Explore1DScene are:
 *  - it has 1 vector set
 *  - the graph orientation is either horizontal or vertical
 *  - it snaps to Cartesian coordinates
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import { CoordinateSnapMode } from '../../common/model/CoordinateSnapMode.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import { GraphOrientation } from '../../common/model/GraphOrientation.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const DEFAULT_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

// See https://github.com/phetsims/vector-addition/issues/127
assert && assert( DEFAULT_GRAPH_BOUNDS.width % 2 === 0, `DEFAULT_GRAPH_BOUNDS.width must be even: ${DEFAULT_GRAPH_BOUNDS.width}` );
assert && assert( DEFAULT_GRAPH_BOUNDS.height % 2 === 0, `DEFAULT_GRAPH_BOUNDS.height must be even: ${DEFAULT_GRAPH_BOUNDS.height}` );

// graph bounds for 'Explore 1D' - origin is at the center
const EXPLORE_1D_GRAPH_BOUNDS = new Bounds2( -DEFAULT_GRAPH_BOUNDS.width / 2,
  -DEFAULT_GRAPH_BOUNDS.height / 2,
  DEFAULT_GRAPH_BOUNDS.width / 2,
  DEFAULT_GRAPH_BOUNDS.height / 2 );

// All graphs on 'Explore 1D' are strictly Cartesian
const EXPLORE_1D_COORDINATE_SNAP_MODE: CoordinateSnapMode = 'cartesian';

export default class Explore1DScene extends VectorAdditionScene {

  // Graphs on 'Explore 1D' have exactly one vector set
  public readonly vectorSet: VectorSet;

  /**
   * @param graphOrientation - orientation of the graph (Must be either Horizontal or Vertical)
   * @param componentVectorStyleProperty
   * @param sumVisibleProperty - shared boolean Property that controls the visibility of sum vectors
   * @param vectorColorPalette - color palette for vectors in this scene
   * @param tandem
   */
  public constructor( graphOrientation: GraphOrientation,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      tandem: Tandem ) {

    assert && assert( _.includes( [ 'horizontal', 'vertical' ], graphOrientation ) );

    super( EXPLORE_1D_COORDINATE_SNAP_MODE, {
      graphOptions: {
        initialBounds: EXPLORE_1D_GRAPH_BOUNDS,
        orientation: graphOrientation
      },
      tandem: tandem
    } );

    this.vectorSet = new VectorSet( this, componentVectorStyleProperty, sumVisibleProperty, vectorColorPalette, {
      tandem: tandem.createTandem( 'vectorSet' )
    } );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );
  }
}

vectorAddition.register( 'Explore1DScene', Explore1DScene );