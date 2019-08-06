// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for an overview of how BaseVectors fit into the class
 * hierarchy.
 *
 * Extends Vector and adds the following functionality:
 *  - Creates number Properties for the x and y component that go into a number picker on cartesian
 *  - Creates number Properties for the angle and the magnitude that go into a number picker on polar
 *  - Adjusts its components based on the properties listed above
 *  - Disables tip dragging and removing of vectors
 *
 * Base vectors are created at the start of the sim, and are never disposed. They require a symbol.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Util = require( 'DOT/Util' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const VECTOR_OPTIONS = {
    isRemovable: false,       // Base Vectors are not removable
    isTipDraggable: false,    // Base Vectors are not draggable by the tip
    isOnequationGraphInitially: true  // Base Vectors are always on the equationGraph
  };

  class BaseVector extends Vector {

    /**
     * @param {Vector2} initialTailPosition - starting tail position of the Base Vector
     * @param {Vector2} initialComponents - starting components of the Base Vector
     * @param {EquationGraph} equationGraph - the equation graph the Base Vector belongs to
     * @param {EquationVectorSet} equationVectorSet - the set that the Base Vector belongs to
     * @param {string|null} symbol - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition, initialComponents, equationGraph, equationVectorSet, symbol ) {

      super( initialTailPosition, initialComponents, equationGraph, equationVectorSet, symbol, VECTOR_OPTIONS );

      //----------------------------------------------------------------------------------------
      // Create number Properties for the base vector panel

      if ( equationGraph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

        //========================================================================================
        // Create number Properties for the x and y component that go into a number picker on CARTESIAN
        //========================================================================================

        // @public (read-only) {NumberProperty} xComponentProperty - create a Property to toggle the x component
        this.xComponentProperty = new NumberProperty( this.xComponent );

        // @public (read-only) {NumberProperty} yComponentProperty - create a Property to toggle the y component
        this.yComponentProperty = new NumberProperty( this.yComponent );

        //----------------------------------------------------------------------------------------
        // Observe when the component NumberProperties change and update the components to match
        // Don't need to be unlinked since base vectors exist for the entire sim

        this.xComponentProperty.link( xComponent => { this.xComponent = xComponent; } );

        this.yComponentProperty.link( yComponent => { this.yComponent = yComponent; } );

      }
      else if ( equationGraph.coordinateSnapMode === CoordinateSnapModes.POLAR ) {

        //========================================================================================
        // Create number Properties for the angle and the magnitude that go into a number picker on polar
        //========================================================================================

        // @public (read-only) {NumberProperty} angleProperty - create a Property to toggle the angle
        this.angleDegreesProperty = new NumberProperty( Util.toDegrees( this.angle ) );

        // @public (read-only) {NumberProperty} yComponentProperty - create a Property toggle the magnitude
        this.magnitudeProperty = new NumberProperty( this.magnitude );

        //----------------------------------------------------------------------------------------
        // Observe when the angleProperty and the magnitudeProperty change and update the components to match
        // Don't need to be unlinked since base vectors exist for the entire sim

        this.angleDegreesProperty && this.angleDegreesProperty.link( angleDegrees => {
          this.vectorComponents = Vector2.createPolar( this.magnitude, Util.toRadians( angleDegrees ) );
        } );

        this.magnitudeProperty && this.magnitudeProperty.link( magnitude => {
          this.vectorComponents = this.vectorComponents.withMagnitude( magnitude );
        } );

      }
    }

    /**
     * Resets the base vector. Called when the reset all button is clicked.
     * @public
     */
    reset() {
      this.tailPositionProperty.reset();
      this.angleDegreesProperty && this.angleDegreesProperty.reset();
      this.magnitudeProperty && this.magnitudeProperty.reset();
      this.yComponentProperty && this.yComponentProperty.reset();
      this.xComponentProperty && this.xComponentProperty.reset();
    }
  }

  return vectorAddition.register( 'BaseVector', BaseVector );
} );