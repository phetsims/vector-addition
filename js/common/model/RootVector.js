// Copyright 2019, University of Colorado Boulder

/**
 * Root class (should be subclasses) for vector models for all types of vectors.
 *
 * For an overview of the class hierarchy,
 * see https://github.com/phetsims/vector-addition/blob/master/doc/implementation-notes.md
 *
 * Responsibilities are:
 *  - tip and tail position Properties
 *  - vector components (x and y as scalars, or in other words the actual vector <x, y>)
 *  - vector color palette
 *  - abstract method for label information (see getLabelContent() for detailed documentation)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );

  class RootVector {

    /**
     * @abstract
     *
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Vector2} initialComponents - starting components of the vector
     * @param {VectorColorPalette} vectorColorPalette - color palette for this vector
     * @param {string|null} symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition, initialComponents, vectorColorPalette, symbol ) {

      assert && assert( initialTailPosition instanceof Vector2, `invalid initialTailPosition: ${initialTailPosition}` );
      assert && assert( initialComponents instanceof Vector2, `invalid initialComponents: ${initialComponents}` );
      assert && assert( vectorColorPalette instanceof VectorColorPalette,
        `invalid vectorColorPalette: ${vectorColorPalette}` );
      assert && assert( typeof symbol === 'string' || symbol === null, `invalid symbol: ${symbol}` );

      // @public (read-only) {Vector2Property} vectorComponentsProperty - (x and y as scalars, or in other words the
      // actual vector <x, y>). Every vector has a x and a y component (as a scalar).
      this.vectorComponentsProperty = new Vector2Property( initialComponents );

      // @public (read-only) {Vector2Property} tailPositionProperty - the tail position of the vector on the graph
      this.tailPositionProperty = new Vector2Property( initialTailPosition );

      // @public (read-only) {DerivedProperty.<Vector2>} tipPositionProperty - the tip position of the vector. Derived
      // from the tail and the components
      this.tipPositionProperty = new DerivedProperty( [ this.tailPositionProperty, this.vectorComponentsProperty ],
        ( tailPosition, vectorComponents ) => tailPosition.plus( vectorComponents ) );

      // @public (read-only) {VectorColorPalette}
      this.vectorColorPalette = vectorColorPalette;

      // @public (read-only) {string} symbol
      this.symbol = symbol;
    }

    /**
     * @public
     */
    reset() {
      this.vectorComponentsProperty.reset();
      this.tailPositionProperty.reset();
    }

    /**
     * Gets the label content information to display on the vector. Labels are different for different vector types.
     *
     * For instance, vectors with values visible display their symbol (i.e. a, b, c, ...) AND their magnitude, while
     * their component vectors only display the x or y component. In the same example, vectors display their magnitude
     * (which is always positive), while component vectors display the component vector's scalar value, which may be
     * negative.
     *
     * Additionally, the label displays different content depending on the screen.
     * See https://github.com/phetsims/vector-addition/issues/39.
     *
     * There are 5 different factors for determining what the label displays:
     *  - Whether the vector has a coefficient and if it should display it
     *  - Whether the values are visible (determined by the values checkbox)
     *  - Whether the magnitude/component is of length 0. See
     *    https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit#bookmark=id.kmeaaeg3ukx9
     *  - Whether the vector has a symbol (e.g. the vectors on lab screen don't have symbols)
     *  - Whether the vector is active (https://github.com/phetsims/vector-addition/issues/39#issuecomment-506586411)
     *
     * These factors play different roles for different vector types, making it difficult to generalize. Thus, an
     * abstract method is used to determine the content.
     *
     * @abstract
     * @public
     * @param {boolean} valuesVisible - whether the values are visible (determined by the Values checkbox)
     * @returns {Object} a description of the label, with these fields:
     *
     * {
     *    // The coefficient (e.g. if the label displayed '|3v|=15', the coefficient would be '3').
     *    // Null means to not display a coefficient
     *    coefficient: {string|null},
     *
     *    // The symbol (e.g. if the label displayed '|3v|=15', the symbol would be 'v').
     *    // Null means to not display a symbol
     *    symbol: {string|null},
     *
     *    // The value (e.g. if the label displayed '|3v|=15', the value would be '=15').
     *    // Null means to not display a value
     *    value: {string|null},
     *
     *    // Include absolute value bars (e.g. if the label displayed '|3v|=15 the includeAbsoluteValueBars
     *    // would be true)
     *    includeAbsoluteValueBars: {boolean}
     * }
     */
    getLabelContent( valuesVisible ) {
      throw new Error( 'getLabelContent must be implemented by subclass' );
    }

    /**
     * Gets the components (scalars) of the vector.
     * @public
     * @returns {Vector2}
     */
    get vectorComponents() { return this.vectorComponentsProperty.value; }

    /**
     * Sets the components (scalars) of the vector
     * @public
     * @param {Vector2} vectorComponents
     */
    set vectorComponents( vectorComponents ) {
      assert && assert( vectorComponents instanceof Vector2, `invalid vectorComponents: ${vectorComponents}` );
      this.vectorComponentsProperty.value = vectorComponents;
    }

    /**
     * Gets the magnitude of the vector (is always positive).
     * @public
     * @returns {number}
     */
    get magnitude() { return this.vectorComponents.magnitude; }

    /**
     * Gets the yComponent (scalar).
     * @public
     * @returns {number}
     */
    get yComponent() { return this.vectorComponents.y; }

    /**
     * Sets the yComponent (scalar). Keeps the xComponent, tail position constant.
     * @public
     * @param {number} yComponent
     */
    set yComponent( yComponent ) {
      assert && assert( typeof yComponent === 'number', `invalid yComponent: ${yComponent}` );
      this.vectorComponents = this.vectorComponents.copy().setY( yComponent );
    }

    /**
     * Gets the xComponent (scalar).
     * @public
     * @returns {number}
     */
    get xComponent() { return this.vectorComponents.x; }

    /**
     * Sets the xComponent (scalar). Keeps the yComponent, tail position constant.
     * @public
     * @param {number} xComponent
     */
    set xComponent( xComponent ) {
      assert && assert( typeof xComponent === 'number', `invalid xComponent: ${xComponent}` );
      this.vectorComponents = this.vectorComponents.copy().setX( xComponent );
    }

    /**
     * Gets the tail position
     * @public
     * @returns {Vector2}
     */
    get tail() { return this.tailPositionProperty.value; }

    /**
     * Sets the tail position. This will change the magnitude/components but keep the tip position the same.
     * @public
     * @param {Vector2} tail
     */
    set tail( tail ) {
      assert && assert( tail instanceof Vector2, `invalid tail: ${tail}` );
      this.setTailXY( tail.x, tail.y );
    }

    /**
     * Gets the tailX
     * @public
     * @returns {number}
     */
    get tailX() { return this.tailPositionProperty.value.x; }

    /**
     * Sets the tailX. This changes the magnitude/components but will keep the tip position the same.
     * @public
     * @param {number} tailX
     */
    set tailX( tailX ) {
      this.setTailXY( tailX, this.tailY );
    }

    /**
     * Gets the tailY
     * @public
     * @returns {number}
     */
    get tailY() { return this.tailPositionProperty.value.y; }

    /**
     * Sets the tailY. This changes the magnitude/components but will keep the tip the same.
     * @public
     * @param {number} tailY
     */
    set tailY( tailY ) {
      this.setTailXY( this.tailX, tailY );
    }

    /**
     * Gets the tip position
     * @public
     * @returns {Vector2}
     */
    get tip() { return this.tipPositionProperty.value; }

    /**
     * Sets the tip position. This will change the magnitude/components, but keep the tail constant.
     * @public
     * @param {Vector2} tip
     */
    set tip( tip ) {
      assert && assert( tip instanceof Vector2, `invalid tip: ${tip}` );
      this.setTipXY( tip.x, tip.y );
    }

    /**
     * Gets the tipX.
     * @public
     * @returns {number}
     */
    get tipX() { return this.tipPositionProperty.value.x; }

    /**
     * Gets the tipY.
     * @public
     * @returns {number}
     */
    get tipY() { return this.tipPositionProperty.value.y; }

    /**
     * Gets the angle in radians of the vector between $\theta\in(-\pi,\pi]$. Is null when the components are of 0
     * magnitude.
     * @public
     * @returns {number|null}
     */
    get angle() {
      return !this.vectorComponents.equalsEpsilon( Vector2.ZERO, 1e-7 ) ? this.vectorComponents.angle : null;
    }

    /**
     * Gets the angle in degrees of the vector between $\theta\in(-\180,\180]$. Is null when the components are of 0
     * magnitude.
     * @public
     * @returns {number|null}
     */
    get angleDegrees() {
      return this.angle !== null ? Util.toDegrees( this.angle ) : null;
    }

    /**
     * Sets the tail position. This will change the magnitude of the vector, but the tip will remain constant.
     * @public
     * @param {number} x
     * @param {number} y
     */
    setTailXY( x, y ) {
      assert && assert( typeof x === 'number', `invalid x: ${x}` );
      assert && assert( typeof y === 'number', `invalid y: ${y}` );

      // Keep a reference to the original tip
      const tip = this.tip;

      this.translateTailToPosition( new Vector2( x, y ) );

      // Set the tip back
      this.tip = tip;
    }

    /**
     * Sets the tip position. This will change the magnitude of the vector, but the tail will remain constant.
     * @public
     * @param {number} x
     * @param {number} y
     */
    setTipXY( x, y ) {
      assert && assert( typeof x === 'number', `invalid x: ${x}` );
      assert && assert( typeof y === 'number', `invalid y: ${y}` );

      // Since tipPositionProperty is a DerivedProperty, we cannot directly set it.
      // Instead, we will update the vector components, keeping the tail constant.

      const tip = new Vector2( x, y );

      this.vectorComponents = this.vectorComponents.plus( tip.minus( this.tip ) );
    }

    /**
     * Translates the tail to this point. This keeps the magnitude constant, and changes the tip position.
     * @public
     * @param {Vector2} position
     */
    translateTailToPosition( position ) {
      this.tailPositionProperty.value = position;
    }
  }

  return vectorAddition.register( 'RootVector', RootVector );
} );