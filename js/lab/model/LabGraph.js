// Copyright 2019, University of Colorado Boulder

/**
 * Model for a single graph on the 'Lab' screen. 'Lab' has a total of 2 graphs (polar and Cartesian).
 *
 * Characteristics of a Lab Graph (which extends Graph) are:
 *  - Lab graphs have exactly 2 vector sets each
 *  - Each vector set has its own sum visible property respectively
 *  - Each vector set has a sum vector that starts in a different position
 *  - Two-dimensional
 *  - Color palette for each vector set
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // Lab Graphs have the 'default' graph bounds
  const LAB_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  // Lab Graphs are two-dimensional
  const LAB_GRAPH_ORIENTATION = GraphOrientations.TWO_DIMENSIONAL;

  class LabGraph extends Graph {

    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Property.<boolean>} sumVisibleProperty1
     * @param {Property.<boolean>} sumVisibleProperty2
     * @param {VectorColorPalette} vectorColorPalette1 - color palette for the first vector set
     * @param {VectorColorPalette} vectorColorPalette2 - color palette for the second vector set
     */
    constructor( coordinateSnapMode, componentStyleProperty, sumVisibleProperty1, sumVisibleProperty2,
                 vectorColorPalette1, vectorColorPalette2 ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( vectorColorPalette1 instanceof VectorColorPalette,
        `invalid vectorColorPalette1: ${vectorColorPalette1}` );
      assert && assert( vectorColorPalette2 instanceof VectorColorPalette,
        `invalid vectorColorPalette2: ${vectorColorPalette2}` );

      super( LAB_GRAPH_BOUNDS, coordinateSnapMode, LAB_GRAPH_ORIENTATION );

      // @public (read-only) {VectorSet} vectorSet1
      this.vectorSet1 = new VectorSet( this, componentStyleProperty, sumVisibleProperty1, vectorColorPalette1, {
        initialSumTailPosition: new Vector2( LAB_GRAPH_BOUNDS.minX + 1 * LAB_GRAPH_BOUNDS.width / 3, LAB_GRAPH_BOUNDS.centerY )
      } );

      // @public (read-only) {VectorSet} vectorSet2
      this.vectorSet2 = new VectorSet( this, componentStyleProperty, sumVisibleProperty2, vectorColorPalette2, {
        initialSumTailPosition: new Vector2( LAB_GRAPH_BOUNDS.minX + 2 * LAB_GRAPH_BOUNDS.width / 3, LAB_GRAPH_BOUNDS.centerY )
      } );

      // Add the vector sets
      this.vectorSets.push( this.vectorSet1, this.vectorSet2 );
    }
  }

  return vectorAddition.register( 'LabGraph', LabGraph );
} );