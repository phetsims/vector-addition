// Copyright 2019, University of Colorado Boulder

/**
 * Model for a single graph on the 'Lab' screen. 'Lab' has a total of 2 graphs (polar and cartesian).
 *
 * Characteristics of a Lab Graph (which extends Graph) are:
 *  - Lab graphs have exactly 2 vector sets each
 *  - Each vector set has its own sum visible property respectively
 *  - Each vector set has a vector sum that starts in a different position
 *  - Two-dimensional
 *  - Unique vector color groups for each vector set
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
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;

  // Lab Graphs have the 'default' graph bounds
  const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  // Lab Graphs are two-dimensional
  const LAB_GRAPH_ORIENTATION = GraphOrientations.TWO_DIMENSIONAL;


  class LabGraph extends Graph {

    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorColorGroups} vectorColorGroup1 - unique vector color group for the first vector set
     * @param {VectorColorGroups} vectorColorGroup2 - unique vector color group for the second vector set
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorColorGroup1, vectorColorGroup2 ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup1 ),
        `invalid vectorColorGroup1: ${vectorColorGroup1}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup2 ),
        `invalid vectorColorGroup2: ${vectorColorGroup2}` );


      super( LAB_GRAPH_BOUNDS, coordinateSnapMode, LAB_GRAPH_ORIENTATION );

      //----------------------------------------------------------------------------------------
      // Create the 2 sum visible properties (one for each vector set)

      // @public {BooleanProperty} sumVisibleProperty1 - Property controlling the visibility of the sum for the
      //                                                 first vector set
      this.sumVisibleProperty1 = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // @public {BooleanProperty} sumVisibleProperty2 - Property controlling the visibility of the sum for the
      //                                                 second vector set
      this.sumVisibleProperty2 = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      //----------------------------------------------------------------------------------------
      // Create and add the vector sets (a total of 2 vector sets per graph)

      const graphBounds = LAB_GRAPH_BOUNDS; // convenience reference

      // @public (read-only) {VectorSet} vectorSet1
      this.vectorSet1 = new VectorSet( this, componentStyleProperty, this.sumVisibleProperty1, vectorColorGroup1, {
        initialSumTailPosition: new Vector2( graphBounds.minX + 1 * graphBounds.width / 3, graphBounds.centerY )
      } );

      // @public (read-only) {VectorSet} vectorSet2
      this.vectorSet2 = new VectorSet( this, componentStyleProperty, this.sumVisibleProperty2, vectorColorGroup2, {
        initialSumTailPosition: new Vector2( graphBounds.minX + 2 * graphBounds.width / 3, graphBounds.centerY )
      } );

      // Add the vector sets
      this.vectorSets.push( this.vectorSet1, this.vectorSet2 );
    }

    /**
     * Resets the LabGraph. Essentially the same as the super class, but resets the sum visibility.
     * @public
     *
     * @override
     */
    reset() {
      this.sumVisibleProperty1.reset();
      this.sumVisibleProperty2.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'LabGraph', LabGraph );
} );