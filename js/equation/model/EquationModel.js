// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Equation` screen.
 *
 * Equation has a polar and a horizontal scene. Each scene has one equation vector set. Each vector set is a fixed
 * amount of vectors.
 *
 * Equation has no 'creator panel' but uses number spinners to adjust a base vector model and coefficients.
 *
 * The sum is denoted by 'c' and is always visible.
 *
 * The equation model adds the following to the vector addition model
 *  - Properties (one for each scene) to control equation types (see ./EquationTypes.js)
 *  - Properties (one for each scene) to control if the base vectors are visible
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
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants
  const EQUATION_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS
                                  .withOffsets( 0, 0, 0, -VectorAdditionConstants.DEFAULT_VECTOR_LENGTH );
  const STARTING_EQUATION_TYPE = EquationTypes.ADDITION;
  const DEFAULT_BASE_VECTOR_VISIBILTY = false;
  const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;

  class EquationModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // On equation, the 'sum' is always visible
      const equationSumVisibleProperty = new BooleanProperty( true );

      equationSumVisibleProperty.link( ( isSumVisible ) => {
        if ( !isSumVisible ) {
          assert && assert( false, 'equation sum vectors are always visible' );
        }
      } );

      super( [ equationSumVisibleProperty ], tandem );

      //----------------------------------------------------------------------------------------
      // Create the two graphs

      // @public (read-only) {graph}
      this.polarGraph = new Graph( EQUATION_GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );

      // @public (read-only) {graph}
      this.cartesianGraph = new Graph( EQUATION_GRAPH_BOUNDS, GraphOrientations.TWO_DIMENSIONAL );

      this.graphs.push( this.polarGraph, this.cartesianGraph );

      //----------------------------------------------------------------------------------------
      // Add properties (one for each scene) to control equation types (see ./EquationTypes.js)

      // @public (read-only) {EnumerationProperty.<EquationTypes>}
      this.polarEquationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      // @public (read-only) {EnumerationProperty.<EquationTypes>}
      this.cartesianEquationTypeProperty = new EnumerationProperty( EquationTypes, STARTING_EQUATION_TYPE );

      //----------------------------------------------------------------------------------------
      // Add properties (one for each scene) to control if the base vectors are visible

      // @public (read-only) {BooleanProperty}
      this.polarBaseVectorsVisibleProperty = new BooleanProperty( DEFAULT_BASE_VECTOR_VISIBILTY );

      // @public (read-only) {BooleanProperty}
      this.cartesianBaseVectorsVisibleProperty = new BooleanProperty( DEFAULT_BASE_VECTOR_VISIBILTY );

      //----------------------------------------------------------------------------------------
      // Create the vector sets for each graph

      // @public (read-only) {EquationVectorSet}
      this.polarVectorSet = new EquationVectorSet( this.polarGraph,
        this.componentStyleProperty,
        equationSumVisibleProperty,
        VectorGroups.THREE,
        CoordinateSnapModes.POLAR,
        new Vector2( DEFAULT_VECTOR_LENGTH, DEFAULT_VECTOR_LENGTH ),
        this.polarEquationTypeProperty
        );

      // @public (read-only) {EquationVectorSet}
      this.cartesianVectorSet = new EquationVectorSet( this.cartesianGraph,
        this.componentStyleProperty,
        equationSumVisibleProperty,
        VectorGroups.THREE,
        CoordinateSnapModes.CARTESIAN,
        new Vector2( DEFAULT_VECTOR_LENGTH, DEFAULT_VECTOR_LENGTH ),
        this.cartesianEquationTypeProperty
        );

      this.polarGraph.vectorSets.push( this.polarVectorSet );
      this.cartesianGraph.vectorSets.push( this.cartesianVectorSet );

    }

    /**
     * Resets the equation model
     */
    reset() {
      
      // Reset base vectors visible properties
      this.cartesianBaseVectorsVisibleProperty.reset();
      this.polarBaseVectorsVisibleProperty.reset();

      // Reset the properties to control equation types
      this.polarEquationTypeProperty.reset();
      this.cartesianEquationTypeProperty.reset();

      super.reset();
    }
  }

  return vectorAddition.register( 'EquationModel', EquationModel );
} );