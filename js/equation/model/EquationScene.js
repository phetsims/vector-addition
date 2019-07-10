// Copyright 2019, University of Colorado Boulder

/**
 * Model for a scene for the `equation`` screen. In the equation screen. there are nested scenes.
 * See https://github.com/phetsims/vector-addition/issues/65.
 *
 * This model is responsible for:
 *  - Base vectors visibility.
 *  - EquationTypeProperty
 *  - Creating a graph for each equation type
 *  
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  // const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EquationGraph = require( 'VECTOR_ADDITION/equation/model/EquationGraph' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );

  // constants
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;
  const DEFAULT_BASE_VECTOR_VISIBILTY = false;

  class EquationScene {
    /**
     * @constructor
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorGroup ) {


      // @public (read-only) {EnumerationProperty.<EquationTypes>}
      this.equationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      // @public (read-only) {BooleanProperty}
      this.baseVectorsVisibleProperty = new BooleanProperty( DEFAULT_BASE_VECTOR_VISIBILTY );


      this.additionGraph = new EquationGraph( coordinateSnapMode,
        componentStyleProperty,
        vectorGroup,
        EquationTypes.ADDITION );

      this.subtractionGraph = new EquationGraph( coordinateSnapMode,
        componentStyleProperty,
        vectorGroup,
        EquationTypes.SUBTRACTION );

      this.negationGraph = new EquationGraph( coordinateSnapMode,
        componentStyleProperty,
        vectorGroup,
        EquationTypes.NEGATION );
    }

  }

  return vectorAddition.register( 'EquationScene', EquationScene );
} );