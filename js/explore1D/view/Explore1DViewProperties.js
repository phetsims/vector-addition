// Copyright 2019, University of Colorado Boulder

/**
 * View-specific Properties for the 'Explore 1D' screen.
 *
 * Extends VectorAdditionViewProperty but adds:
 *  - Graph Orientation Property
 *  - Disables coordinateSnapModeProperty and angle visible Property
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

  class Explore1DViewProperties extends VectorAdditionViewProperties {

    constructor() {

      super();

      // @public {EnumerationProperty.<GraphOrientations>} - Property that controls the Graph Orientation
      this.graphOrientationProperty = new EnumerationProperty( GraphOrientations, GraphOrientations.HORIZONTAL );

      //----------------------------------------------------------------------------------------
      // Disable unused Properties. Links don't need to be unlinked since the Explore 1D screen is never disposed.

      assert && this.anglesVisibleProperty.link( angleVisible => {
        if ( angleVisible ) {
          throw new Error( 'Angles are not supported in Explore 1D' );
        }
      } );

      // Disable polar/Cartesian mode.
      assert && this.coordinateSnapModeProperty.link( coordinateSnapMode => {
        if ( coordinateSnapMode !== CoordinateSnapModes.CARTESIAN ) {
          throw new Error( 'Explore 1D only uses Cartesian' );
        }
      } );
    }

    /**
     * Resets the view Properties.
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.graphOrientationProperty.reset();
    }
  }

  return vectorAddition.register( 'Explore1DViewProperties', Explore1DViewProperties );
} );