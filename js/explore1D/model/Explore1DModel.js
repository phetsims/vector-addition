// Copyright 2019, University of Colorado Boulder

/**
 * Model for the Explore1D screen. Explore1D has a horizontal and a vertical scene. Each scene has one vector set.
 * Explore1D has one shared sum visible property.
 *
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );

  // constants
  const DEFAULT_VECTOR_ORIENTATION = GraphOrientations.HORIZONTAL;
  const DEFAULT_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;

  const EXPLORE_1D_BOUNDS = new Bounds2( -DEFAULT_GRAPH_BOUNDS.width / 2,
    -DEFAULT_GRAPH_BOUNDS.height / 2,
    DEFAULT_GRAPH_BOUNDS.width / 2,
    DEFAULT_GRAPH_BOUNDS.height / 2 );

  class Explore1DModel extends VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // Create the one and only (shared between graphs) sum visible property for explore1D
      const sumVisibleProperty = new BooleanProperty( false );

      super( [ sumVisibleProperty ], tandem );

      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = sumVisibleProperty;

      // @public {EnumerationProperty.<GraphOrientations>} - controls the orientation of the vectors
      this.graphOrientationProperty = new EnumerationProperty( GraphOrientations, DEFAULT_VECTOR_ORIENTATION );

      // @public (read-only) {VectorGroups} VectorGroups - the only vector group used on the explore1D screen
      this.vectorGroup = VectorGroups.ONE;

      //----------------------------------------------------------------------------------------
      // Create and add the graphs

      // @public (read-only) {Graph}
      this.verticalGraph = new Graph( EXPLORE_1D_BOUNDS, GraphOrientations.VERTICAL );
      this.graphs.push( this.verticalGraph );

      // @public (read-only) {Graph}
      this.horizontalGraph = new Graph( EXPLORE_1D_BOUNDS, GraphOrientations.HORIZONTAL );
      this.graphs.push( this.horizontalGraph );


      //----------------------------------------------------------------------------------------
      // Create the vector sets. Each graph has one vector set

      this.verticalGraph.vectorSet = this.verticalGraph.createVectorSet( this.componentStyleProperty,
        this.sumVisibleProperty,
        this.vectorGroup,
        CoordinateSnapModes.CARTESIAN );
      this.verticalGraph.vectorSets.push( this.verticalGraph.vectorSet );

      this.horizontalGraph.vectorSet = this.horizontalGraph.createVectorSet( this.componentStyleProperty,
        this.sumVisibleProperty,
        this.vectorGroup,
        CoordinateSnapModes.CARTESIAN );
      this.horizontalGraph.vectorSets.push( this.horizontalGraph.vectorSet );



      //----------------------------------------------------------------------------------------
      // Disable angle
      this.angleVisibleProperty.link( angleVisible => {
        if ( angleVisible ) {
          throw new Error( 'Angles are never visible for Explore1D' );
        }
      } );

      // Disable polar / cartesian mode
      this.coordinateSnapModeProperty.link( coordinateSnapMode => {
        if ( coordinateSnapMode !== CoordinateSnapModes.CARTESIAN ) {
          throw new Error( 'Explore1D only uses cartesian' );
        }
      } );
    }

    /**
     * @public
     * @override
     * Resets the Explore1D model
     */
    reset() {
      this.graphOrientationProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );