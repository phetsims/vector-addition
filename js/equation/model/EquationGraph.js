// Copyright 2019, University of Colorado Boulder

/**
 * Model for a single graph on the  Equation' screen. Equation' has a total of 2 graphs (polar and cartesian).
 *
 * Characteristics of a Equation Graph (which extends Graph) are:
 *  - have exactly 1 vector set
 *  - Has a Equation Types Property (addition/subtraction/negation) per graph
 *  - Same graph bounds as default graph bounds but subtracts 5 from the top
 *  - Has a Base Vectors Visible Property
 *  - Two-dimensional
 *  - Color palette for vectors on the graph
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  // constants

  // graph bounds for Equation Graphs
  const EQUATION_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.withOffsets( 0, 0, 0, -5 );

  // Starting Equation Type
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;

  class EquationGraph extends Graph {

    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {VectorColorPalette} vectorColorPalette - color palette for vectors on the graph
     */
    constructor( coordinateSnapMode, componentStyleProperty, sumVisibleProperty, vectorColorPalette ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ), `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

      super( EQUATION_GRAPH_BOUNDS, coordinateSnapMode, GraphOrientations.TWO_DIMENSIONAL );

      // @public (read-only) {EnumerationProperty.<EquationTypes>} equationTypeProperty
      this.equationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      // @public (read-only) {EquationVectorSet} vectorSet
      this.vectorSet = new EquationVectorSet( this, componentStyleProperty, sumVisibleProperty, vectorColorPalette, coordinateSnapMode );

      this.vectorSets.push( this.vectorSet );
    }

    /**
     * Resets the Equation Graph.
     * @public
     *
     * @override
     */
    reset() {
      super.reset();
      this.equationTypeProperty.reset();
    }
  }

  return vectorAddition.register( 'EquationGraph', EquationGraph );
} );