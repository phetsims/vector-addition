// Copyright 2019, University of Colorado Boulder

/**
 * Model for a 'normal' vector (vector that is dropped onto the graph)
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
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const XVectorComponent = require( 'VECTOR_ADDITION/common/model/XVectorComponent' );
  const YVectorComponent = require( 'VECTOR_ADDITION/common/model/YVectorComponent' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );


  // constants

  // interval spacing of vector angle (in degrees) when vector is in polar mode
  const ANGLE_INTERVAL = 5;

  class VectorModel extends BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xComponent horizontal component of the vector
     * @param {number} yComponent vertical component of the vector
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorGroups} vectorGroup - (see VectorGroups.js)
     * @param {Object} [options]
     */
    constructor(
      tailPosition,
      xComponent,
      yComponent,
      graph,
      componentStyleProperty,
      vectorGroup,
      options ) {

      options = _.extend( {
        label: 'v',// {string} - the label of the vector
        isTipDraggable: true // {boolean} - can the tip be dragged
      }, options );

      const modelViewTransformProperty = graph.modelViewTransformProperty;

      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid isTipDraggable: ${options.isTipDraggable}` );
      assert && assert( typeof options.label === 'string', `invalid options.label: ${options.label}` );

      //----------------------------------------------------------------------------------------

      super( tailPosition, xComponent, yComponent, vectorGroup );

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
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => ( this.magnitude ) );

      // @public (read-only) {DerivedProperty.<number>} - the angle (in degrees) of the vector
      // The angle is measured clockwise from the positive x-axis with angle in (-180,180]
      this.angleDegreesProperty = new DerivedProperty( [ this.attributesVectorProperty ],
        () => ( Util.toDegrees( this.angle ) ) );

      // @public (read-only) {DerivedProperty.<number>} - the xComponent property
      this.xComponentProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => ( this.xComponent ) );

      // @public (read-only) {DerivedProperty.<number>} - the yComponent property
      this.yComponentProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => ( this.yComponent ) );

      //----------------------------------------------------------------------------------------

      // function to update the position of the tail of the vector based on the modelViewTransform
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
      // Vector Components

      // @public (read only) {XVectorComponent}
      this.xVectorComponent = new XVectorComponent( this, componentStyleProperty, this.label );

      // @public (read only) {YVectorComponent}
      this.yVectorComponent = new YVectorComponent( this, componentStyleProperty, this.label );
      
      this.graph = graph;
    }

    /**
     * Disposes the vector. Called when the vector is removed from the graph.
     * @public
     * @override
     */
    dispose() {

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
     * Activate the vector for the inspect panel. Called when the vector is first dropped onto the graph.
     * @public
     */
    activate() {
      this.isActiveProperty.value = true;
    }

    /**
     * Rounds vector to have integer values
     * @public
     */
    roundCartesianForm( attributesVector ) {

      const tipPosition = this.tail.plus( attributesVector );

      // Get the tip thats on the graph
      const newTip = this.graph.graphModelBounds.closestPointTo( tipPosition );
     
      // Calculate the attributesVector based on the new tip
      const inBoundsAttributesVector = newTip.minus( this.tail );

      const roundedVector = inBoundsAttributesVector.roundSymmetric();

      this.setAttributesVector( roundedVector );

      switch( this.graph.orientation ) {
        case GraphOrientations.HORIZONTAL: {
          this.yComponent = 0;
          break;
        }
        case GraphOrientations.VERTICAL: {
          this.xComponent = 0;
          break;
        }
        case GraphOrientations.TWO_DIMENSIONAL: {
          break;
        }
        default: {
          throw new Error( `graphOrientation not handled: ${this.graphOrientation}` );
        }
      }

    }

    /**
     * Round vectors to have integer values in polar form, i.e. magnitude has integer values and angle is a multiple of
     * ANGLE_INTERVAL
     * @public
     */
    roundPolarForm( attributesVector ) {

      const roundedMagnitude = Util.roundSymmetric( attributesVector.magnitude );
      const roundedAngle = ANGLE_INTERVAL * Util.roundSymmetric( Util.toDegrees( attributesVector.angle ) / ANGLE_INTERVAL );
      const roundedVector = attributesVector.setPolar( roundedMagnitude, Util.toRadians( roundedAngle ) );

    
  
      let tipPosition = this.tail.plus( roundedVector );
      while ( !this.graph.graphModelBounds.containsPoint( tipPosition ) ) {
        roundedVector.setMagnitude( roundedVector.magnitude - 1 );
        tipPosition = this.tail.plus( roundedVector );
      }


      // Calculate the attributesVector based on the new tip
      const inBoundsAttributesVector = tipPosition.minus( this.tail );


      this.setAttributesVector( inBoundsAttributesVector );
    }

    /**
     * Set the attributes of the vector
     * @private
     * @param {Vector2} vector
     */
    setAttributesVector( vector ) {

      // prevent setting the vector to magnitude of zero
      if ( vector.magnitude > 0 ) {
        this.attributesVector = vector;
      }
    }


  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );