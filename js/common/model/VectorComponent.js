// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Vector Component. There are 2 types of components: the X Component and the Y Component.
 *
 * This is an abstract class, meaning that the it has methods that must sub-classes must implement.
 * Currently XVectorComponent and YVectorComponent extend this class.
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
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class VectorComponent extends BaseVectorModel {
    /**
     * @constructor
     * @param {VectorModel} parentVector - a vectorComponent is a component of a parentVector
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property of the style of components
     */
    constructor( parentVector, componentStyleProperty ) {

      // Type check arguments
      assert && assert( parentVector instanceof BaseVectorModel, `invalid parentVector: ${parentVector}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
        && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------

      super( parentVector.tail, 0, 0, parentVector.vectorGroup );

      // @public (read-only) {BaseVectorModel} parentVector - reference the parent vector
      this.parentVector = parentVector;

      // @private observe changes of the parent to update component (abstract)
      this.updateLayoutMultilink = Property.multilink( [
        componentStyleProperty,
        parentVector.tipPositionProperty,
        parentVector.tailPositionProperty
        // No need to listen to the modelViewTransformProperty since the parentVector will update its position when
        // modelViewTransformProperty changes
      ], ( componentStyle ) => {
        this.updateComponent( componentStyle );
      } );
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
     * @abstract
     * Updates the tail, and attributes vector (which will update the tip and magnitude) when the component style changes
     * or the parent's tail/tip changes
     * @param {ComponentStyles} componentStyle
     * @private
     */
    updateComponent( componentStyle ) {
      throw new Error( 'updateComponent must be implemented by sub-classes of VectorComponent' );
    }
  }

  return vectorAddition.register( 'VectorComponent', VectorComponent );
} );