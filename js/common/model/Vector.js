// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const VECTOR_TYPE = new Enumeration( [ 'RED', 'BLUE' ] );

  /**
   * @constructor
   */
  class Vector {

    /**
     * @param {Vector2Property} tailPositionProperty
     * @param {Vector2Property} vectorProperty
     * @param {BooleanProperty} isActiveProperty
     * @param {numberProperty} multiplicativeScalarProperty
     * @param {Object} [options]
     */
    constructor( tailPositionProperty, vectorProperty, isActiveProperty, multiplicativeScalarProperty, options ) {

      options = _.extend( {
        vectorType: VECTOR_TYPE.RED
      }, options );

      // @public {Vector2Property} - The tail position of the vector.
      this.tailPositionProperty = tailPositionProperty;

      // @public {Vector2Property} - The actual vector
      this.vectorProperty = vectorProperty;

      // @public {numberProperty} - the scalar by which the base vector can be multiplied
      // the scalar value can be negative
      this.multiplicativeScalarProperty = multiplicativeScalarProperty;

      // @public {DerivedProperty.<Boolean>}
      // Flag that indicates if the model element is in the play area
      this.isActiveProperty = new BooleanProperty( false );

      // @public {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleProperty = new DerivedProperty( [ vectorProperty ],
        vector => ( Util.toDegrees( vector.getAngle() ) )
      );

      // @public {DerivedProperty.<number>} - the magnitude of the vector
      this.yProperty = new DerivedProperty( [ vectorProperty ],
        vector => ( vector.y )
      );

      // @public {DerivedProperty.<number>} - the magnitude of the vector
      this.xProperty = new DerivedProperty( [ vectorProperty ],
        vector => ( vector.x )
      );

      // @public {DerivedProperty.<Boolean>}
      // Flag that indicates if the model element is in the play area
      // this.isInPlayAreaProperty = new DerivedProperty( [ tailPositionProperty ],
      //   tailPosition => GRAPH_MODEL_BOUNDS.contains( tailPosition )
      // );

    }
  }

  return vectorAddition.register( 'Vector', Vector );
} );