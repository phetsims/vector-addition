// Copyright 2019, University of Colorado Boulder

/**
 * ComponentVector is the model of a component vector. It is a vector (not a scalar) that describes the x or y
 * component of some parent vector.  For instance, if parent vector 'a' is <5, 6>, then its x component vector
 * is <5, 0>, and its y component vector is <0, 6>.
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
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Property = require( 'AXON/Property' );
  const RootVector = require( 'VECTOR_ADDITION/common/model/RootVector' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants
  const COMPONENT_VECTOR_SYMBOL = null; // Component vectors don't have a symbol

  class ComponentVector extends RootVector {

    /**
     * @param {Vector} parentVector - the vector that this component vector is associated with
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Property.<Vector|null>} activeVectorProperty - which vector is active (selected)
     * @param {Enumeration} componentType - type of component vector (x or y), see ComponentVector.ComponentTypes
     */
    constructor( parentVector, componentStyleProperty, activeVectorProperty, componentType ) {

      assert && assert( componentStyleProperty instanceof EnumerationProperty && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( activeVectorProperty instanceof Property, `invalid activeVectorProperty: ${activeVectorProperty}` );
      assert && assert( ComponentVector.ComponentTypes.includes( componentType ), `invalid componentType: ${componentType}` );

      super( parentVector.tail, Vector2.ZERO, parentVector.vectorColorPalette, COMPONENT_VECTOR_SYMBOL );

      //----------------------------------------------------------------------------------------
      // Create references

      // @public (read-only) {Enumeration} componentType - type of component vector (x or y)
      this.componentType = componentType;

      // @public (read-only) {BooleanProperty} isOnGraphProperty - matches the parent. When the parent is on the graph,
      //                                                           the component is also on the graph (and vise versa).
      this.isOnGraphProperty = parentVector.isOnGraphProperty;

      // @public (read-only) {Vector} parentVector - private reference to the parent vector
      this.parentVector = parentVector;

      // @public (read-only) {DerivedProperty.<boolean>} isParentVectorActiveProperty - determines if the parent
      // vector is active.
      this.isParentVectorActiveProperty = new DerivedProperty( [ activeVectorProperty ], activeVector => {
        return activeVector && ( activeVector === parentVector );
      } );

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
        this.isParentVectorActiveProperty.dispose();
      };
    }

    /**
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

      if ( this.componentType === ComponentVector.ComponentTypes.X_COMPONENT ) {

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
      else if ( this.componentType === ComponentVector.ComponentTypes.Y_COMPONENT ) {

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
     * Gets the label content information to be displayed on the vector.
     * See RootVector.getLabelContent for details.
     * @override
     * @public
     * @param {boolean} valuesVisible - whether the values are visible
     * @returns {Object} see RootVector.getLabelContent
     */
    getLabelContent( valuesVisible ) {

      // Get the component vector's value (a scalar, possibly negative)
      let value = ( this.componentType === ComponentVector.ComponentTypes.X_COMPONENT ) ?
                  this.vectorComponents.x :
                  this.vectorComponents.y;

      // Round the value
      value = Util.toFixed( value, VectorAdditionConstants.VECTOR_VALUE_ROUNDING );

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
     * @public
     * @returns {Vector2}
     */
    get midPoint() { return this.vectorComponents.timesScalar( 0.5 ).plus( this.tail ); }

    /**
     * Gets the parent vector's tail position
     * @public
     * @returns {Vector2}
     */
    get parentTail() { return this.parentVector.tail; }

    /**
     * Gets the parent vector's tip position
     * @public
     * @returns {Vector2}
     */
    get parentTip() { return this.parentVector.tip; }

    /**
     * Gets the parent vector's mid-point position
     * @public
     * @returns {Vector2}
     */
    get parentMidPoint() {
      return this.parentVector.vectorComponents.timesScalar( 0.5 ).plus( this.parentVector.tail );
    }
  }

  // @public (read-only) {Enumeration} ComponentTypes - Enumeration of the possible types of components
  ComponentVector.ComponentTypes = new Enumeration( [ 'X_COMPONENT', 'Y_COMPONENT' ] );

  return vectorAddition.register( 'ComponentVector', ComponentVector );
} );