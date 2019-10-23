// Copyright 2019, University of Colorado Boulder

/**
 * Model for a single graph on the 'Equations' screen, which has 2 graphs (Polar and Cartesian).
 *
 * Characteristics of an EquationsGraph (which extends Graph) are:
 *  - have exactly 1 VectorSet
 *  - has a Property to select the equation type (addition/subtraction/negation) per graph
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equations/model/EquationTypes' );
  const EquationsVectorSet = require( 'VECTOR_ADDITION/equations/model/EquationsVectorSet' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // constants

  // graph bounds for EquationsGraphs
  const EQUATIONS_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  // Bottom left corner, in view coordinates.
  const BOTTOM_LEFT = new Vector2( Graph.DEFAULT_BOTTOM_LEFT.x, Graph.DEFAULT_BOTTOM_LEFT.y + 40 );

  // Starting equation type
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;

  class EquationsGraph extends Graph {

    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {VectorColorPalette} vectorColorPalette - color palette for vectors on the graph
     */
    constructor( coordinateSnapMode, componentStyleProperty, sumVisibleProperty, vectorColorPalette ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

      super( EQUATIONS_GRAPH_BOUNDS, coordinateSnapMode, {
        bottomLeft: BOTTOM_LEFT
      } );

      // @public (read-only) {EnumerationProperty.<EquationTypes>} equationTypeProperty
      this.equationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      // @public (read-only) {EquationsVectorSet} vectorSet
      this.vectorSet = new EquationsVectorSet( this, componentStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode );

      this.vectorSets.push( this.vectorSet );
    }

    /**
     * Resets the graph.
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.equationTypeProperty.reset();
    }
  }

  return vectorAddition.register( 'EquationsGraph', EquationsGraph );
} );