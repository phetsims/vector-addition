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
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const Explore1DGraph = require( 'VECTOR_ADDITION/explore1D/model/Explore1DGraph' );

  // constants
  const DEFAULT_VECTOR_ORIENTATION = GraphOrientations.HORIZONTAL;
  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;


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
      this.verticalGraph = new Explore1DGraph( GraphOrientations.VERTICAL, this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup );

      // @public (read-only) {Graph}
      this.horizontalGraph = new Explore1DGraph( GraphOrientations.HORIZONTAL, this.componentStyleProperty, this.sumVisibleProperty, this.vectorGroup );

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