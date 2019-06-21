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
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorModel = require( 'VECTOR_ADDITION/common/model/BaseVectorModel' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // @abstract
  class VectorComponent extends BaseVectorModel {
    /**
     * @constructor
     * @param {VectorModel} parentVector - a vectorComponent is a component of a parentVector
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty - property of the style of components
     */
    constructor( parentVector, componentStyleProperty ) {

      // Type check arguments
      assert && assert( componentStyleProperty instanceof EnumerationProperty,
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------

      super( parentVector.tailPositionProperty.value, 0, 0, parentVector.vectorType );

      // @private observe changes of the parent to update component (abstract)
      this.updateLayoutMultilink = Property.multilink( [
          componentStyleProperty,
          parentVector.attributesVectorProperty,
          parentVector.tailPositionProperty
          // No need to listen to the modelViewTransformProperty since the parentVector will update its position when 
          // modelViewTransformProperty changes
        ], ( componentStyle ) => {
          this.updateComponent( parentVector, componentStyle );
        }
      );

      // @public (read-only) reference to the parent vector
      this.parentVector = parentVector;
    }

    /**
     * Dispose of the vector
     * @public
     * @override
     */
    dispose() {
      this.updateLayoutMultilink.dispose();
      super.dispose();
    }

    /**
     * Update the tail, and attributes vector (which will update the tip and magnitude)
     * @param {VectorModel} parentVector - a vectorComponent is a component of a parentVector
     * @param {ComponentStyles} componentStyle
     * @abstract
     * @private
     */
    updateComponent( parentVector, componentStyle ) {
      throw new Error( 'Update Component must be implemented by sub-classes of VectorComponent' );
    }
  }

  return vectorAddition.register( 'VectorComponent', VectorComponent );
} );