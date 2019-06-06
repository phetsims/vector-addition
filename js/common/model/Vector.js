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
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {Object} [options]
     */
    constructor( x, y, modelViewTransformProperty, options ) {

      options = _.extend( {
        vectorType: VECTOR_TYPE.RED,

        // {string} - label of the vector
        label: ''
      }, options );

      this.label = options.label;

      // @public {Vector2Property} - The tail position of the vector.
      this.tailPositionProperty = new Vector2Property( new Vector2( 0, 0 ) );

      // @public {Vector2Property} - The actual vector
      this.attributesVectorProperty = new Vector2Property( new Vector2( x, y ) );


      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector )
      );


      // @public {numberProperty} - the scalar by which the base vector can be multiplied
      // the scalar value can be negative
      this.multiplicativeScalarProperty = new NumberProperty( 1 );

      // @public {DerivedProperty.<Boolean>}
      // Flag that indicates if the model element is in the play area
      this.isInPlayAreaProperty = new BooleanProperty( false );


      // @public {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( attributesVector.getMagnitude() )
      );

      // @public {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( Util.toDegrees( attributesVector.getAngle() ) )
      );

      // @public {DerivedProperty.<number>} - the horizontal component of the vector
      this.xProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( attributesVector.x )
      );

      // @public {DerivedProperty.<number>} - the vertical component of the vector
      this.yProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( attributesVector.y )
      );
     // @public {BooleanProperty} - indicates whether the tip being dragged by the user
      this.isTipDraggingProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates whether the body is being dragged by the user
      this.isBodyDraggingProperty = new BooleanProperty( false );

      // @public {DerivedProperty.<boolean>} - is any part of the vector being dragged
      this.isDraggingProperty = new DerivedProperty( [ this.isBodyDraggingProperty, this.isTipDraggingProperty ],
        ( isBodyDragging, isTipDragging ) => ( isBodyDragging || isTipDragging )
      );
      
      modelViewTransformProperty.lazyLink( ( newModelViewTransform, oldModelViewTransform ) => {
        const oldTailViewPosition = oldModelViewTransform.modelToViewPosition( this.tailPositionProperty.value );
        this.tailPositionProperty.set( newModelViewTransform.viewToModelPosition( oldTailViewPosition ) );
      } );
    }

    // @public resets the vector
    reset() {
      this.tailPositionProperty.reset();
      this.attributesVectorProperty.reset();
      this.multiplicativeScalarProperty.reset();
      this.isActiveProperty.reset();
      this.isTipDraggingProperty.reset();
      this.isBodyDraggingProperty.reset();
    }

    //@public
    roundCartesianForm() {
      this.attributesVectorProperty.set( this.attributesVectorProperty.value.roundSymmetric() );
    }

    /**
     * round vector to have integer values in polar form, i.e.
     * magnitude has inetger values and angle is a multiple of ANGLE_INTERVAL
     * @public
     */
    roundPolarForm() {
      const roundedMagnitude = Util.roundSymmetric( this.magnitudeProperty.value );
      const roundedAngle = ANGLE_INTERVAL * Util.roundSymmetric( this.angleProperty.value / ANGLE_INTERVAL );
      this.attributesVectorProperty.setPolar( roundedMagnitude, Util.toRadians( roundedAngle ) );
    }

  }

  return vectorAddition.register( 'Vector', Vector );
} );