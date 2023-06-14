// Copyright 2019-2023, University of Colorado Boulder

/**
 * RootVector is the root class for vector models, for all types of vectors.
 * It is abstract and intended to be subclassed.
 *
 * For an overview of the class hierarchy, see
 * https://github.com/phetsims/vector-addition/blob/master/doc/implementation-notes.md
 *
 * Responsibilities are:
 *  - tip and tail position Properties
 *  - components (x and y as scalars, or in other words the actual vector <x, y>)
 *  - vector color palette
 *  - abstract method for label information, see getLabelDisplayData
 *
 * @author Brandon Li
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorColorPalette from './VectorColorPalette.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export type LabelDisplayData = {

  // The coefficient to be displayed. null means to not display a coefficient.
  // For example, if the label displayed '|3v|=15', the coefficient is 3.
  coefficient: number | null;

  // The symbol to be displayed. null means to not display a symbol.
  // For example, if the label displayed '|3v|=15', the symbol is 'v'.
  symbol: string | null;

  // The vector magnitude, displayed on the right side of the label equation. null means to not display a value.
  // For example, if the label displayed '|3v|=15', the magnitude is 15.
  magnitude: number | null;

  // Include absolute value bars around the coefficient and symbol.
  // For example, true => '|3v|=15', false => '3v=15'
  includeAbsoluteValueBars: boolean;
};

export default abstract class RootVector {

  // the vector's components, its x and y scalar values
  public readonly vectorComponentsProperty: Property<Vector2>;

  // the tail position of the vector on the graph
  public readonly tailPositionProperty: Property<Vector2>;

  // the tip position of the vector on the graph
  public readonly tipPositionProperty: TReadOnlyProperty<Vector2>;

  // the color palette used to render the vector
  public readonly vectorColorPalette: VectorColorPalette;

  // the symbol used to represent the vector
  public readonly symbol: string | null;

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param initialComponents - starting components of the vector
   * @param vectorColorPalette - color palette for this vector
   * @param symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   */
  protected constructor( initialTailPosition: Vector2, initialComponents: Vector2,
                         vectorColorPalette: VectorColorPalette, symbol: string | null ) {

    this.vectorComponentsProperty = new Vector2Property( initialComponents );
    this.tailPositionProperty = new Vector2Property( initialTailPosition );

    this.tipPositionProperty = new DerivedProperty(
      [ this.tailPositionProperty, this.vectorComponentsProperty ],
      ( tailPosition, vectorComponents ) => tailPosition.plus( vectorComponents ),
      { valueType: Vector2 }
    );

    this.vectorColorPalette = vectorColorPalette;

    this.symbol = symbol;
  }

  public reset(): void {
    this.vectorComponentsProperty.reset();
    this.tailPositionProperty.reset();
  }

  /**
   * Gets the data that tells how to display a label on the vector. Labels are different for different vector types.
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
   * @param valuesVisible - whether the values are visible (determined by the Values checkbox)
   */
  public abstract getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData;

  /**
   * Gets the components (scalars) of the vector.
   */
  public get vectorComponents(): Vector2 {
    return this.vectorComponentsProperty.value;
  }

  /**
   * Sets the components (scalars) of the vector
   */
  public set vectorComponents( vectorComponents: Vector2 ) {
    this.vectorComponentsProperty.value = vectorComponents;
  }

  /**
   * Gets the magnitude of the vector (always positive).
   */
  public get magnitude(): number {
    return this.vectorComponents.magnitude;
  }

  /**
   * Gets the x component (scalar).
   */
  public get xComponent(): number {
    return this.vectorComponents.x;
  }

  /**
   * Sets the x component (scalar).
   */
  public set xComponent( xComponent: number ) {
    this.vectorComponents = this.vectorComponents.copy().setX( xComponent );
  }

  /**
   * Gets the y component (scalar).
   */
  public get yComponent(): number {
    return this.vectorComponents.y;
  }

  /**
   * Sets the y component (scalar).
   */
  public set yComponent( yComponent: number ) {
    this.vectorComponents = this.vectorComponents.copy().setY( yComponent );
  }

  /**
   * Is either of this vector's components effectively zero?
   * See https://github.com/phetsims/vector-addition/issues/264
   */
  public hasZeroComponent(): boolean {
    return Math.abs( this.xComponent ) < VectorAdditionConstants.ZERO_THRESHOLD ||
           Math.abs( this.yComponent ) < VectorAdditionConstants.ZERO_THRESHOLD;
  }

  /**
   * Moves the vector to the specified tail position.
   * This keeps the magnitude constant, and (as a side effect) changes the tip position.
   */
  public moveToTailPosition( position: Vector2 ): void {
    this.tailPositionProperty.value = position;
  }

  /**
   * Sets the tail position. This keeps the tip position constant, and (as a side effect) changes magnitude.
   */
  public setTailXY( x: number, y: number ): void {

    // Keep a reference to the original tip
    const tip = this.tip;

    this.moveToTailPosition( new Vector2( x, y ) );

    // Set the tip back
    this.tip = tip;
  }

  /**
   * Sets the tail position. This keeps the tip position constant, and (as a side effect) changes magnitude.
   */
  public set tail( tail: Vector2 ) {
    this.setTailXY( tail.x, tail.y );
  }

  /**
   * Gets the tail position.
   */
  public get tail(): Vector2 {
    return this.tailPositionProperty.value;
  }

  /**
   * Sets the tail's x coordinate. This keeps the tip position constant, and (as a side effect) changes magnitude.
   */
  public set tailX( tailX: number ) {
    this.setTailXY( tailX, this.tailY );
  }

  /**
   * Gets the tail's x coordinate.
   */
  public get tailX(): number {
    return this.tailPositionProperty.value.x;
  }

  /**
   * Sets the tail's y coordinate. This keeps the tip position constant, and (as a side effect) changes magnitude.
   */
  public set tailY( tailY: number ) {
    this.setTailXY( this.tailX, tailY );
  }

  /**
   * Gets the tail's y coordinate.
   */
  public get tailY(): number {
    return this.tailPositionProperty.value.y;
  }

  /**
   * Sets the tip position. This keeps the tail position constant, and (as a side effect) changes magnitude.
   */
  public setTipXY( x: number, y: number ): void {

    // Since tipPositionProperty is a DerivedProperty, we cannot directly set it.
    // Instead, we will update the vector components, keeping the tail constant.
    const tip = new Vector2( x, y );
    this.vectorComponents = this.vectorComponents.plus( tip.minus( this.tip ) );
  }

  /**
   * Sets the tip position. This keeps the tail position constant, and (as a side effect) changes magnitude.
   */
  public set tip( tip: Vector2 ) {
    this.setTipXY( tip.x, tip.y );
  }

  /**
   * Gets the tip position.
   */
  public get tip(): Vector2 {
    return this.tipPositionProperty.value;
  }

  /**
   * Gets the tip's x coordinate.
   */
  public get tipX(): number {
    return this.tipPositionProperty.value.x;
  }

  /**
   * Gets the tip's y coordinate.
   */
  public get tipY(): number {
    return this.tipPositionProperty.value.y;
  }

  /**
   * Gets the angle of the vector in radians, measured clockwise from the horizontal.
   * null when the vector has 0 magnitude.
   */
  public get angle(): number | null {
    return this.vectorComponents.equalsEpsilon( Vector2.ZERO, 1e-7 ) ? null : this.vectorComponents.angle;
  }

  /**
   * Gets the angle of the vector in degrees, measured clockwise from the horizontal.
   * null when the vector has 0 magnitude.
   */
  public get angleDegrees(): number | null {
    const angleRadians = this.angle;
    return ( angleRadians === null ) ? null : Utils.toDegrees( angleRadians );
  }
}

vectorAddition.register( 'RootVector', RootVector );