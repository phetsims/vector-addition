// Copyright 2019, University of Colorado Boulder

/**
 * Model for a single graph on the 'Explore 1D' screen. 'Explore 1D' has a total of 2 graphs (polar and cartesian).
 *
 * Characteristics of a Explore 1D Graph (which extends Graph) are:
 *  - Explore 1D graphs have exactly 1 vector sets each
 *  - Have a shared sum visible property across all graphs
 *  - are either Horizontal or Vertical
 *  - Are strictly cartesian
 *  - Same width/height as default graph bounds, but the origin is in the center
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const DEFAULT_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  // graph bounds for 'Explore 1D' - origin is at the center
  const EXPLORE_1D_GRAPH_BOUNDS = new Bounds2( -DEFAULT_GRAPH_BOUNDS.width / 2,
    -DEFAULT_GRAPH_BOUNDS.height / 2,
    DEFAULT_GRAPH_BOUNDS.width / 2,
    DEFAULT_GRAPH_BOUNDS.height / 2 );

  // All graphs on 'Explore 1D' are strictly cartesian
  const EXPLORE_1D_COORDINATE_SNAP_MODE = CoordinateSnapModes.CARTESIAN;


  class Explore1DGraph extends Graph {

    /**
     * @param {GraphOrientations} graphOrientation - orientation of the graph (Must be either Horizontal or Vertical)
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty - shared boolean Property that controls the visibility of sum vectors
     * @param {VectorColorGroups} vectorColorGroup - shared vector color group for both graphs in 'Explore 1D'
     */
    constructor( graphOrientation, componentStyleProperty, sumVisibleProperty, vectorColorGroup ) {

      assert && assert( _.includes( [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ], graphOrientation ) );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup ),
        `invalid vectorColorGroup: ${vectorColorGroup}` );


      super( EXPLORE_1D_GRAPH_BOUNDS, EXPLORE_1D_COORDINATE_SNAP_MODE, graphOrientation );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {VectorSet} vectorSet - Graphs on 'Explore 1D' have exactly one vector set
      this.vectorSet = new VectorSet( this, componentStyleProperty, sumVisibleProperty, vectorColorGroup );

      // Add the one and only vector set
      this.vectorSets.push( this.vectorSet );
    }
  }

  return vectorAddition.register( 'Explore1DGraph', Explore1DGraph );
} );