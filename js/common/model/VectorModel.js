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
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );
  const XVectorComponent = require( 'VECTOR_ADDITION/common/model/XVectorComponent' );
  const YVectorComponent = require( 'VECTOR_ADDITION/common/model/YVectorComponent' );

  const VectorAdditionQueryParameters = require( 'VECTOR_ADDITION/common/VectorAdditionQueryParameters' );


  // constants

  // interval spacing of vector angle (in degrees) when vector is in polar mode
  const ANGLE_INTERVAL = 5;

  class VectorModel extends BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xComponent horizontal component of the vector
     * @param {number} yComponent vertical component of the vector
     * @param {Graph} graph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorGroups} vectorGroup - (see VectorGroups.js)
     * @param {Object} [options]
     */
    constructor( tailPosition, xComponent, yComponent, graph, componentStyleProperty, vectorGroup, options ) {

      options = _.extend( {
        label: 'v',// {string} - the label of the vector
        isTipDraggable: true // {boolean} - can the tip be dragged
      }, options );

      assert && assert( componentStyleProperty instanceof Property
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );
      assert && assert( typeof options.isTipDraggable === 'boolean',
        `invalid isTipDraggable: ${options.isTipDraggable}` );
      assert && assert( typeof options.label === 'string', `invalid options.label: ${options.label}` );

      //----------------------------------------------------------------------------------------

      super( tailPosition, xComponent, yComponent, vectorGroup );

      // @public (read-only) {boolean}
      this.isTipDraggable = options.isTipDraggable;

      // @public (read-only)
      this.label = options.label;

      // @public (read-only) {BooleanProperty} - indicates if the vector is active. An active vector is a vector that is
      // being dragged by the body or the tip.
      this.isActiveProperty = new BooleanProperty( false );

      // @private {Graph}
      this.graph = graph;

      //----------------------------------------------------------------------------------------
      // Properties for the inspectPanel

      // @public (read-only) {DerivedProperty.<number>} - the magnitude of the vector
      this.magnitudeProperty = new DerivedProperty( [ this.attributesVectorProperty ], () => ( this.magnitude ) );

      // @public (read-only) {DerivedProperty.<number>} - the angle (in degrees) of the vector.
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

      this.graph.modelViewTransformProperty.lazyLink( updateTailPosition );

      // @private - unlink the modelViewTransform link, called in the dispose method
      this.unlinkTailUpdate = () => {
        this.graph.modelViewTransformProperty.unlink( updateTailPosition );
      };

      //----------------------------------------------------------------------------------------
      // Vector Components

      // @public (read only) {XVectorComponent}
      this.xVectorComponent = new XVectorComponent( this, componentStyleProperty, this.label );

      // @public (read only) {YVectorComponent}
      this.yVectorComponent = new YVectorComponent( this, componentStyleProperty, this.label );


      console.log( VectorAdditionQueryParameters.vectorDragThreshold );
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
     * Rounds vector to have integer values. Called when the tip is dragged in the cartesian scene
     * @public
     */
    roundCartesianForm() {

      const tipOnGraph = this.graph.graphModelBounds.closestPointTo( this.tip );

      const cartesianTip = tipOnGraph.roundedSymmetric();

      const vectorInCartesianForm = cartesianTip.minus( this.tail );

      // Based on the vector orientation, constrain the dragging components
      if ( this.graph.orientation === GraphOrientations.HORIZONTAL ) {
        vectorInCartesianForm.setY( 0 );
      }
      else if ( this.graph.orientation === GraphOrientations.VERTICAL ) {
        vectorInCartesianForm.setX( 0 );
      }
      this.attributesVector = vectorInCartesianForm;
    }

    /**
     * Rounds vector magnitude to an integer and angle to a multiple of ANGLE_INTERVAL. Called when the tip is dragged
     * in the Polar scene
     * @public
     */
    roundPolarForm() {

      const roundedMagnitude = Util.roundSymmetric( this.magnitude );
      const roundedAngle = ANGLE_INTERVAL * Util.roundSymmetric(
        Util.toDegrees( this.angle ) / ANGLE_INTERVAL );

      const polarVector = this.attributesVector.copy().setPolar( roundedMagnitude, Util.toRadians( roundedAngle ) );

      // Ensure that the new polar vector is in the bounds. Subtract one from the magnitude until the vector is inside.
      while ( !this.graph.graphModelBounds.containsPoint( this.tail.plus( polarVector ) ) ) {
        polarVector.setMagnitude( polarVector.magnitude - 1 );
      }
      this.attributesVector = polarVector;
    }

    /**
     * Updates the tail such that both tail and tip of the vector remain with the graphBounds. Called when the vector
     * body is being translated.
     * @param {Vector2} tailPosition
     * @public
     * TODO: check with designers to make sure this is what we want
     */
    moveVectorToFitInGraph( tailPosition ) {

      // Determine the bounds of the tails
      const tailBounds = this.graph.graphModelBounds;

      // Determine the bounds such for tip would remain within the graph
      const tipBounds = this.graph.graphModelBounds.shifted( -this.attributesVector.x, -this.attributesVector.y );

      // Find the intersection of the two previous bounds
      const constrainedBounds = tailBounds.intersection( tipBounds );

      // Translate the tail to ensure it stays in the contained bounds
      this.translateToPoint( constrainedBounds.closestPointTo( tailPosition ).roundedSymmetric() );
    }
  }

  return vectorAddition.register( 'VectorModel', VectorModel );
} );