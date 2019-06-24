// Copyright 2019, University of Colorado Boulder

/**
 * Base class (should be subtyped) for vector models for all types of vectors.
 * Responsibilities are:
 *
 *  - tip and tail position properties
 *  - 'attributes property' (x and y, or in other words the actual vector <x, y>)
 *  - vector group (See VectorGroups.js)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  class BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {number} xComponent - horizontal component of the vector
     * @param {number} yComponent - vertical component of the vector
     * @param {VectorGroups} vectorGroup - the vector group (see VectorGroups.js)
     */
    constructor( initialTailPosition, xComponent, yComponent, vectorGroup ) {

      assert && assert( initialTailPosition instanceof Vector2, `invalid initialTailPosition: ${initialTailPosition}` );
      assert && assert( typeof xComponent === 'number', `invalid xComponent: ${xComponent}` );
      assert && assert( typeof yComponent === 'number', `invalid yComponent: ${yComponent}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {VectorGroups}
      this.vectorGroup = vectorGroup;

      // @public (read-only) {Vector2Property} - the tail position of the vector on the graph
      this.tailPositionProperty = new Vector2Property( initialTailPosition );

      // @public (read-only) {Vector2Property} - (x and y, or in other words the actual vector <x, y>)
      this.attributesVectorProperty = new Vector2Property( new Vector2( xComponent, yComponent ) );

      // @public (read-only) {DerivedProperty.<Vector2>} - the tip position of the vector
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector ) );

      // Write access to these properties are found below
    }

    /**
     * Disposes the vector
     * @public
     */
    dispose() {
      this.tailPositionProperty.dispose();
      this.attributesVectorProperty.dispose();
      this.tipPositionProperty.dispose();
    }

    /*---------------------------------------------------------------------------*
     * The Following are convenience Read/Write methods for ease of use.
     *---------------------------------------------------------------------------*/

    /**
     * Get the attributes vector
     * @public
     * @returns {Vector2} - the attributes vector
     */
    get attributesVector() { return this.attributesVectorProperty.value; }

    /**
     * Set the attributes vector
     * @public
     * @param {Vector2} attributesVector
     * @returns {Vector2} the attributes vector
     */
    set attributesVector( attributesVector ) {
      assert && assert( attributesVector instanceof Vector2, `invalid attributesVector: ${attributesVector}` );
      this.attributesVectorProperty.value = attributesVector;
    }

    //----------------------------------------------------------------------------------------

    /**
     * Get the magnitude of the vector
     * @public
     * @returns {number}
     */
    get magnitude() { return this.attributesVector.magnitude; }

    //----------------------------------------------------------------------------------------
    // Y component

    /**
     * convenience method to access the y component
     * @public
     * @returns {number}
     */
    get yComponent() { return this.attributesVector.y; }

    /**
     * @public convenience method to set to the y component
     * Keeps the xComponent, tailPosition constant
     * @param {number} component
     */
    set yComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.attributesVector.y = component;
    }

    //----------------------------------------------------------------------------------------
    // X component

    /**
     * @public convenience method to access to the x magnitude
     * @returns {number}
     */
    get xComponent() { return this.attributesVector.x; }

    /**
     * @public convenience method to set to the x component
     * Keeps the yComponent, tailPosition constant
     * @param {number} component
     */
    set xComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.attributesVector.x = component;
    }

    //----------------------------------------------------------------------------------------
    // Tail Position

    /**
     * @public Read access to tail position
     * @returns {Vector2}
     */
    get tail() { return this.tailPositionProperty.value; }

    /**
     * @public Write access to tail position
     * Sets the tail position (magnitude/angle constant, tip position changes)
     * @param {Vector2} position
     */
    set tail( position ) {
      assert && assert( position instanceof Vector2, `invalid position: ${position}` );
      this.setTailXY( position.x, position.y );
    }

    //----------------------------------------------------------------------------------------
    // Tail X Position

    /**
     * @public Read access to tail x
     * @returns {number}
     */
    get tailX() { return this.tailPositionProperty.value.x; }

    /**
     * @public Write access to tail x
     * @param {number} x
     * Sets the tail position (magnitude/angle constant, tip position changes)
     */
    set tailX( x ) {
      this.setTailXY( x, this.tailPositionProperty.value.y );
    }

    //----------------------------------------------------------------------------------------
    // Tail Y Position

    /**
     * Getter for the y component of the tail position
     * @public
     * @returns {number}
     */
    get tailY() { return this.tailPositionProperty.value.y; }

    /**
     * Setter for the y position of the tail. Will translate the vector to the new position.
     * @public
     * @param {number} y
     */
    set tailY( y ) {
      this.setTailXY( this.tailPositionProperty.value.x, y );
    }

    //----------------------------------------------------------------------------------------
    // Tip Position

    /**
     * Getters for tip position
     * @public
     * @returns {Vector2}
     */
    get tip() { return this.tipPositionProperty.value; }

    get tipX() { return this.tipPositionProperty.value.x; }

    get tipY() { return this.tipPositionProperty.value.y; }

    //----------------------------------------------------------------------------------------

    /**
     * Returns the angle in radians of the vector between $\theta\in(-\pi,\pi]$
     * @public
     * @returns {number}
     */
    get angle() { return this.attributesVector.angle; }


    /**
     * Multiply the vector by a scalar. Keeps tail position and angle the same.
     * @public
     * @param {number} scalar
     */
    multiplyScalar( scalar ) {
      assert && assert( typeof scalar === 'number', `invalid scalar: ${scalar}` );
      this.attributesVector = this.attributesVector.timesScalar( scalar );
    }

    /**
     * @public Write access to tail position
     * Sets the tail position (magnitude/angle constant, tip position changes)
     */
    setTailXY( x, y ) {
      assert && assert( typeof x === 'number', `invalid x: ${x}` );
      assert && assert( typeof y === 'number', `invalid y: ${y}` );

      this.tailPositionProperty.value = new Vector2( x, y );
    }
  }

  return vectorAddition.register( 'BaseVectorModel', BaseVectorModel );
} );