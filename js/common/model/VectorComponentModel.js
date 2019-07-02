// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Vector Component. There are 2 types of components: the X Component and the Y Component. The positioning
 * for these components are slightly different.
 *
 * This is designed to be a component of a parent vector. For instance, if vector 'a' were to be <5, 5>, its x
 * component would be <5, 0>. This component's 'parent vector' would be vector 'a'.
 *
 * This vector component updates its tail/tip based on the:
 *  1. The component style
 *  2. Parent vector's changing tail/tip/components
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Property = require( 'AXON/Property' );
  const Util = require( 'DOT/Util' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  // constants

  // Rounding on the label with values on
  const VECTOR_VALUE_ROUNDING = VectorAdditionConstants.VECTOR_VALUE_ROUNDING;

  class VectorComponentModel extends BaseVectorModel {
    /**
     * @constructor
     * @param {VectorModel} parentVector - the vector to which the component is associated
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property of the style of components
     * @param {Property.<VectorModel|null>} activeVectorProperty
     * @param {Enumeration} componentType (see VectorComponentModel.COMPONENT_TYPES)
     */
    constructor( parentVector, componentStyleProperty, activeVectorProperty, componentType ) {

      // Type check arguments
      assert && assert( parentVector instanceof BaseVectorModel, `invalid parentVector: ${parentVector}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( activeVectorProperty instanceof Property,
        `invalid activeVectorProperty: ${activeVectorProperty}` );
      assert && assert( VectorComponentModel.COMPONENT_TYPES.includes( componentType ),
        `invalid componentType: ${componentType}` );
      //----------------------------------------------------------------------------------------

      // Vector components don't have a tag.
      const componentTag = null;

      super( parentVector.tail, 0, 0, parentVector.vectorGroup, componentTag );

      // @public (read-only)
      this.componentType = componentType;

      // @private {Property.<VectorModel|null>}
      this.activeVectorProperty = activeVectorProperty;

      // @public {BaseVectorModel} parentVector - reference the parent vector
      this.parentVector = parentVector;

      // @private observe changes of the parent to update component.
      // No need to listen to the modelViewTransformProperty since the parentVector will update its position when
      // modelViewTransformProperty changes
      this.updateLayoutMultilink = Property.multilink( [
          componentStyleProperty,
          parentVector.tipPositionProperty,
          parentVector.tailPositionProperty ],
        ( componentStyle ) => { this.updateComponent( componentStyle ); } );
    }

    /**
     * Disposes the vector component
     * @public
     * @override
     */
    dispose() {
      this.updateLayoutMultilink.dispose();
      super.dispose();
    }

    /**
     * Updates the tail, and components vector (which will update the tip and magnitude) when the component style
     * changes or the parent's tail/tip changes
     * @param {ComponentStyles} componentStyle
     * @private
     */
    updateComponent( componentStyle ) {
      if ( this.componentType === VectorComponentModel.COMPONENT_TYPES.X_COMPONENT ) {

        /*---------------------------------------------------------------------------*
         * X Component positioning
         *---------------------------------------------------------------------------*/
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
      else if ( this.componentType === VectorComponentModel.COMPONENT_TYPES.Y_COMPONENT ) {

        /*---------------------------------------------------------------------------*
         * Y Component positioning
         *---------------------------------------------------------------------------*/
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
     * See BaseVectorModel.getLabelContent() for documentation and context
     *
     * Gets the label content information to display the vector component. Vector components don't have tags
     * and only show their component (which can be negative) when values are visible
     *
     * @param {boolean} valuesVisible - if the values are visible (determined by the values checkbox)
     * @returns {object} {
     *    prefix: {string|null} // the prefix (e.g. if the label displayed |v|=15, the prefix would be '|v|')
     *    value: {string|null} // the suffix (e.g. if the label displayed |v|=15, the value would be '=15')
     * }
     */
    getLabelContent( valuesVisible ) {

      // Get the component value, which can be negative and depends on the type of component
      const componentValue = this.componentType === VectorComponentModel.COMPONENT_TYPES.X_COMPONENT ?
                             this.vectorComponents.x :
                             this.vectorComponents.y;

      // Round the component value
      const roundedComponentValue = Util.toFixed( componentValue, VECTOR_VALUE_ROUNDING );

      // Since components don't have tags, it never has a prefix. Components only show components if and only
      // if the values are visible and if the component isn't of 0 length
      return {
        prefix: null,
        value: valuesVisible && Math.abs( roundedComponentValue ) > 0 ? roundedComponentValue : null
      };
    }
  }

  // @public {Enumeration} - the possible types of components
  VectorComponentModel.COMPONENT_TYPES = new Enumeration( [ 'X_COMPONENT', 'Y_COMPONENT' ] );

  return vectorAddition.register( 'VectorComponentModel', VectorComponentModel );
} );