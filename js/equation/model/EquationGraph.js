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
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  // constants

  // graph bounds for Equation Graphs
  const EQUATION_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS.withOffsets( 0, 0, 0, -5 );

  // Equation Graphs a strictly 2 Two-dimensional
  const EQUATION_GRAPH_ORIENTATION = GraphOrientations.TWO_DIMENSIONAL;

  // Starting Equation Type
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;

  // Starting Base Vector visibility
  const DEFAULT_BASE_VECTOR_VISIBILITY = false;


  class EquationGraph extends Graph {

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

      //----------------------------------------------------------------------------------------
      super( EQUATION_GRAPH_BOUNDS, coordinateSnapMode, EQUATION_GRAPH_ORIENTATION );


      // @public (read-only) {EnumerationProperty.<EquationTypes>} equationTypeProperty
      this.equationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );


      // @public (read-only) {BooleanProperty} baseVectorsVisibleProperty
      this.baseVectorsVisibleProperty = new BooleanProperty( DEFAULT_BASE_VECTOR_VISIBILITY );


      // @public (read-only) {EquationVectorSet} vectorSet
      this.vectorSet = new EquationVectorSet( this, componentStyleProperty, vectorColorGroup, coordinateSnapMode );

      this.vectorSets.push( this.vectorSet );
    }

    /**
     * Resets the Equation Graph.
     * @public
     *
     * @override
     */
    reset() {
      this.equationTypeProperty.reset();
      this.baseVectorsVisibleProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'EquationGraph', EquationGraph );
} );