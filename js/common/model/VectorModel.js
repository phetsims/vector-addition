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
     * @param {number} xComponent horizontal component of the vector
     * @param {number} yComponent vertical component of the vector
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorTypes} vectorType - see VectorTypes.js for documentation
     * @param {Object} [options]
     */
    constructor(
      tailPosition,
      xComponent,
      yComponent,
      modelViewTransformProperty,
      componentStyleProperty,
      vectorType,
      options ) {

      options = _.extend( {
        label: 'v',// {string} - the label of the vector
        isTipDraggable: true // {boolean} - can the tip be dragged
      }, options );

      //----------------------------------------------------------------------------------------

      // Type check arguments
      assert && assert( modelViewTransformProperty instanceof DerivedProperty
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid isTipDraggable: ${options.isTipDraggable}` );
      assert && assert( typeof options.label === 'string', `invalid options.label: ${options.label}` );

      //----------------------------------------------------------------------------------------

      super( tailPosition, xComponent, yComponent, vectorType );

      // @public (read-only) {boolean}
      this.isTipDraggable = options.isTipDraggable;

      // @public (read-only)
      this.label = options.label;

      // @public {BooleanProperty} - indicates if the vector is active. An active vector is a vector that is being
      // dragged by the body or the tip.
      this.isActiveProperty = new BooleanProperty( false );

      //----------------------------------------------------------------------------------------
      // Properties for the inspectPanel

      // @public (read-only) {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( this.magnitude )
      );

      // @public (read-only) {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleDegreesProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( Util.toDegrees( this.angle ) )
      );

      // @public (read-only) {DerivedProperty.<number>} - the xComponent property
      this.xComponentProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( this.xComponent ) );

      // @public (read-only) {DerivedProperty.<number>} - the yComponent property
      this.yComponentProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        attributesVector => ( this.yComponent ) );

      //----------------------------------------------------------------------------------------

      // update the position of the tail of the vector
      const updateTailPosition = ( newModelViewTransform, oldModelViewTransform ) => {
        const oldTailViewPosition = oldModelViewTransform.modelToViewPosition( this.tailPositionProperty.value );
        this.tailPositionProperty.value = newModelViewTransform.viewToModelPosition( oldTailViewPosition );
      };
      modelViewTransformProperty.lazyLink( updateTailPosition );

      // @private - unlink the modelViewTransform link, called in the dispose method
      this.unlinkTailUpdate = () => {
        modelViewTransformProperty.unlink( updateTailPosition );
      };

      //----------------------------------------------------------------------------------------

      // @public (read only) {XVectorComponent}
      this.xVectorComponent = new XVectorComponent( this, componentStyleProperty, this.label );

      // @public (read only) {YVectorComponent}
      this.yVectorComponent = new YVectorComponent( this, componentStyleProperty, this.label );
    }

    /**
     * @public
     * @override
     * Dispose the vector model's properties. Called when the vector is removed from the graph.
     */
    dispose() {

      // dispose properties
      this.isActiveProperty.dispose();

      this.magnitudeProperty.dispose();
      this.angleDegreesProperty.dispose();
      this.xComponentProperty.dispose();
      this.yComponentProperty.dispose();

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
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.roundSymmetric();
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