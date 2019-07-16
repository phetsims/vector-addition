// Copyright 2019, University of Colorado Boulder

/**
 * Model for a graph on the equation screen.
 *
 * Equation graphs:
 *  - have no sum visible properties
 *  - have exactly one vector set
 *  - have a equation type
 *  - are two dimensional
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  // const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  // const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  // const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  // const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const EQUATION_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS
    .withOffsets( 0, 0, 0, -VectorAdditionConstants.DEFAULT_VECTOR_LENGTH );

  class EquationGraph extends Graph {
    /**
     * @param {CoordinateSnapModes} coordinateSnapMode
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorGroup, equationType ) {
    
      super( EQUATION_GRAPH_BOUNDS, coordinateSnapMode, GraphOrientations.TWO_DIMENSIONAL, componentStyleProperty );

      // @public (read-only) {EquationVectorSet}
      this.vectorSet = new EquationVectorSet( this,
        componentStyleProperty,
        new BooleanProperty( true ),
        vectorGroup,
        coordinateSnapMode,
        equationType
      );

      this.equationType = equationType;

      this.vectorSets.push( this.vectorSet );
    }
  }

  return vectorAddition.register( 'EquationGraph', EquationGraph );
} );