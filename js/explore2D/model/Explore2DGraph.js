// Copyright 2019, University of Colorado Boulder

/**
 * Model for a single graph on the 'Explore 2D' screen. 'Explore 2D' has a total of 2 graphs (polar and cartesian).
 *
 * Characteristics of a Explore 2D Graph (which extends Graph) are:
 *  - Explore 2D graphs have exactly 1 vector sets each
 *  - Has its own sum visible property respectively
 *  - Two-dimensional
 *  - Has a Unique vector color group
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
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;

  // Explore 2D Graphs have the 'default' graph bounds
  const EXPLORE_2D_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  // Explore 2D Graphs are two-dimensional
  const EXPLORE_2D_GRAPH_ORIENTAION = GraphOrientations.TWO_DIMENSIONAL;


  class Explore2DGraph extends Graph {

    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorColorGroups} vectorColorGroup - unique vector color group for the graph
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorColorGroup ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup ),
        `invalid vectorColorGroup: ${vectorColorGroup}` );


      super( EXPLORE_2D_GRAPH_BOUNDS, coordinateSnapMode, EXPLORE_2D_GRAPH_ORIENTAION );

      //----------------------------------------------------------------------------------------

      // @public {BooleanProperty} sumVisibleProperty - Property controlling the visibility of the sum for this unique
      //                                                Graph instance
      this.sumVisibleProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // @public (read-only) {VectorSet} vectorSet - Graphs on 'Explore 2D' have exactly one vector set
      this.vectorSet = new VectorSet( this, componentStyleProperty, this.sumVisibleProperty, vectorColorGroup );

      // Add the one and only vector set
      this.vectorSets.push( this.vectorSet );
    }


    /**
     * Resets the Explore2DGraph. Essentially the same as the super class, but resets the sum visibility.
     * @public
     *
     * @override
     */
    reset() {
      this.sumVisibleProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore2DGraph', Explore2DGraph );
} );