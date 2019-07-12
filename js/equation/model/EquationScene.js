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
  // const BaseVectorModel = require( 'VECTOR_ADDITION/equation/model/BaseVectorModel' );
  // const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  // const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  // const Vector2 = require( 'DOT/Vector2' );

  // constants
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;
  const DEFAULT_BASE_VECTOR_VISIBILTY = false;
  // const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;

  class EquationScene {
    /**
     * @constructor
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
      // const vectorTags = coordinateSnapMode === CoordinateSnapModes.CARTESIAN ? VectorAdditionConstants.VECTOR_TAGS_GROUP_1 :
      //   VectorAdditionConstants.VECTOR_TAGS_GROUP_2;
      
      // for ( let tagIndex = 0; tagIndex < vectorTags.length - 1; tagIndex++ ) {

        // const baseVector = new BaseVectorModel( tailPositions[ tagIndex ],
        //   initialComponents[ tagIndex ],
        //   graph,
        //   this,
        //   VECTOR_TAGS[ tagIndex ] );

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



    }

    reset() {
      this.additionGraph.reset();
      this.subtractionGraph.reset();
      this.negationGraph.reset();
    }

  }

  return vectorAddition.register( 'EquationScene', EquationScene );
} );