// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Component Vector.
 *
 * A Component Vector is a component (as a vector, not a scalar) of a parent vector.
 *
 * For instance, if vector 'a' were to be <5, 5>, its x component vector would be <5, 0> (as a vector, not a scalar).
 * The component vector's 'parent vector' would be vector 'a'.
 *
 * 'Is a' relationship with RootVector but adds the following functionality:
 *    - Updates its tail position/components based on a parent vector's changing tail/tip
 *    - Updates its tail position based on the component style Property
 *
 * Positioning for the x and y components are slightly different. Label content for component vectors are unique.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Property = require( 'AXON/Property' );
  const RootVector = require( 'VECTOR_ADDITION/common/model/RootVector' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const COMPONENT_VECTOR_SYMBOL = null; // Vector components don't have a symbol

  // rounding for the vector value (on the label with values checked)
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;


  class ComponentVector extends RootVector {

    /**
     * @param {Vector} parentVector - the vector to which the component is associated with
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - Property of the style of components
     * @param {Enumeration} componentType - type of component vector (x or y) (see ComponentVector.COMPONENT_TYPES)
     */
    constructor( parentVector, componentStyleProperty, componentType ) {

      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( ComponentVector.COMPONENT_TYPES.includes( componentType ),
        `invalid componentType: ${componentType}` );


      super( parentVector.tail, Vector2.ZERO, parentVector.vectorColorGroup, COMPONENT_VECTOR_SYMBOL );

      //----------------------------------------------------------------------------------------
      // Create references

      // @public (read-only) {Enumeration} componentType - type of component vector (x or y)
      this.componentType = componentType;

      // @public (read-only) {BooleanProperty} isOnGraphProperty - matches the parent. When the parent is on the graph,
      //                                                           the component is also on the graph (and vise versa).
      this.isOnGraphProperty = parentVector.isOnGraphProperty;

      // @private (read-only) {Vector} parentVector - private reference to the parent vector
      this.parentVector = parentVector;

      //----------------------------------------------------------------------------------------

      // Observe when the component style changes and/or when the parent vector's tip/tail changes. When
      // the parent changes or when the component style changes, the component vector also changes.
      const updateComponentMultilink = Property.multilink( [
        componentStyleProperty,
        parentVector.tailPositionProperty,
        parentVector.tipPositionProperty
      ], ( componentStyle, parentTail, parentTip ) => {
        this.updateComponent( componentStyle, parentTail, parentTip );
      } );

      // @private {function} disposeComponentVector - disposes the component vector. Called in the dispose method.
      this.disposeComponentVector = () => {
        Property.unmultilink( updateComponentMultilink );
      };
    }

    /**
     * Disposes the vector component. Called when the parent vector is disposed.
     * @public
     */
    dispose() {
      this.disposeComponentVector();
    }

    /**
     * Updates the component vector's tail/tip/components to match the component style and correct components to match
     * the parent vector's tail/tip.
     * @private
     *
     * @param {ComponentStyles} componentStyle
     * @param {Vector2} parentTail - the position of the parent vector's tail
     * @param {Vector2} parentTip - the position of the parent vector's tip
     */
    updateComponent( componentStyle, parentTail, parentTip ) {

      if ( this.componentType === ComponentVector.COMPONENT_TYPES.X_COMPONENT ) {

        //----------------------------------------------------------------------------------------
        // Update the x component vector
        //----------------------------------------------------------------------------------------

        // Triangle and Parallelogram results in the same x component vector
        if ( componentStyle === ComponentStyles.TRIANGLE || componentStyle === ComponentStyles.PARALLELOGRAM ) {

          // Shared tail position as parent
          this.tail = parentTail;

          // Tip is at the parent's tip x and at the parent's tail y.
          this.setTipXY( parentTip.x, parentTail.y );
        }
        else if ( componentStyle === ComponentStyles.ON_AXIS ) {

          // From parent tailX to parent tipX. However its y value is 0 since it is on the x-axis
          this.setTailXY( parentTail.x, 0 );
          this.setTipXY( parentTip.x, 0 );
        }

      }
      else if ( this.componentType === ComponentVector.COMPONENT_TYPES.Y_COMPONENT ) {

        //----------------------------------------------------------------------------------------
        // Update the y component vector
        //----------------------------------------------------------------------------------------

        if ( componentStyle === ComponentStyles.TRIANGLE ) {

          // Shared tip position as the parent
          this.tip = parentTip;

          // Tail is at the parent's tip x and at the parent's tail y.
          this.setTailXY( parentTip.x, parentTail.y );
        }
        else if ( componentStyle === ComponentStyles.PARALLELOGRAM ) {

          // Shared tail position as parent
          this.tail = parentTail;

          // Tip is at the parents tailX and at the parents tipY
          this.setTipXY( parentTail.x, parentTip.y );
        }
        else if ( componentStyle === ComponentStyles.ON_AXIS ) {

          // Same tailY, however its x value is 0 since it is on the y-axis
          this.setTailXY( 0, parentTail.y );
          this.setTipXY( 0, parentTip.y );
        }
      }
    }

    /**
     * @override
     * @public
     * See RootVector.getLabelContent() for context.
     *
     * Gets the label content information to display the vector component. Vector components don't have symbols
     * and only show their component (which can be negative) when values are visible. They never have coefficients.
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    coefficient: {string|null}  // The coefficient (e.g. if the label displayed '3|v|=15', the coefficient would
     *                                // be '3'). 'null' means to not display a coefficient
     *    symbol: {string|null}       // The symbol (e.g. if the label displayed '3|v|=15', the symbol would be '|v|')
     *                                // 'null' means to not display a symbol
     *    value: {string|null}        // The value (e.g. if the label displayed '3|v|=15', the value would be '=15')
     *                                // 'null' means to not display a value
     * }
     */
    getLabelContent( valuesVisible ) {

      // Get the component value, which can be negative and depends on the type of component
      const componentValue = this.componentType === ComponentVector.COMPONENT_TYPES.X_COMPONENT ?
                             this.vectorComponents.x :
                             this.vectorComponents.y;

      // Round the component value
      const roundedComponentValue = Util.toFixed( componentValue, VECTOR_VALUE_ROUNDING );

      return {
        coefficient: null, // components never have a coefficient
        symbol: null, // components never have a symbol

        // Components only show their values if and only if the values are visible and if the component isn't 0
        value: valuesVisible && Math.abs( roundedComponentValue ) > 0 ? roundedComponentValue : null
      };
    }

    /*------------------------------------------------------------------------------------*
     * Convenience methods (provides access to information about the private parentVector)
     *------------------------------------------------------------------------------------*/

    /**
     * Gets the mid-point of the component vector
     * @public
     * @returns {Vector2}
     */
    get midPoint() { return this.vectorComponents.timesScalar( 0.5 ).plus( this.tail ); }

    /**
     * Gets the parent's tail position
     * @public
     * @returns {Vector2}
     */
    get parentTail() { return this.parentVector.tail; }

    /**
     * Gets the parent's tip position
     * @public
     * @returns {Vector2}
     */
    get parentTip() { return this.parentVector.tip; }

    /**
     * Gets the parent's mid-point position
     * @public
     * @returns {Vector2}
     */
    get parentMidPoint() {
      return this.parentVector.vectorComponents.timesScalar( 0.5 ).plus( this.parentVector.tail );
    }
  }

  // @public (read-only) {Enumeration} COMPONENT_TYPES - Enumeration of the possible types of components
  ComponentVector.COMPONENT_TYPES = new Enumeration( [ 'X_COMPONENT', 'Y_COMPONENT' ] );

  return vectorAddition.register( 'ComponentVector', ComponentVector );
} );