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

  // constants

  // default graph orientation
  const DEFAULT_VECTOR_ORIENTATION = GraphOrientations.HORIZONTAL;


  class Explore1DViewProperties extends VectorAdditionViewProperties {

    /**
     * @extends {VectorAdditionViewProperties}
     */
    constructor() {

      super();

      // @public {EnumerationProperty.<GraphOrientations>} - Property that controls the Graph Orientation
      this.graphOrientationProperty = new EnumerationProperty( GraphOrientations, DEFAULT_VECTOR_ORIENTATION );

      //----------------------------------------------------------------------------------------
      // Disable unused Properties. Links don't need to be unlinked since the Explore 1D screen is never disposed.

      this.angleVisibleProperty.link( angleVisible => {
        if ( angleVisible ) { assert && assert( false, 'Angles are not used in Explore 1D' ); }
      } );

      // Disable polar / cartesian mode.
      this.coordinateSnapModeProperty.link( coordinateSnapMode => {
        if ( coordinateSnapMode !== CoordinateSnapModes.CARTESIAN ) {
          assert && assert( false, 'Explore 1D only uses cartesian' );
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