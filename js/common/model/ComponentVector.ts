// Copyright 2019-2025, University of Colorado Boulder

/**
 * ComponentVector is the model of a component vector. It is a vector (not a scalar) that describes the x or y
 * component of some parent vector.  For instance, if parent vector 'a' is <5, 6>, then its x component vector
 * is <5, 0>, and its y component vector is <0, 6>.
 *
 * ComponentVectors are not selectable.
 *
 * 'Is a' relationship with RootVector but adds the following functionality:
 *    - Updates its tail position/components based on a parent vector's changing tail/tip
 *    - Updates its tail position based on the component style Property
 *
 * Positioning for the x and y components are slightly different. Label content for component vectors are unique.
 *
 * @author Brandon Li
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import { ComponentVectorType } from './ComponentVectorType.js';
import RootVector, { LabelDisplayData } from './RootVector.js';
import Vector from './Vector.js';

const COMPONENT_VECTOR_SYMBOL = null; // Component vectors don't have a symbol

export default class ComponentVector extends RootVector {

  // the parent vector for this component vector
  public readonly parentVector: Vector;

  // type of component vector (x or y)
  public readonly componentType: ComponentVectorType;

  // Matches the parent. When the parent is on the graph, the component is also on the graph (and vise versa).
  public readonly isOnGraphProperty: Property<boolean>;

  private readonly componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>;

  // Offsets from axes in PROJECTION style. These are managed by the VectorSet and set via setProjectionOffsets.
  // See https://github.com/phetsims/vector-addition/issues/225
  private projectionXOffset: number;
  private projectionYOffset: number;

  private readonly disposeComponentVector: () => void;

  /**
   * @param parentVector - the vector that this component vector is associated with
   * @param componentVectorStyleProperty
   * @param componentType - type of component vector (x or y), see ComponentVectorType
   */
  public constructor( parentVector: Vector,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      componentType: ComponentVectorType ) {

    super( parentVector.tail, Vector2.ZERO, parentVector.vectorColorPalette, COMPONENT_VECTOR_SYMBOL );

    this.parentVector = parentVector;
    this.componentType = componentType;
    this.isOnGraphProperty = parentVector.isOnGraphProperty;

    this.componentVectorStyleProperty = componentVectorStyleProperty;

    this.projectionXOffset = 0;
    this.projectionYOffset = 0;

    // Observe when the component style changes and/or when the parent vector's tip/tail changes. When
    // the parent changes or when the component style changes, the component vector also changes.
    // unmultilink is required on dispose.
    const updateComponentMultilink = Multilink.multilink(
      [ componentVectorStyleProperty, parentVector.tailPositionProperty, parentVector.tipPositionProperty ],
      () => this.updateComponent()
    );

    this.disposeComponentVector = () => {
      Multilink.unmultilink( updateComponentMultilink );
    };
  }

  public override dispose(): void {
    this.disposeComponentVector();
    super.dispose();
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

    const componentVectorStyle = this.componentVectorStyleProperty.value;
    const parentTail = this.parentVector.tailPositionProperty.value;
    const parentTip = this.parentVector.tipPositionProperty.value;

    if ( this.componentType === 'xComponent' ) {

      //----------------------------------------------------------------------------------------
      // Update the x component vector
      //----------------------------------------------------------------------------------------

      // Triangle and Parallelogram results in the same x component vector
      if ( componentVectorStyle === 'triangle' || componentVectorStyle === 'parallelogram' ) {

        // Shared tail position as parent
        this.tail = parentTail;

        // Tip is at the parent's tip x and at the parent's tail y.
        this.setTipXY( parentTip.x, parentTail.y );
      }
      else if ( componentVectorStyle === 'projection' ) {

        // From parent tailX to parent tipX. However, its y value is 0 since it is on the x-axis
        this.setTailXY( parentTail.x, this.projectionYOffset );
        this.setTipXY( parentTip.x, this.projectionYOffset );
      }

    }
    else if ( this.componentType === 'yComponent' ) {

      //----------------------------------------------------------------------------------------
      // Update the y component vector
      //----------------------------------------------------------------------------------------

      if ( componentVectorStyle === 'triangle' ) {

        // Shared tip position as the parent
        this.tip = parentTip;

        // Tail is at the parent's tip x and at the parent's tail y.
        this.setTailXY( parentTip.x, parentTail.y );
      }
      else if ( componentVectorStyle === 'parallelogram' ) {

        // Shared tail position as parent
        this.tail = parentTail;

        // Tip is at the parents tailX and at the parents tipY
        this.setTipXY( parentTail.x, parentTip.y );
      }
      else if ( componentVectorStyle === 'projection' ) {

        // Same tailY, however its x value is 0 since it is on the y-axis
        this.setTailXY( this.projectionXOffset, parentTail.y );
        this.setTipXY( this.projectionXOffset, parentTip.y );
      }
    }
  }

  /**
   * See RootVector.getLabelDisplayData for details.
   */
  public getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {

    // Get the component vector's magnitude (a scalar, possibly negative)
    let magnitude: number | null = ( this.componentType === 'xComponent' ) ?
                                   this.vectorComponents.x :
                                   this.vectorComponents.y;

    // Component vectors only show their values if and only if the values are visible and if the component isn't 0
    if ( !valuesVisible || magnitude === 0 ) {
      magnitude = null;
    }

    return {
      coefficient: null, // component vectors never have a coefficient
      symbolProperty: null, // component vectors never have a symbol
      includeAbsoluteValueBars: false,
      magnitude: magnitude
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