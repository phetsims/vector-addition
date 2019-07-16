// Copyright 2019, University of Colorado Boulder

/**
 * View-specific Properties for the Explore1D.
 *
 * Responsibilities are:
 *  - Graph Orientation Property
 *  - Disable coordinateSnapModeProperty and angle visible Property
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  // constants
  const DEFAULT_VECTOR_ORIENTATION = GraphOrientations.HORIZONTAL;


  class Explore1DViewProperties extends VectorAdditionViewProperties {

    constructor() {

      super();

      // @public {EnumerationProperty.<GraphOrientations>} - controls the orientation of the vectors
      this.graphOrientationProperty = new EnumerationProperty( GraphOrientations, DEFAULT_VECTOR_ORIENTATION );

      //----------------------------------------------------------------------------------------
      // Disable unused Properties

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
     * Resets the view properties
     * @public
     * @override
     */
    reset() {
      this.graphOrientationProperty.reset();
      super.reset();
    }
  }

  return vectorAddition.register( 'Explore1DViewProperties', Explore1DViewProperties );
} );