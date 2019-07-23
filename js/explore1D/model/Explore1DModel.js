// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Explore1D` screen.
 *
 * Explore1D has a horizontal and a vertical graph. Each scene has one vector set respectively.
 *
 * Explore1D has one shared sum visibility Properties for both scenes.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Explore1DGraph = require( 'VECTOR_ADDITION/explore1D/model/Explore1DGraph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  // constants
  const DEFAULT_SUM_VISIBLE = VectorAdditionConstants.DEFAULT_SUM_VISIBLE;


  class Explore1DModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      //----------------------------------------------------------------------------------------
      // Create the shared sum visibility Property for both scenes


      super( tandem );

      //----------------------------------------------------------------------------------------
      // Create a reference
      // @public (read-only) {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = new BooleanProperty( DEFAULT_SUM_VISIBLE );


      // @public (read-only) {VectorColorGroups} VectorColorGroups - the only vector color group used on the explore1D screen
      this.vectorColorGroup = VectorColorGroups.BLUE_COLOR_GROUP;

      //----------------------------------------------------------------------------------------
      // Create and add the graphs

      // @public (read-only) {Graph}
      this.verticalGraph = new Explore1DGraph( GraphOrientations.VERTICAL,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        this.vectorColorGroup );

      // @public (read-only) {Graph}
      this.horizontalGraph = new Explore1DGraph( GraphOrientations.HORIZONTAL,
        this.componentStyleProperty,
        this.sumVisibleProperty,
        this.vectorColorGroup );

    }

    /**
     * @override
     * Resets the Explore1D model
     * @public
     */
    reset() {

      this.horizontalGraph.reset();
      this.verticalGraph.reset();
      this.sumVisibleProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore1DModel', Explore1DModel );
} );