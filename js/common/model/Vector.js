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
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const VECTOR_TYPE = new Enumeration( [ 'RED', 'BLUE' ] );
  const ANGLE_INTERVAL = 5; // interval spacing of vector angle (in degrees) when vector is in polar mode

  /**
   * @constructor
   */
  class Vector {

    /**
     * @param {number} x horizontal component of the vector
     * @param {number} y horizontal component of the vector
     * @param {Object} [options]
     */
    constructor( x, y, options ) {

      options = _.extend( {
        vectorType: VECTOR_TYPE.RED,

        // {string} - label of the vector
        label: ''
      }, options );

      this.label = options.label;

      // @public {Vector2Property} - The tail position of the vector.
      this.tailPositionProperty = new Vector2Property( new Vector2( 0, 0 ) );

      // @public {Vector2Property} - The actual vector
      this.vectorProperty = new Vector2Property( new Vector2( x, y ) );

      // @public {numberProperty} - the scalar by which the base vector can be multiplied
      // the scalar value can be negative
      this.multiplicativeScalarProperty = new NumberProperty( 1 );

      // @public {DerivedProperty.<Boolean>}
      // Flag that indicates if the model element is in the play area
      this.isActiveProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates whether the tip being dragged by the user
      this.isTipDraggingProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates whether the body is being dragged by the user
      this.isBodyDraggingProperty = new BooleanProperty( false );

      // @public {DerivedProperty.<boolean>} - is any part of the vector being dragged
      this.isDraggingProperty = new DerivedProperty( [ this.isBodyDraggingProperty, this.isTipDraggingProperty ],
        ( isBodyDragging, isTipDragging ) => ( isBodyDragging || isTipDragging )
      );

      // @public {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.vectorProperty ],
        vector => ( vector.getMagnitude() )
      );

      // @public {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleProperty = new DerivedProperty( [ this.vectorProperty ],
        vector => ( Util.toDegrees( vector.getAngle() ) )
      );

      // @public {DerivedProperty.<number>} - the horizontal component of the vector
      this.xProperty = new DerivedProperty( [ this.vectorProperty ],
        vector => ( vector.x )
      );

      // @public {DerivedProperty.<number>} - the vertical component of the vector
      this.yProperty = new DerivedProperty( [ this.vectorProperty ],
        vector => ( vector.y )
      );


      //@public {DerivedProperty.<Boolean>}
      // Flag that indicates if the model element is in the play area
      // this.isInPlayAreaProperty = new DerivedProperty( [ tailPositionProperty ],
      //   tailPosition => GRAPH_MODEL_BOUNDS.contains( tailPosition )
      // );
    }

    // @public resets the vector
    reset() {
      this.tailPositionProperty.reset();
      this.vectorProperty.reset();
      this.multiplicativeScalarProperty.reset();
      this.isActiveProperty.reset();
      this.isTipDraggingProperty.reset();
      this.isBodyDraggingProperty.reset();
    }

    //@public
    roundCartesianForm() {
      this.vectorProperty.set( this.vectorProperty.value.roundSymmetric() );
    }

    /**
     * round vector to have integer values in polar form, i.e.
     * magnitude has inetger values and angle is a multiple of ANGLE_INTERVAL
     * @public
     */
    roundPolarForm() {
      const roundedMagnitude = Util.roundSymmetric( this.magnitudeProperty.value );
      const roundedAngle = ANGLE_INTERVAL * Util.roundSymmetric( this.angleProperty.value / ANGLE_INTERVAL );
      this.vectorProperty.setPolar( roundedMagnitude, Util.toRadians( roundedAngle ) );
    }

  }

  return vectorAddition.register( 'Vector', Vector );
} );