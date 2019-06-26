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
     * Gets the attributes vector
     * @public
     * @returns {Vector2} - the attributes vector
     */
    get attributesVector() { return this.attributesVectorProperty.value; }

    /**
     * Sets the attributes vector
     * @public
     * @param {Vector2} attributesVector
     */
    set attributesVector( attributesVector ) {
      assert && assert( attributesVector instanceof Vector2, `invalid attributesVector: ${attributesVector}` );
      this.attributesVectorProperty.value = attributesVector;
    }

    /**
     * Gets the magnitude of the vector
     * @public
     * @returns {number}
     */
    get magnitude() { return this.attributesVector.magnitude; }
    
    /**
     * Sets the magnitude of the vector. This keeps the tail constant, but changes the tail.
     * @public
     * @param {number} magnitude
     */
    set magnitude( number ) {

      assert && assert( typeof number === 'number', `invalid number: ${number}` );
      this.attributesVector = this.attributesVector.copy().setMagnitude( number );
    }

    //----------------------------------------------------------------------------------------
    // Y component

    /**
     * Gets the yComponent
     * @public
     * @returns {number}
     */
    get yComponent() { return this.attributesVector.y; }

    /**
     * @public
     * Sets the yComponent. Keeps the xComponent, tailPosition constant.
     * @param {number} component
     */
    set yComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.attributesVector.y = component;
    }

    //----------------------------------------------------------------------------------------
    // X component

    /**
     * Gets the xComponent
     * @public
     * @returns {number}
     */
    get xComponent() { return this.attributesVector.x; }

    /**
     * Sets the xComponent. Keeps the yComponent, tailPosition constant.
     * @public
     * @param {number} component
     */
    set xComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.attributesVector.x = component;
    }

    //----------------------------------------------------------------------------------------
    // Tail Position

    /**
     * Gets the tail
     * @public
     * @returns {Vector2}
     */
    get tail() { return this.tailPositionProperty.value; }

    /**
     * Sets the tail position. This will change the magnitude but keep the tip position the same.
     * @public
     * @param {Vector2} position
     */
    set tail( position ) {
      assert && assert( position instanceof Vector2, `invalid position: ${position}` );
      this.setTailXY( position.x, position.y );
    }

    //----------------------------------------------------------------------------------------
    // Tail X Position

    /**
     * Gets the tailX
     * @public
     * @returns {number}
     */
    get tailX() { return this.tailPositionProperty.value.x; }

    /**
     * Sets the tailX. This changes the magnitude but will keep the tip position the same.
     * @public
     * @param {number} x
     */
    set tailX( x ) {
      this.setTailXY( x, this.tailPositionProperty.value.y );
    }

    //----------------------------------------------------------------------------------------
    // Tail Y Position

    /**
     * Gets the tailY
     * @public
     * @returns {number}
     */
    get tailY() { return this.tailPositionProperty.value.y; }

    /**
     * Sets the tailY. This changes the magnitude but will keep the tip the same.
     * @public
     * @param {number} y
     */
    set tailY( y ) {
      this.setTailXY( this.tailPositionProperty.value.x, y );
    }

    //----------------------------------------------------------------------------------------
    // Tip Position

    /**
     * Gets for tip position
     * @public
     * @returns {Vector2}
     */
    get tip() { return this.tipPositionProperty.value; }
    
    /**
     * @public
     * Sets the tip position. This will change the magnitude, but keep the tail constant
     * @param {Vector2} position
     */
    set tip( position ) {
      assert && assert( position instanceof Vector2, `invalid position: ${position}` );      
      this.setTipXY( position.x, position.y );
    }

    /**
     * Gets the tipX
     * @public
     * @returns {number}
     */
    get tipX() { return this.tipPositionProperty.value.x; }

    /**
     * Gets the tipY
     * @public
     * @returns {number}
     */
    get tipY() { return this.tipPositionProperty.value.y; }

    //----------------------------------------------------------------------------------------

    /**
     * Gets the angle in radians of the vector between $\theta\in(-\pi,\pi]$
     * @public
     * @returns {number}
     */
    get angle() { return this.attributesVector.angle; }

    /**
     * @public
     * Sets the tail position. This will change the magnitude of the vector, but the tip will remain constant.
     * @param {number} x
     * @param {number} y
     */
    setTailXY( x, y ) {
      assert && assert( typeof x === 'number', `invalid x: ${x}` );
      assert && assert( typeof y === 'number', `invalid y: ${y}` );

      // Keep a reference to the original tip
      const tip = this.tip;

      this.tailPositionProperty.value = new Vector2( x, y );

      // Set the tip back
      this.tip = tip;
    }

    /**
     * @public
     * Sets the tip position. This will change the magnitude of the vector, but the tail will remain constant.
     * @param {number} x
     * @param {number} y
     */
    setTipXY( x, y ) {
      assert && assert( typeof x === 'number', `invalid x: ${x}` );
      assert && assert( typeof y === 'number', `invalid y: ${y}` );

      // Since tipPositionProperty is a DerivedProperty, we cannot directly set it.
      // Instead, we will update the attributesVector, keeping the tail constant

      const newTip = new Vector2( x, y );

      this.attributesVector = this.attributesVector.plus( newTip.minus( this.tip ) );

    }

    /**
     * Translates the tail to this point. This keeps the magnitude constant, and changes the tip position.
     * @param {Vector2} position
     * @public
     */
    translateToPoint( position ) {
      this.tailPositionProperty.value = position;
    }
  }

  return vectorAddition.register( 'BaseVectorModel', BaseVectorModel );
} );