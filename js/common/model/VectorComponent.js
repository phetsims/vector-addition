// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Vector Component. There are 2 types of components: the X Component and the Y Component. The positioning
 * for these components are slightly different.
 *
 * This is designed to be a component of a parent vector.
 *
 * This vector component updates its tail/tip based on the:
 *  1. The component style enumeration property
 *  2. Parent vector's changing tail/tip
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
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorComponent extends BaseVectorModel {
    /**
     * @constructor
     * @param {VectorModel} parentVector - the vector to which the component are associated
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property of the style of components
     * @param {Enumeration} componentType (see VectorComponent.COMPONENT_TYPES)
     */
    constructor( parentVector, componentStyleProperty, componentType ) {

      // Type check arguments
      assert && assert( parentVector instanceof BaseVectorModel, `invalid parentVector: ${parentVector}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( VectorComponent.COMPONENT_TYPES.includes( componentType ),
        `invalid componentType: ${componentType}` );
      //----------------------------------------------------------------------------------------

      super( parentVector.tail, 0, 0, parentVector.vectorGroup );

      // @public (read-only)
      this.componentType = componentType;

      // @public (read-only) {BaseVectorModel} parentVector - reference the parent vector
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
     * Updates the tail, and attributes vector (which will update the tip and magnitude) when the component style
     * changes or the parent's tail/tip changes
     * @param {ComponentStyles} componentStyle
     * @private
     */
    updateComponent( componentStyle ) {
      if ( this.componentType === VectorComponent.COMPONENT_TYPES.X_COMPONENT ) {

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
      else if ( this.componentType === VectorComponent.COMPONENT_TYPES.Y_COMPONENT ) {

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
  }

  // @public {Enumeration} - the possible types of components
  VectorComponent.COMPONENT_TYPES = new Enumeration( [ 'X_COMPONENT', 'Y_COMPONENT' ] );

  return vectorAddition.register( 'VectorComponent', VectorComponent );
} );