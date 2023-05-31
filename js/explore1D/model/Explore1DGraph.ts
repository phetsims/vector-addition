// Copyright 2019-2023, University of Colorado Boulder

/**
 * Model for a single graph on the 'Explore 1D' screen. 'Explore 1D' has a total of 2 graphs (polar and Cartesian).
 *
 * Characteristics of a Explore 1D Graph (which extends Graph) are:
 *  - Explore 1D graphs have exactly 1 vector sets each
 *  - Have a shared sum visible property across all graphs
 *  - are either Horizontal or Vertical
 *  - Are strictly Cartesian
 *  - Same width/height as default graph bounds, but the origin is in the center
 *
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ComponentVectorStyles from '../../common/model/ComponentVectorStyles.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import Graph from '../../common/model/Graph.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import vectorAddition from '../../vectorAddition.js';
import Property from '../../../../axon/js/Property.js';

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
const EXPLORE_1D_COORDINATE_SNAP_MODE = CoordinateSnapModes.CARTESIAN;

export default class Explore1DGraph extends Graph {

  // Graphs on 'Explore 1D' have exactly one vector set
  public readonly vectorSet: VectorSet;

  /**
   * @param graphOrientation - orientation of the graph (Must be either Horizontal or Vertical)
   * @param componentStyleProperty
   * @param sumVisibleProperty - shared boolean Property that controls the visibility of sum vectors
   * @param vectorColorPalette - color palette for vectors on this graph
   */
  public constructor( graphOrientation: GraphOrientations,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      sumVisibleProperty: Property<boolean>,
                      vectorColorPalette: VectorColorPalette ) {

    assert && assert( _.includes( [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ], graphOrientation ) );

    super( EXPLORE_1D_GRAPH_BOUNDS, EXPLORE_1D_COORDINATE_SNAP_MODE, {
      orientation: graphOrientation
    } );

    this.vectorSet = new VectorSet( this, componentStyleProperty, sumVisibleProperty, vectorColorPalette );

    // Add the one and only vector set
    this.vectorSets.push( this.vectorSet );
  }
}

vectorAddition.register( 'Explore1DGraph', Explore1DGraph );