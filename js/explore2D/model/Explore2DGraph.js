// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph on the 'Explore 2D' screen.
 * 'Explore2D' has a total of 2 graphs (polar an cartesian)
 *
 * Characteristics of graphs on 'Explore 2D':
 *  - have a sum visible property each
 *  - have exactly one vector set
 *  - are two dimensional
 *  - unique vector groups
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const DEFAULT_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  // all graphs are two dimensional
  const EXPLORE_2D_GRAPH_ORIENTAION = GraphOrientations.TWO_DIMENSIONAL;

  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;

  class Explore2DGraph extends Graph {
    /**
     * @constructor
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorGroups} vectorGroup - unique vector group for the graph
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorGroup ) {
    
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );


      super( DEFAULT_GRAPH_BOUNDS, coordinateSnapMode, EXPLORE_2D_GRAPH_ORIENTAION );

      //----------------------------------------------------------------------------------------
      // @public {BooleanProperty} sumVisibleProperty - property controlling the visibility of the sum for this unique
      // graph instance
      this.sumVisibleProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // Create and add the vector set.
      // @public (read-only) {VectorSet} vectorSet - graphs on 'Explore 2D' have exactly one vector set
      this.vectorSet = new VectorSet( this,
        componentStyleProperty,
        this.sumVisibleProperty,
        vectorGroup,
        this.coordinateSnapMode
      );

      this.vectorSets.push( this.vectorSet );
    }

    /**
     * @override
     * Resets the explore2DGraph
     * @public
     */
    reset() {
      this.sumVisibleProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore2DGraph', Explore2DGraph );
} );