// Copyright 2019, University of Colorado Boulder

/**
 * PolarBaseVector is the subclass of BaseVector used with CoordinateSnapModes.POLAR.
 * It creates NumberProperties for the angle and magnitude that are controlled by NumberPickers, and
 * adjusts its x and y components based on the values of those Properties.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const BaseVector = require( 'VECTOR_ADDITION/equation/model/BaseVector' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class PolarBaseVector extends BaseVector {

    /**
     * @param {Vector2} initialTailPosition - starting tail position of the Base Vector
     * @param {Vector2} initialComponents - starting components of the Base Vector
     * @param {EquationGraph} equationGraph - the equation graph the Base Vector belongs to
     * @param {EquationVectorSet} equationVectorSet - the set that the Base Vector belongs to
     * @param {string|null} symbol - the symbol for the Base Vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition, initialComponents, equationGraph, equationVectorSet, symbol ) {
      assert && assert( equationGraph.coordinateSnapMode === CoordinateSnapModes.POLAR,
        `invalid coordinateSnapMode: ${equationGraph.coordinateSnapMode}` );

      super( initialTailPosition, initialComponents, equationGraph, equationVectorSet, symbol );

      // @public (read-only) Property to set the magnitude
      this.magnitudeProperty = new NumberProperty( this.magnitude );

      // @public (read-only) Property to set the angle
      this.angleDegreesProperty = new NumberProperty( Util.toDegrees( this.angle ) );

      // Observe when the angle or magnitude changes, and update the components to match.
      // Multilink doesn't need to be disposed since base vectors exist for the lifetime of the sim.
      Property.multilink(
        [ this.magnitudeProperty, this.angleDegreesProperty ],
        ( magnitude, angleDegrees ) => {
          this.vectorComponents = Vector2.createPolar( magnitude, Util.toRadians( angleDegrees ) );
        } );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.magnitudeProperty.reset();
      this.angleDegreesProperty.reset();
    }
  }

  return vectorAddition.register( 'PolarBaseVector', PolarBaseVector );
} );