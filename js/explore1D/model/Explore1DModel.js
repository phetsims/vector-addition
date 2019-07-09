// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Explore1D` screen.
 *
 * Explore1D has a horizontal and a vertical graph. Each scene has one vector set respectively.
 *
 * Explore1D has one shared sum visibility properties for both scenes.
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
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants
  const DEFAULT_VECTOR_ORIENTATION = GraphOrientations.HORIZONTAL;
  const DEFAULT_GRAPH_BOUNDS = VectorAdditionConstants.DEFAULT_GRAPH_BOUNDS;
  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;

  const EXPLORE_1D_GRAPH_BOUNDS = new Bounds2( -DEFAULT_GRAPH_BOUNDS.width / 2,
    -DEFAULT_GRAPH_BOUNDS.height / 2,
    DEFAULT_GRAPH_BOUNDS.width / 2,
    DEFAULT_GRAPH_BOUNDS.height / 2 );


  class Explore1DModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      //----------------------------------------------------------------------------------------
      // Create the shared sum visibility property for both scenes


      super( tandem );

      //----------------------------------------------------------------------------------------
      // Create a reference
      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );

      // @public {EnumerationProperty.<GraphOrientations>} - controls the orientation of the vectors
      this.graphOrientationProperty = new EnumerationProperty( GraphOrientations, DEFAULT_VECTOR_ORIENTATION );

      // @public (read-only) {VectorGroups} VectorGroups - the only vector group used on the explore1D screen
      this.vectorGroup = VectorGroups.ONE;

      //----------------------------------------------------------------------------------------
      // Create and add the graphs

      // @public (read-only) {Graph}
      this.verticalGraph = new Graph( EXPLORE_1D_GRAPH_BOUNDS, CoordinateSnapModes.CARTESIAN, GraphOrientations.VERTICAL );

      // @public (read-only) {Graph}
      this.horizontalGraph = new Graph( EXPLORE_1D_GRAPH_BOUNDS, CoordinateSnapModes.CARTESIAN, GraphOrientations.HORIZONTAL );


      //----------------------------------------------------------------------------------------
      // Create the vector sets. Each graph has one vector set

      // @public (read-only) {VectorSet}
      this.verticalVectorSet = this.verticalGraph.createVectorSet( this.componentStyleProperty,
        this.sumVisibleProperty,
        this.vectorGroup );

      // @public (read-only) {VectorSet}
      this.horizontalVectorSet = this.horizontalGraph.createVectorSet( this.componentStyleProperty,
        this.sumVisibleProperty,
        this.vectorGroup );

      this.horizontalGraph.vectorSets.push( this.horizontalVectorSet );
      this.verticalGraph.vectorSets.push( this.verticalVectorSet );


      //----------------------------------------------------------------------------------------
      // Disable unused properties

      this.angleVisibleProperty.link( angleVisible => {
        if ( angleVisible ) {
          assert && assert( false, 'Angles are not used in explore1D' );
        }
      } );

      // Disable polar / cartesian mode. Doesn't need to be unlinked as explore 1D screen is never disposed
      this.coordinateSnapModeProperty.link( coordinateSnapMode => {
        if ( coordinateSnapMode !== CoordinateSnapModes.CARTESIAN ) {
          assert && assert( false, 'Explore1D only uses cartesian' );
        }
      } );
    }

    /**
     * @override
     * Resets the Explore1D model
     * @public
     */
    reset() {
      this.graphOrientationProperty.reset();

      this.horizontalGraph.reset();
      this.verticalGraph.reset();
      this.sumVisibleProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );