// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Vector that is dragged onto the graph.
 *
 * This extends BaseVector and adds dragging features as well as updating the tail
 * when the origin is moved. 
 *
 * This vector also instantiates the XVectorComponent and YVectorComponent models.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const XVectorComponent = require( 'VECTOR_ADDITION/common/model/XVectorComponent' );
  const YVectorComponent = require( 'VECTOR_ADDITION/common/model/YVectorComponent' );
  // constants

  // interval spacing of vector angle (in degrees) when vector is in polar mode
  const ANGLE_INTERVAL = 5;

  class VectorModel extends BaseVectorModel {
    /**
     * Create a vector model
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xMagnitude horizontal component of the vector
     * @param {number} yMagnitude vertical component of the vector
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStylesProperty
     * @param {VectorTypes} vectorType - see VectorTypes.js for documentation
     * @param {Object} [options]
     */
    constructor( 
      tailPosition, 
      xMagnitude, 
      yMagnitude, 
      modelViewTransformProperty, 
      componentStylesProperty,
      vectorType, 
      options ) {

      options = _.extend( {

        label: 'v',

        // {boolean} - can the tip be dragged
        isTipDraggable: true
      }, options );

      super( tailPosition, xMagnitude, yMagnitude, options.label );
     
      //----------------------------------------------------------------------------------------

      // Type check arguments (some are type checked in the base vector model)
      assert && assert( modelViewTransformProperty instanceof DerivedProperty
        && modelViewTransformProperty.value instanceof ModelViewTransform2, 
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( vectorType instanceof VectorTypes, `invalid vectorType: ${vectorType}` );
      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid isTipDraggable: ${options.isTipDraggable}` );
      // component styles property is checked in VectorComponent
      
      //----------------------------------------------------------------------------------------

      // @public (read-only) {boolean}
      this.isTipDraggable = options.isTipDraggable;

      // @public {Boolean property}
      // Flag that indicates if the model element is in the play area
      this.isInPlayAreaProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates whether the tip being dragged by the user
      this.isTipDraggingProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates whether the body is being dragged by the user
      this.isBodyDraggingProperty = new BooleanProperty( false );

      // @public {DerivedProperty.<boolean>} - is any part of the vector being dragged
      this.isDraggingProperty = new DerivedProperty( [ this.isBodyDraggingProperty, this.isTipDraggingProperty ],
        ( isBodyDragging, isTipDragging ) => ( isBodyDragging || isTipDragging )
      );

      //----------------------------------------------------------------------------------------

      // update the position of the tail of the vector
      const updateTailPosition = ( newModelViewTransform, oldModelViewTransform ) => {
        const oldTailViewPosition = oldModelViewTransform.modelToViewPosition( this.tailPositionProperty.value );
        this.tailPositionProperty.set( newModelViewTransform.viewToModelPosition( oldTailViewPosition ) );
      };
      modelViewTransformProperty.lazyLink( updateTailPosition );

      // @private - unlink the modelViewTransform link
      this.unlinkTailUpdate = () => {
        modelViewTransformProperty.unlink( updateTailPosition );
      };

      //----------------------------------------------------------------------------------------

      // @public (read only) {XVectorComponent}
      this.xVectorComponent = new XVectorComponent( this, componentStylesProperty, this.label );

      // @public (read only) {YVectorComponent}
      this.yVectorComponent = new YVectorComponent( this, componentStylesProperty, this.label );
    }

    /**
     * @public
     * Dispose the vector model's properties. Called when the vector is removed from the graph.
     */
    dispose() {

      // dispose properties
      this.isDraggingProperty.dispose();
      this.isBodyDraggingProperty.dispose();
      this.isTipDraggingProperty.dispose();
      this.isDraggingProperty.dispose();
      this.isInPlayAreaProperty.dispose();

      this.unlinkTailUpdate();

      this.xVectorComponent.dispose();
      this.yVectorComponent.dispose();

      super.dispose();
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

  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );