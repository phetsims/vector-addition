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
  // const BaseVector = require( 'VECTOR_ADDITION/equation/model/BaseVector' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  // const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  // const Vector2 = require( 'DOT/Vector2' );

  // constants
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;
  const DEFAULT_BASE_VECTOR_VISIBILTY = false;
  // const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;
  const VECTOR_SYMBOLS = VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1;

  class EquationScene {
    /**
     *
     */
    constructor( coordinateSnapMode, componentStyleProperty, vectorGroup ) {


      // @public (read-only) {EnumerationProperty.<EquationTypes>}
      this.equationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      // @public (read-only) {BooleanProperty}
      this.baseVectorsVisibleProperty = new BooleanProperty( DEFAULT_BASE_VECTOR_VISIBILTY );

      //----------------------------------------------------------------------------------------
      // Create base vectors

      // @public (read-only)
      this.baseVectors = [];

      // // TODO: whats the cleanest way to give tail positions
      // const tailPositions = [ new Vector2( 45, 20 ), new Vector2( 45, 5 ) ];


      // // TODO: whats the cleanest way to give initial components see #64
      // const initialComponents = [ new Vector2( 0, 5 ), new Vector2( 5, 45 ) ];

      // // create the two base vectors
      // const vectorSymbols = coordinateSnapMode === CoordinateSnapModes.CARTESIAN ? VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
      //   VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

      // for ( let symbolIndex = 0; symbolIndex < vectorSymbols.length - 1; symbolIndex++ ) {

      // const baseVector = new BaseVector( tailPositions[ symbolIndex ],
      //   initialComponents[ symbolIndex ],
      //   graph,
      //   this,
      //   VECTOR_SYMBOLS[ symbolIndex ] );

      // }


      //----------------------------------------------------------------------------------------

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

      // @public
      this.graphs = [ this.additionGraph, this.subtractionGraph, this.negationGraph ];


      this.symbols = VECTOR_SYMBOLS;

    }

    reset() {
      this.additionGraph.reset();
      this.subtractionGraph.reset();
      this.negationGraph.reset();
    }

  }

  return vectorAddition.register( 'EquationScene', EquationScene );
} );