// Copyright 2019-2025, University of Colorado Boulder

/**
 * RootVector is the abstract base class for vector models, for all types of vectors.
 *
 * For an overview of the class hierarchy, see
 * https://github.com/phetsims/vector-addition/blob/main/doc/implementation-notes.md
 *
 * Responsibilities are:
 *  - tip and tail position Properties
 *  - xy-components
 *  - vector color palette
 *  - abstract method for label information, see getLabelDisplayData
 *
 * @author Brandon Li
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toDegrees } from '../../../../dot/js/util/toDegrees.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { signedToUnsignedDegrees } from '../VectorAdditionUtils.js';
import { AngleConvention } from './AngleConvention.js';
import VectorColorPalette from './VectorColorPalette.js';

export type LabelDisplayData = {

  // The coefficient to be displayed. null means to not display a coefficient.
  // For example, if the label displayed '|3v|=15', the coefficient is 3.
  coefficient: number | null;

  // The symbol to be displayed. null means to not display a symbol.
  // For example, if the label displayed '|3v|=15', the symbol is 'v'.
  symbolProperty: TReadOnlyProperty<string> | null;

  // The vector magnitude, displayed on the right side of the label equation. null means to not display a value.
  // For example, if the label displayed '|3v|=15', the magnitude is 15.
  magnitude: number | null;

  // Include absolute value bars around the coefficient and symbol.
  // For example, true => '|3v|=15', false => '3v=15'
  includeAbsoluteValueBars: boolean;
};

type SelfOptions = {

  // required
  vectorColorPalette: VectorColorPalette; // color palette for this vector

  // optional
  magnitudePropertyInstrumented?: boolean; // whether to instrument _magnitudeProperty
  angleDegreesPropertyInstrumented?: boolean; // whether to instrument _angleDegreesProperty
};

export type RootVectorOptions = SelfOptions &
  PickOptional<PhetioObjectOptions, 'tandem' | 'phetioFeatured' | 'phetioState' | 'isDisposable'>;

export default abstract class RootVector extends PhetioObject {

  // the vector's xy-components
  public readonly xyComponentsProperty: Property<Vector2>;

  // the tail position of the vector on the graph
  public readonly tailPositionProperty: Property<Vector2>;

  // the tip position of the vector on the graph
  public readonly tipPositionProperty: TReadOnlyProperty<Vector2>;

  // the color palette used to render the vector
  public readonly vectorColorPalette: VectorColorPalette;

  // This Property was introduced for the PhET-iO API only. Do not use this Property ANYWHERE.
  // Listeners to xyComponentsProperty will get a stale value.
  // Subclass PolarBaseVector defines magnitudeProperty, so make this private with an underscore prefix.
  private readonly _magnitudeProperty: TReadOnlyProperty<number>;

  // See https://github.com/phetsims/vector-addition/issues/380.
  // This Property was introduced for the PhET-iO API only. Do not use this Property ANYWHERE.
  // Listeners to xyComponentsProperty will get a stale value.
  // Subclass PolarBaseVector defines angleDegreesProperty, so make this private with an underscore prefix.
  private readonly _angleRadiansProperty: TReadOnlyProperty<number | null>;
  private readonly _angleDegreesProperty: TReadOnlyProperty<number | null>;

  /**
   * @param tailPosition - initial tail position of the vector
   * @param xyComponents - initial xy-components of the vector
   * @param providedOptions
   */
  protected constructor( tailPosition: Vector2,
                         xyComponents: Vector2,
                         providedOptions: RootVectorOptions ) {

    const options = optionize<RootVectorOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      magnitudePropertyInstrumented: true,
      angleDegreesPropertyInstrumented: true,

      // PhetioObjectOptions
      isDisposable: false, // For PhET-iO, all RootVectors and their subclasses are instantiated at startup.
      tandem: Tandem.OPTIONAL,
      tandemNameSuffix: 'Vector'
    }, providedOptions );

    super( options );

    this.xyComponentsProperty = new Vector2Property( xyComponents, {
      tandem: options.tandem.createTandem( 'xyComponentsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.tailPositionProperty = new Vector2Property( tailPosition, {
      tandem: options.tandem.createTandem( 'tailPositionProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.tipPositionProperty = new DerivedProperty(
      [ this.tailPositionProperty, this.xyComponentsProperty ],
      ( tailPosition, xyComponents ) => tailPosition.plus( xyComponents ), {
        tandem: options.tandem.createTandem( 'tipPositionProperty' ),
        phetioValueType: Vector2.Vector2IO,
        phetioFeatured: true
      } );

    this._magnitudeProperty = new DerivedProperty( [ this.xyComponentsProperty ], () => this.magnitude, {
      tandem: options.magnitudePropertyInstrumented ? options.tandem.createTandem( 'magnitudeProperty' ) : Tandem.OPT_OUT,
      phetioValueType: NumberIO,
      phetioFeatured: true
    } );

    this._angleRadiansProperty = new DerivedProperty( [ this.xyComponentsProperty ],
      () => this.angle, {
        tandem: options.tandem.createTandem( 'angleRadiansProperty' ),
        phetioValueType: NullableIO( NumberIO ),
        units: 'radians',
        phetioFeatured: true
      } );

    this._angleDegreesProperty = new DerivedProperty( [ this._angleRadiansProperty ],
      angleRadians => ( angleRadians === null ) ? null : toDegrees( angleRadians ), {
        tandem: options.angleDegreesPropertyInstrumented ? options.tandem.createTandem( 'angleDegreesProperty' ) : Tandem.OPT_OUT,
        phetioValueType: NullableIO( NumberIO ),
        units: '\u00B0', // degrees symbol
        phetioFeatured: true
      } );

    this.vectorColorPalette = options.vectorColorPalette;
  }

  public reset(): void {
    this.xyComponentsProperty.reset();
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
   *  - Whether the vector has a symbol.
   *  - Whether the vector is selected (https://github.com/phetsims/vector-addition/issues/39#issuecomment-506586411)
   *
   * These factors play different roles for different vector types, making it difficult to generalize. Thus, an
   * abstract method is used to determine the content.
   *
   * @param valuesVisible - whether the values are visible (determined by the Values checkbox)
   */
  public abstract getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData;

  /**
   * Gets the xy-components of the vector.
   */
  public get xyComponents(): Vector2 {
    return this.xyComponentsProperty.value;
  }

  /**
   * Gets the x component (scalar).
   */
  public get xComponent(): number {
    return this.xyComponentsProperty.value.x;
  }

  /**
   * Gets the y component (scalar).
   */
  public get yComponent(): number {
    return this.xyComponentsProperty.value.y;
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
   * Sets the tail position. This keeps the tip position constant, and (as a side effect) changes magnitude.
   */
  public setTailXY( x: number, y: number ): void {

    // Keep a reference to the original tip
    const tip = this.tip;

    this.tailPositionProperty.value = new Vector2( x, y );

    // Set the tip back
    this.setTip( tip );
  }

  /**
   * Sets the tail position. This keeps the tip position constant, and (as a side effect) changes magnitude.
   */
  public setTail( tail: Vector2 ): void {
    this.setTailXY( tail.x, tail.y );
  }

  /**
   * Gets the tail position.
   */
  public get tail(): Vector2 {
    return this.tailPositionProperty.value;
  }

  /**
   * Gets the tail's x coordinate.
   */
  public get tailX(): number {
    return this.tailPositionProperty.value.x;
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
    // Instead, we will update the xy-components, keeping the tail constant.
    const tip = new Vector2( x, y );
    this.xyComponentsProperty.value = this.xyComponents.plus( tip.minus( this.tip ) );
  }

  /**
   * Sets the tip position. This keeps the tail position constant, and (as a side effect) changes magnitude.
   */
  public setTip( tip: Vector2 ): void {
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
   * Gets the vector magnitude.
   */
  public get magnitude(): number {
    return this.xyComponentsProperty.value.magnitude;
  }

  /**
   * Gets the angle of the vector in radians, measured clockwise from the horizontal.
   * The value is in the range (-pi,pi], and null when the vector has 0 magnitude.
   */
  public get angle(): number | null {
    return this.xyComponents.equalsEpsilon( Vector2.ZERO, 1e-7 ) ? null : this.xyComponents.angle;
  }

  /**
   * Gets the angle of the vector in degrees, measured clockwise from the horizontal.
   * If the vector has zero magnitude, null is returned.
   */
  public getAngleDegrees( angleConvention: AngleConvention = 'signed' ): number | null {
    const angleRadians = this.angle;
    let angleDegrees = null;
    if ( angleRadians !== null ) {
      angleDegrees = toDegrees( angleRadians );
      if ( angleConvention === 'unsigned' ) {
        angleDegrees = signedToUnsignedDegrees( angleDegrees );
      }
    }
    return angleDegrees;
  }

  /**
   * Gets the angle of the vector in degrees as a string, using the specified angle convention (signed or unsigned).
   * If the vector has zero magnitude, the empty string is returned.
   */
  public getAngleDegreesString( angleConvention: AngleConvention ): string {
    let angleDegreesString = '';
    const angleDegrees = this.getAngleDegrees( angleConvention );
    if ( angleDegrees !== null ) {
      angleDegreesString = toFixed( angleDegrees, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );
    }
    return angleDegreesString;
  }
}

vectorAddition.register( 'RootVector', RootVector );