// Copyright 2019, University of Colorado Boulder

/**
 * Root class (should be subtyped) for vector models for all types of vectors.
 * Responsibilities are:
 *
 *  - tip and tail position properties
 *  - vector components (x and y, or in other words the actual vector <x, y>)
 *  - vector group (See ./VectorGroups.js)
 *  - abstract method for label information (see getLabelContent() for detailed documentation)
 *
 * For an overview of the vector class hierarchy visit https://github.com/phetsims/vector-addition/issues/31
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
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  class RootVectorModel {
    /**
     * @constructor
     * @param {Vector2} initialTailPosition - starting tail position of the vector
     * @param {Vector2} initialComponents - starting components of the vector
     * @param {VectorGroups} vectorGroup - the vector group (See ./VectorGroups.js)
     * @param {string|null} tag - the tag for the vector (i.e. 'a', 'b', 'c', ...)
     */
    constructor( initialTailPosition, initialComponents, vectorGroup, tag ) {

      assert && assert( initialTailPosition instanceof Vector2, `invalid initialTailPosition: ${initialTailPosition}` );
      assert && assert( initialComponents instanceof Vector2, `invalid initialComponents: ${initialComponents}` );
      assert && assert( VectorGroups.includes( vectorGroup ), `invalid vectorGroup: ${vectorGroup}` );
      assert && assert( typeof tag === 'string' || tag === null, `invalid tag: ${tag}` );
      //----------------------------------------------------------------------------------------

      // @public (read-only) {Vector2Property} tailPositionProperty - the tail position of the vector on the graph
      this.tailPositionProperty = new Vector2Property( initialTailPosition );

      // @public (read-only) {Vector2Property} vectorComponentsProperty - (x and y, or in other words the actual vector
      // <x, y>). Every vector has a x and a y component.
      this.vectorComponentsProperty = new Vector2Property( initialComponents );

      // @public (read-only) {DerivedProperty.<Vector2>}  tipPositionProperty - the tip position of the vector. Derived
      // from the tail and the components
      this.tipPositionProperty = new DerivedProperty(
        [ this.tailPositionProperty, this.vectorComponentsProperty ],
        ( tailPosition, vectorComponents ) => tailPosition.plus( vectorComponents ) );

      // @public (read-only) {VectorGroups}
      this.vectorGroup = vectorGroup;

      // @public (read-only) {string}
      this.tag = tag;
    }

    /**
     * Disposes the vector
     * @public
     */
    dispose() {
      this.tailPositionProperty.dispose();
      this.vectorComponentsProperty.dispose();
      this.tipPositionProperty.dispose();
    }

    /**
     * @abstract
     * Gets the label content information to display on the vector. This is abstract since labels differ for vectors.
     *
     * For context, a label is the content next to the vectors that display their tag and/or their value.
     * See https://user-images.githubusercontent.com/42391580/60774902-473beb00-a0d8-11e9-8cd5-737208ca65db.png for an
     * annotated drawing.
     *
     * For instance, vectors with valuesVisible display their tag (i.e. a, b, c, ...) AND their magnitude, while
     * their components only display the x or y component. In the same example, vectors display their magnitude (+)
     * while components display the component, which can be negative.
     *
     * Additionally, the label displays different content depending on the screen.
     * See https://github.com/phetsims/vector-addition/issues/39.
     *
     * There are 5 different factors for determining what the label displays:
     *  - Whether the vector has a coefficient
     *  - Whether the values are visible (determined by the values checkbox)
     *  - Whether the magnitude/component is of length 0. See
     *     https://docs.google.com/document/d/1opnDgqIqIroo8VK0CbOyQ5608_g11MSGZXnFlI8k5Ds/edit#bookmark=id.kmeaaeg3ukx9
     *  - Whether the vector has a tag (i.e. the vectors on lab screen don't have tags)
     *  - Whether the vector is active (https://github.com/phetsims/vector-addition/issues/39#issuecomment-506586411)
     *
     * These factors play different roles for different vector types, making it difficult to generalize. Thus, an
     * abstract method is used to determine the content.
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     *
     * @returns {object} {
     *    coefficient: {string|null} // the coefficient (e.g. if the label displayed '3|v|=15', the coefficient would be
     *                               // 3). Null means it doesn't display a coefficient
     *    tag: {string|null} // the tag (e.g. if the label displayed '3|v|=15', the tag would be '|v|')
     *                       // Null means it doesn't display a tag
     *    value: {string|null} // the suffix (e.g. if the label displayed '3|v|=15', the value would be '=15')
     *                         // Null means it doesn't display a value
     * }
     */
    getLabelContent( valuesVisible ) {
      assert && assert( false, 'getLabelContent must be implemented by sub classes' );
    }

    /**
     * Gets the components of the vector
     * @public
     * @returns {Vector2}
     */
    get vectorComponents() { return this.vectorComponentsProperty.value; }

    /**
     * Sets the components of the vector
     * @public
     * @param {Vector2} vectorComponents
     */
    set vectorComponents( vectorComponents ) {
      assert && assert( vectorComponents instanceof Vector2, `invalid vectorComponents: ${vectorComponents}` );
      this.vectorComponentsProperty.value = vectorComponents;
    }

    /**
     * Gets the magnitude of the vector (+)
     * @public
     * @returns {number}
     */
    get magnitude() { return this.vectorComponents.magnitude; }

    /**
     * Gets the yComponent
     * @public
     * @returns {number}
     */
    get yComponent() { return this.vectorComponents.y; }

    /**
     * Sets the yComponent. Keeps the xComponent, tailPosition constant.
     * @public
     * @param {number} component
     */
    set yComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.vectorComponents = this.vectorComponents.setY( component );
    }

    /**
     * Gets the xComponent
     * @public
     * @returns {number}
     */
    get xComponent() { return this.vectorComponents.x; }

    /**
     * Sets the xComponent. Keeps the yComponent, tailPosition constant.
     * @public
     * @param {number} component
     */
    set xComponent( component ) {
      assert && assert( typeof component === 'number', `invalid component: ${component}` );
      this.vectorComponents = this.vectorComponents.setX( component );
    }

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
      this.setTailXY( x, this.tailY );
    }

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
      this.setTailXY( this.tailX, y );
    }

    /**
     * Gets the tip position
     * @public
     * @returns {Vector2}
     */
    get tip() { return this.tipPositionProperty.value; }

    /**
     * Sets the tip position. This will change the magnitude, but keep the tail constant
     * @public
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

    /**
     * Gets the angle in radians of the vector between $\theta\in(-\pi,\pi]$
     * @public
     * @returns {number|null}
     */
    get angle() {
      return !this.vectorComponents.equalsEpsilon( Vector2.ZERO, 1e-7 ) ? this.vectorComponents.angle : null;
    }

    /**
     * Gets the angle in degrees of the vector between $\theta\in(-\180,\180]$
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

      this.translateTailToPoint( new Vector2( x, y ) );

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
      // Instead, we will update the vectorComponents, keeping the tail constant

      const tip = new Vector2( x, y );

      this.vectorComponents = this.vectorComponents.plus( tip.minus( this.tip ) );
    }

    /**
     * Translates the tail to this point. This keeps the magnitude constant, and changes the tip position.
     * @public
     * @param {Vector2} position
     */
    translateTailToPoint( position ) {
      this.tailPositionProperty.value = position;
    }
  }

  return vectorAddition.register( 'RootVectorModel', RootVectorModel );
} );