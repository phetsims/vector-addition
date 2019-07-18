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
 *    - Updates its tail position based on the component style property.
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

  // rounding for the vector value (on the label with values checked)
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;


  class ComponentVector extends RootVector {

    /**
     * @param {Vector} parentVector - the vector to which the component is associated with
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - Property of the style of components
     * @param {Property.<Vector|null>} activeVectorProperty
     * @param {Enumeration} componentType (see ComponentVector.COMPONENT_TYPES)
     */
    constructor( parentVector, componentStyleProperty, activeVectorProperty, componentType ) {

      assert && assert( parentVector instanceof RootVector, `invalid parentVector: ${parentVector}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( activeVectorProperty instanceof Property,
        `invalid activeVectorProperty: ${activeVectorProperty}` );
      assert && assert( ComponentVector.COMPONENT_TYPES.includes( componentType ),
        `invalid componentType: ${componentType}` );
      //----------------------------------------------------------------------------------------

      // Vector components don't have a symbol.
      const componentSymbol = null;

      super( parentVector.tail, Vector2.ZERO, parentVector.vectorGroup, componentSymbol );

      //----------------------------------------------------------------------------------------
      // Create references

      // @public (read-only) {Enumeration} componentType
      this.componentType = componentType;

      // @public {RootVector} parentVector - reference the parent vector
      this.parentVector = parentVector;

      // @private {Multilink} updateLayoutMultilink - observe changes of the parent's tail, tip, and components. When
      // the parent changes, the component also changes.
      // No need to listen to the modelViewTransformProperty since the parentVector will update its position when
      // modelViewTransformProperty changes
      this.updateLayoutMultilink = Property.multilink( [
          componentStyleProperty,
          parentVector.tipPositionProperty,
          parentVector.tailPositionProperty ],
        ( componentStyle ) => { this.updateComponent( componentStyle ); } );
    }

    /**
     * Disposes the vector component. Called when the parent vector is disposed.
     * @public
     */
    dispose() {
      this.updateLayoutMultilink.dispose();
    }

    /**
     * Updates the component vector to match the parent vector.
     * @private
     *
     * @param {ComponentStyles} componentStyle
     */
    updateComponent( componentStyle ) {

      if ( this.componentType === ComponentVector.COMPONENT_TYPES.X_COMPONENT ) {

        // Triangle and Parallelogram are the same for x component
        if ( componentStyle === ComponentStyles.TRIANGLE || componentStyle === ComponentStyles.PARALLELOGRAM ) {

          // Shared tail position as parent
          this.tail = this.parentVector.tail;
          this.setTipXY( this.parentVector.tipX, this.parentVector.tailY );
        }
        else if ( componentStyle === ComponentStyles.ON_AXIS ) {

          // Same tailX, however its y value is 0 since it is on the x-axis
          this.setTailXY( this.parentVector.tailX, 0 );
          this.setTipXY( this.parentVector.tipX, 0 );
        }
      }
      else if ( this.componentType === ComponentVector.COMPONENT_TYPES.Y_COMPONENT ) {

        if ( componentStyle === ComponentStyles.TRIANGLE ) {

          // Creates the triangle, tipX to parent tail
          this.setTailXY( this.parentVector.tipX, this.parentVector.tailY );
          this.tip = this.parentVector.tip;
        }
        else if ( componentStyle === ComponentStyles.PARALLELOGRAM ) {

          // Shared tail position as parent
          this.tail = this.parentVector.tail;
          this.setTipXY( this.parentVector.tailX, this.parentVector.tipY );
        }
        else if ( componentStyle === ComponentStyles.ON_AXIS ) {

          // Same tailY, however its x value is 0 since it is on the y-axis
          this.setTailXY( 0, this.parentVector.tailY );
          this.setTipXY( 0, this.parentVector.tipY );
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
     *    coefficient: {string|null} // the coefficient (e.g. if the label displayed '3|v|=15', the coefficient would be
     *                               // 3). Null means it doesn't display a coefficient
     *    symbol: {string|null} // the symbol (e.g. if the label displayed '3|v|=15', the symbol would be '|v|')
     *                       // Null means it doesn't display a symbol
     *    value: {string|null} // the suffix (e.g. if the label displayed '3|v|=15', the value would be '=15')
     *                         // Null means it doesn't display a value
     * }
     */
    getLabelContent( valuesVisible ) {

      // Get the component value, which can be negative and depends on the type of component
      const componentValue = this.componentType === ComponentVector.COMPONENT_TYPES.X_COMPONENT ?
                             this.vectorComponents.x :
                             this.vectorComponents.y;

      // Round the component value
      const roundedComponentValue = Util.toFixed( componentValue, VECTOR_VALUE_ROUNDING );

      // Since components don't have symbols, it never has a prefix. Components only show components if and only
      // if the values are visible and if the component isn't of 0 length.
      return {
        coefficient: null, // components never have a coefficient
        symbol: null, // components never have a symbol
        value: valuesVisible && Math.abs( roundedComponentValue ) > 0 ? roundedComponentValue : null
      };
    }
  }

  // @public {Enumeration} - the possible types of components
  ComponentVector.COMPONENT_TYPES = new Enumeration( [ 'X_COMPONENT', 'Y_COMPONENT' ] );

  return vectorAddition.register( 'ComponentVector', ComponentVector );
} );