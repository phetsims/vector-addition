// Copyright 2019-2025, University of Colorado Boulder

/**
 * Model for a single graph on the 'Explore 1D' screen. 'Explore 1D' has a total of 2 graphs (polar and Cartesian).
 *
 * Characteristics of a Explore 1D VectorAdditionScene (which extends VectorAdditionScene) are:
 *  - Explore 1D graphs have exactly 1 vector sets each
 *  - Have a shared sum visible property across all graphs
 *  - are either Horizontal or Vertical
 *  - Are strictly Cartesian
 *  - Same width/height as default graph bounds, but the origin is in the center
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

// constants
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
   * @param vectorColorPalette - color palette for vectors on this graph
   * @param tandem
   */
  public constructor( graphOrientation: GraphOrientation,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette,
                      tandem: Tandem ) {

    assert && assert( _.includes( [ 'horizontal', 'vertical' ], graphOrientation ) );

    super( EXPLORE_1D_GRAPH_BOUNDS, EXPLORE_1D_COORDINATE_SNAP_MODE, {
      orientation: graphOrientation,
      tandem: tandem
    } );

    this.vectorSet = new VectorSet( this, componentVectorStyleProperty, sumVisibleProperty, vectorColorPalette );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );
  }
}

vectorAddition.register( 'Explore1DScene', Explore1DScene );