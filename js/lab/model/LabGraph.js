// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph on the 'Lab' screen.
 * 'Explore2D' has a total of 2 graphs (polar an cartesian)
 *
 * Characteristics of graphs on 'Lab':
 *  - have two sum visible properties each (one for each vector set)
 *  - have exactly 2 vector sets
 *  - are two dimensional
 *  - unique vector groups for each and every vector set
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
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const DEFAULT_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  // all graphs are two dimensional
  const LAB_GRAPH_ORIENTATION = GraphOrientations.TWO_DIMENSIONAL;

  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;

  class LabGraph extends Graph {
    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorGroups} vectorGroupOne - unique vector group for the first vector set
     * @param {VectorGroups} vectorGroupTwo - unique vector group for the second vector set
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorGroupOne, vectorGroupTwo ) {
    
      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorGroups.includes( vectorGroupOne ), `invalid vectorGroupOne: ${vectorGroupOne}` );
      assert && assert( VectorGroups.includes( vectorGroupTwo ), `invalid vectorGroupTwo: ${vectorGroupTwo}` );

      super( DEFAULT_GRAPH_BOUNDS, coordinateSnapMode, LAB_GRAPH_ORIENTATION, componentStyleProperty );

      //----------------------------------------------------------------------------------------
      // @public {BooleanProperty} group1SumVisibleProperty - property controlling the visibility of the sum for the
      // first vector set
      this.group1SumVisibleProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // @public {BooleanProperty} group2SumVisibleProperty - property controlling the visibility of the sum for the
      // second vector set
      this.group2SumVisibleProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      //----------------------------------------------------------------------------------------
      // Create and add the vector sets

      const graphBounds = this.graphModelBounds;

      // @public (read-only) {VectorSet} vectorSetGroup1
      this.vectorSetGroup1 = new VectorSet( this,
        componentStyleProperty,
        this.group1SumVisibleProperty,
        vectorGroupOne, {
          initialSumTailPosition: new Vector2( graphBounds.minX + 2 / 3 * graphBounds.width , graphBounds.centerY )
        }
      );

      // @public (read-only) {VectorSet} vectorSetGroup1
      this.vectorSetGroup2 = new VectorSet( this,
        componentStyleProperty,
        this.group2SumVisibleProperty,
        vectorGroupTwo, {
          initialSumTailPosition: new Vector2( graphBounds.minX + 1 / 3 * graphBounds.width, graphBounds.centerY )
        }
      );
      this.vectorSets.push( this.vectorSetGroup1, this.vectorSetGroup2 );
    }

    /**
     * @override
     * Resets the LabGraph
     * @public
     */
    reset() {
      this.group1SumVisibleProperty.reset();
      this.group2SumVisibleProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'LabGraph', LabGraph );
} );