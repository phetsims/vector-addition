// Copyright 2019-2023, University of Colorado Boulder

/**
 * ComponentVector is the model of a component vector. It is a vector (not a scalar) that describes the x or y
 * component of some parent vector.  For instance, if parent vector 'a' is <5, 6>, then its x component vector
 * is <5, 0>, and its y component vector is <0, 6>.
 *
 * ComponentVectors are not interactive.
 *
 * 'Is a' relationship with RootVector but adds the following functionality:
 *    - Updates its tail position/components based on a parent vector's changing tail/tip
 *    - Updates its tail position based on the component style Property
 *
 * Positioning for the x and y components are slightly different. Label content for component vectors are unique.
 *
 * @author Brandon Li
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorStyles from './ComponentVectorStyles.js';
import ComponentVectorTypes from './ComponentVectorTypes.js';
import RootVector, { RootVectorLabelContent } from './RootVector.js';
import Vector from './Vector.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// constants
const COMPONENT_VECTOR_SYMBOL = null; // Component vectors don't have a symbol

export default class ComponentVector extends RootVector {

  // the parent vector for this component vector
  public readonly parentVector: Vector;

  // type of component vector (x or y)
  public readonly componentType: ComponentVectorTypes;

  // Matches the parent. When the parent is on the graph, the component is also on the graph (and vise versa).
  public readonly isOnGraphProperty: Property<boolean>;

  // Determines if the parent vector is active.
  public readonly isParentVectorActiveProperty: TReadOnlyProperty<boolean>;

  private readonly componentStyleProperty: EnumerationProperty<ComponentVectorStyles>;

  // Offsets from axes in PROJECTION style. These are managed by the VectorSet and set via setProjectionOffsets.
  // See https://github.com/phetsims/vector-addition/issues/225
  private projectionXOffset: number;
  private projectionYOffset: number;

  private readonly disposeComponentVector: () => void;

  /**
   * @param parentVector - the vector that this component vector is associated with
   * @param componentStyleProperty
   * @param activeVectorProperty - which vector is active (selected)
   * @param componentType - type of component vector (x or y), see ComponentVectorTypes
   */
  public constructor( parentVector: Vector, componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      activeVectorProperty: Property<Vector | null>, componentType: ComponentVectorTypes ) {

    super( parentVector.tail, Vector2.ZERO, parentVector.vectorColorPalette, COMPONENT_VECTOR_SYMBOL );

    this.parentVector = parentVector;
    this.componentType = componentType;
    this.isOnGraphProperty = parentVector.isOnGraphProperty;

    this.isParentVectorActiveProperty = new DerivedProperty(
      [ activeVectorProperty ],
      activeVector => ( !!activeVector && ( activeVector === parentVector ) ),
      { valueType: 'boolean' }
    );

    this.componentStyleProperty = componentStyleProperty;

    this.projectionXOffset = 0;
    this.projectionYOffset = 0;

    // Observe when the component style changes and/or when the parent vector's tip/tail changes. When
    // the parent changes or when the component style changes, the component vector also changes.
    // unmultilink is required on dispose.
    const updateComponentMultilink = Multilink.multilink(
      [ componentStyleProperty, parentVector.tailPositionProperty, parentVector.tipPositionProperty ],
      () => this.updateComponent()
    );

    this.disposeComponentVector = () => {
      Multilink.unmultilink( updateComponentMultilink );
      this.isParentVectorActiveProperty.dispose();
    };
  }

  public dispose(): void {
    this.disposeComponentVector();
  }

  /**
   * Sets the offset from the x-axis and y-axis that is used for PROJECTION style.
   * See https://github.com/phetsims/vector-addition/issues/225.
   * @param projectionXOffset - x offset, in model coordinates
   * @param projectionYOffset - y offset, in model coordinates
   */
  public setProjectionOffsets( projectionXOffset: number, projectionYOffset: number ): void {
    this.projectionXOffset = projectionXOffset;
    this.projectionYOffset = projectionYOffset;
    this.updateComponent();
  }

  /**
   * Updates the component vector's tail/tip/components to match the component style and correct components to match
   * the parent vector's tail/tip.
   */
  private updateComponent(): void {

    const componentStyle = this.componentStyleProperty.value;
    const parentTail = this.parentVector.tailPositionProperty.value;
    const parentTip = this.parentVector.tipPositionProperty.value;

    if ( this.componentType === ComponentVectorTypes.X_COMPONENT ) {

      //----------------------------------------------------------------------------------------
      // Update the x component vector
      //----------------------------------------------------------------------------------------

      // Triangle and Parallelogram results in the same x component vector
      if ( componentStyle === ComponentVectorStyles.TRIANGLE || componentStyle === ComponentVectorStyles.PARALLELOGRAM ) {

        // Shared tail position as parent
        this.tail = parentTail;

        // Tip is at the parent's tip x and at the parent's tail y.
        this.setTipXY( parentTip.x, parentTail.y );
      }
      else if ( componentStyle === ComponentVectorStyles.PROJECTION ) {

        // From parent tailX to parent tipX. However, its y value is 0 since it is on the x-axis
        this.setTailXY( parentTail.x, this.projectionYOffset );
        this.setTipXY( parentTip.x, this.projectionYOffset );
      }

    }
    else if ( this.componentType === ComponentVectorTypes.Y_COMPONENT ) {

      //----------------------------------------------------------------------------------------
      // Update the y component vector
      //----------------------------------------------------------------------------------------

      if ( componentStyle === ComponentVectorStyles.TRIANGLE ) {

        // Shared tip position as the parent
        this.tip = parentTip;

        // Tail is at the parent's tip x and at the parent's tail y.
        this.setTailXY( parentTip.x, parentTail.y );
      }
      else if ( componentStyle === ComponentVectorStyles.PARALLELOGRAM ) {

        // Shared tail position as parent
        this.tail = parentTail;

        // Tip is at the parents tailX and at the parents tipY
        this.setTipXY( parentTail.x, parentTip.y );
      }
      else if ( componentStyle === ComponentVectorStyles.PROJECTION ) {

        // Same tailY, however its x value is 0 since it is on the y-axis
        this.setTailXY( this.projectionXOffset, parentTail.y );
        this.setTipXY( this.projectionXOffset, parentTip.y );
      }
    }
  }

  /**
   * Gets the label content information to be displayed on the vector.
   * See RootVector.getLabelContent for details.
   */
  public getLabelContent( valuesVisible: boolean ): RootVectorLabelContent {

    // Get the component vector's value (a scalar, possibly negative)
    let value: number | null = ( this.componentType === ComponentVectorTypes.X_COMPONENT ) ?
                this.vectorComponents.x :
                this.vectorComponents.y;

    // Round the value. Use Utils.toFixed so that we get a consistent number of decimal places.
    // @ts-expect-error Utils.toFixed returns a string
    value = Utils.toFixed( value, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );

    // Component vectors only show their values if and only if the values are visible and if the component isn't 0
    if ( !valuesVisible || value === 0 ) {
      value = null;
    }

    return {
      coefficient: null, // component vectors never have a coefficient
      symbol: null, // component vectors never have a symbol
      includeAbsoluteValueBars: false,
      value: value
    };
  }

  /*------------------------------------------------------------------------------------*
   * Convenience methods (provides access to information about the private parentVector)
   *------------------------------------------------------------------------------------*/

  /**
   * Gets the mid-point of the component vector
   */
  public get midPoint(): Vector2 {
    return this.vectorComponents.timesScalar( 0.5 ).plus( this.tail );
  }

  /**
   * Gets the parent vector's tail position
   */
  public get parentTail(): Vector2 {
    return this.parentVector.tail;
  }

  /**
   * Gets the parent vector's tip position
   */
  public get parentTip(): Vector2 {
    return this.parentVector.tip;
  }

  /**
   * Gets the parent vector's mid-point position
   */
  public get parentMidPoint(): Vector2 {
    return this.parentVector.vectorComponents.timesScalar( 0.5 ).plus( this.parentVector.tail );
  }
}

vectorAddition.register( 'ComponentVector', ComponentVector );