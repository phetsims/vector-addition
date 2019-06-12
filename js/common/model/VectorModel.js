// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const VECTOR_TYPE = new Enumeration( [ 'RED', 'BLUE' ] );
  const ANGLE_INTERVAL = 5; // interval spacing of vector angle (in degrees) when vector is in polar mode

  class VectorModel {

    /**
     * Create a vector model
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} x horizontal component of the vector
     * @param {number} y horizontal component of the vector
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {Object} [options]
     */
    constructor( tailPosition, x, y, modelViewTransformProperty, options ) {

      options = _.extend( {
        vectorType: VECTOR_TYPE.RED,

        // {string} - label of the vector
        label: 'v',

        // {boolean} - can the tip be dragged
        isTipDraggable: true
      }, options );

      // @public (read-only) {string}
      this.label = options.label;

      // @public (read-only) {boolean}
      this.isTipDraggable = options.isTipDraggable;

      // @public {Vector2Property} - The tail position of the vector.
      this.tailPositionProperty = new Vector2Property( tailPosition );

      // @public {Vector2Property} - The actual vector
      this.attributesVectorProperty = new Vector2Property( new Vector2( x, y ) );

      // @public {DerivedProperty.<boolean>}
      // Flag that indicates if the model element is in the play area
      this.isInPlayAreaProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates whether the tip being dragged by the user
      this.isTipDraggingProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates whether the body is being dragged by the user
      this.isBodyDraggingProperty = new BooleanProperty( false );

      //--------------------------
      // Derived Properties
      //--------------------------

      // @public {DerivedProperty.<Vector2>} - the tip position of the vector
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector )
      );

      // @public {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( attributesVector.getMagnitude() )
      );

      // @public {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleDegreesProperty = new DerivedProperty( [ this.attributesVectorProperty ],
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

      // @public {DerivedProperty.<boolean>} - is any part of the vector being dragged
      this.isDraggingProperty = new DerivedProperty( [ this.isBodyDraggingProperty, this.isTipDraggingProperty ],
        ( isBodyDragging, isTipDragging ) => ( isBodyDragging || isTipDragging )
      );

      //---------------------

      // update the position of the tail of the vector
      modelViewTransformProperty.lazyLink( ( newModelViewTransform, oldModelViewTransform ) => {
        const oldTailViewPosition = oldModelViewTransform.modelToViewPosition( this.tailPositionProperty.value );
        this.tailPositionProperty.set( newModelViewTransform.viewToModelPosition( oldTailViewPosition ) );
      } );
    }

    // @public resets the vector
    reset() {
      this.tailPositionProperty.reset();
      this.attributesVectorProperty.reset();
      this.isTipDraggingProperty.reset();
      this.isBodyDraggingProperty.reset();
      this.isInPlayAreaProperty.reset();
    }

    /**
     * round vector to have integer values in cartesian form
     * @public
     */
    roundCartesianForm() {
      this.attributesVectorProperty.set( this.attributesVectorProperty.value.roundSymmetric() );
    }


    /**
     * round vector to have integer values in polar form, i.e.
     * magnitude has integer values and angle is a multiple of ANGLE_INTERVAL
     * @public
     */
    roundPolarForm() {
      const roundedMagnitude = Util.roundSymmetric( this.magnitudeProperty.value );
      const roundedAngle = ANGLE_INTERVAL * Util.roundSymmetric( this.angleDegreesProperty.value / ANGLE_INTERVAL );
      this.attributesVectorProperty.setPolar( roundedMagnitude, Util.toRadians( roundedAngle ) );
    }

    /**
     * Get the X component tail/tip position based on a component style
     * @param {Enumeration} componentStyle
     * @public
     * @returns {{tail: Vector2},{tip: Vector2}}
     */
    getXComponentCoordinates( componentStyle ) {

      // convenience variables for the tail and tip positions
      const tailPosition = this.tailPositionProperty.value;
      const tipPosition = this.tipPositionProperty.value;

      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {
          return {
            tail: tailPosition,
            tip: new Vector2( tipPosition.x, tailPosition.y )
          };
        }
        case ComponentStyles.PARALLELOGRAM: {
          return {
            tail: tailPosition,
            tip: new Vector2( tipPosition.x, tailPosition.y )
          };
        }
        case ComponentStyles.ON_AXIS: {
          return {
            tail: new Vector2( tailPosition.x, 0 ),
            tip: new Vector2( tipPosition.x, 0 )
          };
        }
        default: {
          throw new Error( 'invalid componentStyle: ' + componentStyle );
        }
      }
    }

    /**
     * Get the X component tail/tip position based on a component style
     * @param {Enumeration} componentStyle
     * @public
     * @returns {{tail: <Vector2>},{tip: <Vector2>}}
     */
    getYComponentCoordinates( componentStyle ) {

      // convenience variables for the tail and tip positions
      const tailPosition = this.tailPositionProperty.value;
      const tipPosition = this.tipPositionProperty.value;

      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {
          return {
            tail: new Vector2( tipPosition.x, tailPosition.y ),
            tip: tipPosition
          };
        }
        case ComponentStyles.PARALLELOGRAM: {
          return {
            tail: tailPosition,
            tip: new Vector2( tailPosition.x, tipPosition.y )
          };
        }
        case ComponentStyles.ON_AXIS: {
          return {
            tail: new Vector2( 0, tailPosition.y ),
            tip: new Vector2( 0, tipPosition.y )
          };
        }
        default: {
          throw new Error( 'invalid componentStyle: ' + componentStyle );
        }
      }
    }

  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );