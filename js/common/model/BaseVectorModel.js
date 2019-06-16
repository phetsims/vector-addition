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
     * @param {number} xMagnitude - horizontal component of the vector
     * @param {number} yMagnitude - vertical component of the vector
     * @param {string} label
     * @param {VectorTypes} vectorType - the type of vector
     */
    constructor( tailPosition, xMagnitude, yMagnitude, label, vectorType ) {

      // Type check arguments
      assert && assert( tailPosition instanceof Vector2, `invalid tailPosition: ${tailPosition}` );
      assert && assert( typeof xMagnitude === 'number', `invalid xMagnitude: ${xMagnitude}` );
      assert && assert( typeof yMagnitude === 'number', `invalid yMagnitude: ${yMagnitude}` );
      assert && assert( typeof label === 'string', `invalid label: ${label}` );
      assert && assert( vectorType instanceof VectorTypes, `invalid vectorType: ${vectorType}` );

      //----------------------------------------------------------------------------------------

      // @public (read-only) {string}
      this.label = label;

      // @public (read-only) VectorTypes
      this.vectorType = vectorType;

      // @public (read-only) {Vector2Property} - The tail position of the vector on the graph.
      this.tailPositionProperty = new Vector2Property( tailPosition );

      // @public (read-only) {Vector2Property} - (x and y, or in other words the actual vector <x, y>)
      this.attributesVectorProperty = new Vector2Property( new Vector2( xMagnitude, yMagnitude ) );

      // @public (read-only) {DerivedProperty.<Vector2>} - the tip position of the vector
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.attributesVectorProperty ],
        ( tailPosition, vector ) => tailPosition.plus( vector ) );

      // Write access to these properties are found below
    }
    /**
     * Dispose of the vector
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

    //----------------------------------------------------------------------------------------
    // Magnitude
    /**
     * @public Multiply the vector by a scalar. Keeps tail position and angle the same.
     * @param {number} scalar
     */
    multiplyScalar( scalar ) {
      assert && assert ( typeof scalar === 'number', `invalid scalar: ${scalar}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.multiplyScalar( scalar );
    }
    /**
     * @public read access to the magnitude
     * @returns {number}
     */
    get magnitude() { return this.attributesVectorProperty.magnitude; }
    /**
     * @public write access to the magnitude. This keeps the tail position and the angle constant.
     * @param {number} magnitude
     */
    set magnitude( magnitude ) { 
      assert && assert ( typeof magnitude === 'number', `invalid magnitude: ${magnitude}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setMagnitude( magnitude );
    }

    //----------------------------------------------------------------------------------------
    // xMagnitude
    /**
     * @public convenience method to access to the x magnitude
     * @returns {number}
     */
    get xMagnitude() { return this.attributesVectorProperty.value.x; }
    /**
     * @public convenience method to set to the x magnitude
     * Keeps the yMagnitude, tailPosition constant
     * @param {number} magnitude
     */
    set xMagnitude( magnitude ) {
      assert && assert ( typeof magnitude === 'number', `invalid magnitude: ${magnitude}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setX( magnitude );
    }

    //----------------------------------------------------------------------------------------
    // yMagnitude
    /**
     * @public convenience method to access to the y magnitude
     * @returns {number}
     */
    get yMagnitude() { return this.attributesVectorProperty.value.y; }
    /**
     * @public convenience method to set to the y magnitude
     * Keeps the xMagnitude, tailPosition constant
     * @param {number} magnitude
     */
    set yMagnitude( magnitude ) {
      assert && assert ( typeof magnitude === 'number', `invalid magnitude: ${magnitude}` );
      this.attributesVectorProperty.value = this.attributesVectorProperty.value.setY( magnitude );
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
      this.tailPositionProperty.value = position;
    }
    /**
     * @public Write access to tail position
     * Sets the tail position (magnitude/angle constant, tip position changes)
     */
    setTailXY( x, y ) { 
      this.tailX = x; // see documentation below
      this.tailY = y; // see documentation below
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
      assert && assert ( typeof x === 'number', `invalid x: ${x}` );
      this.tailPositionProperty.value = this.tailPositionProperty.value.setX( x );
    }

    //----------------------------------------------------------------------------------------
    // Tail Y Position
    /**
     * @public Read access to tail Y
     * @returns {number}
     */
    get tailY() { return this.tailPositionProperty.value.y; }
    /**
     * @public Write access to tail Y
     * @param {number} y
     * Sets the tail position (magnitude/angle constant, tip position changes)
     */
    set tailY( y ) {
      assert && assert ( typeof y === 'number', `invalid y: ${y}` );
      this.tailPositionProperty.value = this.tailPositionProperty.value.setY( y );
    }

    //----------------------------------------------------------------------------------------
    // Tip Position
    /**
     * @public Read access to tip position
     * @returns {Vector2}
     */
    get tip() { return this.tipPositionProperty.value; }
    get tipX() { return this.tipPositionProperty.value.x; }
    get tipY() { return this.tipPositionProperty.value.x; }

    //----------------------------------------------------------------------------------------
    // angle
    /**
     * @public Read access to the angle
     * @returns {number}
     */
    get angle() { return this.attributesVectorProperty.value.angle; }
  }

  return vectorAddition.register( 'BaseVectorModel', BaseVectorModel );
} );