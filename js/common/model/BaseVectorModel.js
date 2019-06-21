// Copyright 2019, University of Colorado Boulder

/**
 * Base class for vector models for all types of vectors (sum, component, etc.).
 * Primarily responsibilities are:
 *
 * - tip and tail position
 * - 'attributes property' (x and y, or in other words the actual vector <x, y>)
 * - label / vector type (one or two)
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
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  class BaseVectorModel {
    /**
     * @constructor
     * @param {Vector2} tailPosition
     * @param {number} xComponent - horizontal component of the vector
     * @param {number} yComponent - vertical component of the vector
     * @param {string} label
     * @param {VectorTypes} vectorType - the type of vector
     */
    constructor( tailPosition, xComponent, yComponent, vectorType ) {

      // Type check arguments
      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( typeof xComponent === 'number', `invalid xComponent: ${xComponent}` );
      assert && assert( typeof yComponent === 'number', `invalid yComponent: ${yComponent}` );
      assert && assert( VectorTypes.includes( vectorType ), `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {VectorTypes}
      this.vectorType = vectorType;

      // @public (read-only) {Vector2Property} - The tail position of the vector on the graph.
      this.tailPositionProperty = new Vector2Property( tailPosition );

      // @public (read-only) {Vector2Property} - (x and y, or in other words the actual vector <x, y>)
      this.attributesVectorProperty = new Vector2Property( new Vector2( xComponent, yComponent ) );

      // @public (read-only) {DerivedProperty.<Vector2>} - the tip position of the vector
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector ) );

      // Write access to these properties are found below
    }

    //----------------------------------------------------------------------------------------
    /**
     * Get the components
     * @public
     * @returns {Vector2} - the attributes vector
     */
    get components() { return this.attributesVectorProperty.value; }

    /*---------------------------------------------------------------------------*
     * The Following are convenience Read/Write methods for ease of use.
     *---------------------------------------------------------------------------*/

    /**
     * get the magnitude of the vector
     * @public
     * @returns {number}
     */
    get magnitude() { return this.attributesVectorProperty.value.magnitude; }

    //----------------------------------------------------------------------------------------

    /**
     * set the magnitude of the vector. This keeps the tail position and the angle constant.
     * @public
     * @param {number} magnitude
     */
    set magnitude( magnitude ) {
      assert && assert( typeof magnitude === 'number', `invalid magnitude: ${magnitude}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setMagnitude( magnitude );
    }

    // yComponent
    /**
     * convenience method to access the y magnitude
     * @public
     * @returns {number}
     */
    get yComponent() { return this.attributesVectorProperty.value.y; }

    /**
     * @public convenience method to set to the y component
     * Keeps the xComponent, tailPosition constant
     * @param {number} component
     */
    set yComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.attributesVectorProperty.value.y = component;
    }

    //----------------------------------------------------------------------------------------

    // xComponent
    /**
     * @public convenience method to access to the x magnitude
     * @returns {number}
     */
    get xComponent() { return this.attributesVectorProperty.value.x; }

    /**
     * @public convenience method to set to the x component
     * Keeps the yComponent, tailPosition constant
     * @param {number} component
     */
    set xComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.attributesVectorProperty.value.x = component;
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

    // Tail Y Position
    /**
     * Getter for the y component of the tail position
     * @public
     * @returns {number}
     */
    get tailY() { return this.tailPositionProperty.value.y; }


    //----------------------------------------------------------------------------------------

    /**
     * Setter for the y position of the tail. Will translate the vector to the new position.
     * @public
     * @param {number} y
     */
    set tailY( y ) {
      this.setTailXY( this.tailPositionProperty.value.x, y );
    }

    // Tip Position
    /**
     * Getters for tip position and components
     * @public
     * @returns {Vector2}
     */
    get tip() { return this.tipPositionProperty.value; }

    //----------------------------------------------------------------------------------------

    get tipX() { return this.tipPositionProperty.value.x; }

    get tipY() { return this.tipPositionProperty.value.y; }

    //----------------------------------------------------------------------------------------

    // angle
    /**
     * Returns the angle in radians of the vector between $\theta\in(-\pi,\pi]$
     * @public
     * @returns {number}
     */
    get angle() { return this.attributesVectorProperty.value.angle; }

    /**
     * Dispose of the vector
     * @public
     */
    dispose() {
      this.tailPositionProperty.dispose();
      this.attributesVectorProperty.dispose();
      this.tipPositionProperty.dispose();
    }

    // Magnitude
    /**
     * Multiply the vector by a scalar. Keeps tail position and angle the same.
     * @public
     * @param {number} scalar
     */
    multiplyScalar( scalar ) {
      assert && assert( typeof scalar === 'number', `invalid scalar: ${scalar}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.timesScalar( scalar );
    }

    //----------------------------------------------------------------------------------------

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