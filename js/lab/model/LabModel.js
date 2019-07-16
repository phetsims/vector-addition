// Copyright 2019, University of Colorado Boulder

/**
 * Model for the `Lab` screen.
 *
 * Lab has a polar and a cartesian graph. Each scene has two vector sets respectively.
 *
 * Lab has four visibility Properties: two for each scene respectively.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  // constants

  class LabModel extends VectorAdditionModel {
    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem );


      //----------------------------------------------------------------------------------------
      // Create and add the graphs.

      // @public (read-only) {Graph}
      this.cartesianGraph = new LabGraph( CoordinateSnapModes.CARTESIAN, this.componentStyleProperty, VectorGroups.ONE, VectorGroups.TWO );

      // @public (read-only) {Graph}
      this.polarGraph = new LabGraph( CoordinateSnapModes.POLAR, this.componentStyleProperty, VectorGroups.THREE, VectorGroups.FOUR );
    }


    reset() {
      this.cartesianGraph.reset();
      this.polarGraph.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'LabModel', LabModel );
} );