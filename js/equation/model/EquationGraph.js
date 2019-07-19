// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph on the equation screen.
 *
 * Equation graphs:
 *  - have no sum visible Properties
 *  - have exactly one vector set
 *  - have a equation type
 *  - are two dimensional
 *  - Have 3 modes (addition, subtraction, and negation) for the 3 equation types
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
  const EQUATION_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS
    .withOffsets( 0, 0, 0, -VectorAdditionConstants.DEFAULT_VECTOR_LENGTH );

  // equation graphs are two dimensional
  const EQUATION_GRAPH_ORIENTATION = GraphOrientations.TWO_DIMENSIONAL;
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;
  const DEFAULT_BASE_VECTOR_VISIBILTY = false;


  class EquationGraph extends Graph {

    /**
     * @param {CoordinateSnapModes} coordinateSnapMode - coordinateSnapMode for the graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorColorGroups} vectorColorGroup - unique vector group for the graph
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorColorGroup ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ),
        `invalid coordinateSnapMode: ${coordinateSnapMode}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup ), `invalid vectorColorGroup: ${vectorColorGroup}` );

      //----------------------------------------------------------------------------------------
      super( EQUATION_GRAPH_BOUNDS, coordinateSnapMode, EQUATION_GRAPH_ORIENTATION );


      // @public (read-only) {EnumerationProperty.<EquationTypes>} equationTypeProperty
      this.equationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );


      // @public (read-only) {BooleanProperty} baseVectorsVisibleProperty
      this.baseVectorsVisibleProperty = new BooleanProperty( DEFAULT_BASE_VECTOR_VISIBILTY );


      // @public (read-only) {EquationVectorSet} vectorSet
      this.vectorSet = new EquationVectorSet( this,
        componentStyleProperty,
        vectorColorGroup,
        coordinateSnapMode,
        this.equationTypeProperty
      );


      this.vectorSets.push( this.vectorSet );
    }
  }

  return vectorAddition.register( 'EquationGraph', EquationGraph );
} );