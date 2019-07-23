// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Explore2D` screen.
 *
 * Explore2D has a polar and a cartesian graph. Each scene has one vector set respectively.
 *
 * Explore2D has two visibility Properties: one for each scene respectively.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Explore2DGraph = require( 'VECTOR_ADDITION/explore2D/model/Explore2DGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  // constants
  const CARTESIAN_VECTOR_GROUP = VectorColorGroups.BLUE_COLOR_GROUP;
  const POLAR_VECTOR_GROUP = VectorColorGroups.PURPLE_COLOR_GROUP;

  class Explore2DModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );

      //----------------------------------------------------------------------------------------
      // Create and add the graphs

      // @public (read-only) {Graph}
      this.polarGraph = new Explore2DGraph( CoordinateSnapModes.POLAR,
        this.componentStyleProperty,
        POLAR_VECTOR_GROUP );

      // @public (read-only) {Graph}
      this.cartesianGraph = new Explore2DGraph( CoordinateSnapModes.CARTESIAN,
        this.componentStyleProperty,
        CARTESIAN_VECTOR_GROUP );
    }

    reset() {
      this.polarGraph.reset();
      this.cartesianGraph.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore2DModel', Explore2DModel );
} );