// Copyright 2019, University of Colorado Boulder

/**
 * See https://github.com/phetsims/vector-addition/issues/63 for context.
 *
 * Extends Vector and adds the following functionality:
 *  - Creates selector properties for the x and y component that go into a number picker on cartesian
 *  - Creates selector properties for the angle and the magnitude that go into a number picker on polar
 *  - Adjust its components based on the properties above
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
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Util = require( 'DOT/Util' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  
  // constants
  const VECTOR_OPTIONS = {
    isRemovable: false, // base vectors are not removable
    isTipDraggable: false, // base vectors are not draggable by the tip
    isOnGraphInitially: true // base vectors are always on the graph
  };

  // ranges
  const COMPONENT_RANGE = new Range( -10, 10 );
  const ANGLE_RANGE = new Range( -180, 180 );
  const MAGNITUDE_RANGE = new Range( -10, 10 );


  class BaseVector extends Vector {
    /**
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Vector2} initialComponents - starting components of the vector
     * @param {EquationGraph} graph - the equation graph the vector belongs to
     * @param {EquationVectorSet} vectorSet - the equationVectorSet that the vector belongs to
     * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition, initialComponents, graph, vectorSet, symbol ) {

      super( initialTailPosition, initialComponents, graph, vectorSet, symbol, VECTOR_OPTIONS );


      //----------------------------------------------------------------------------------------
      // Create properties for the base vector panel

      if ( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {

        // Creates selector properties for the x and y component that go into a number picker on cartesian

        // @public (read-only) {NumberProperty} xComponentProperty - create a property to represent the component
        this.xComponentProperty = new NumberProperty( this.xComponent );

        // @public (read-only) {NumberProperty} yComponentProperty - create a property to represent the component
        this.yComponentProperty = new NumberProperty( this.yComponent );

        //----------------------------------------------------------------------------------------
        // Create range properties
        
        // @public (read-only) {Property.<Range>} componentRangeProperty - property of the range of both components
        this.componentRangeProperty = new Property( COMPONENT_RANGE );

      }
      else if ( graph.coordinateSnapMode === CoordinateSnapModes.POLAR ) {

        // Creates selector properties for the angle and the magnitude that go into a number picker on polar

        // @public (read-only) {NumberProperty} angleProperty - create a property to represent the angle of the vector
        this.angleDegreesProperty = new NumberProperty( Util.toDegrees( this.angle ) );

        // @public (read-only) {NumberProperty} yComponentProperty - create a property to represent the magnitude
        this.magnitudeProperty = new NumberProperty( this.magnitude );

        //----------------------------------------------------------------------------------------
        // Create range properties

        // @public (read-only) {Property.<Range>} angleRangeProperty - property of the range of the angle (polar mode)
        this.angleRangeProperty = new Property( ANGLE_RANGE );

        // @public (read-only) {Property.<Range>} magnitudeRangeProperty - property of the range of the magnitude
        this.magnitudeRangeProperty = new Property( MAGNITUDE_RANGE );
      }

      //----------------------------------------------------------------------------------------
      // Link the base vector panel properties and update the components
      // Don't need to be unlinked since base vectors exist for the entire sim

      this.xComponentProperty && this.xComponentProperty.link( xComponent => {
        this.xComponent = xComponent;
      } );

      this.yComponentProperty && this.yComponentProperty.link( yComponent => {
        this.yComponent = yComponent;
      } );

      this.angleDegreesProperty && this.angleDegreesProperty.link( angleDegrees => {
        this.vectorComponents = Vector2.createPolar( this.magnitude, Util.toRadians( angleDegrees ) );
      } );

      this.magnitudeProperty && this.magnitudeProperty.link( magnitude => {
        this.vectorComponents = this.vectorComponents.withMagnitude( magnitude );
      } );

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