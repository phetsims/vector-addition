// Copyright 2019, University of Colorado Boulder

/**
 * Model for a Y Vector Component.
 * 
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' ); 
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorComponent = require( 'VECTOR_ADDITION/common/model/VectorComponent' );


  class YVectorComponent extends VectorComponent {
    /**
     * Update the tail, and attributes vector (which will update the tip and magnitude)
     * @override
     * @param {VectorModel} parentVector - a vectorComponent is a component of a parentVector
     * @param {ComponentStyles} componentStyle 
     */
    updateComponent( parentVector, componentStyle ) {

       // convenience variables for the tail and tip positions of the parent
      const parentTailPosition = parentVector.tailPositionProperty.value;
      const parentTipPosition = parentVector.tipPositionProperty.value;
      const parentAttributes = parentVector.attributesVectorProperty.value;

      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {
          // start from the tip X, and go Vertically to the tip
          this.tailPositionProperty.value = new Vector2( parentTipPosition.x, parentTailPosition.y );
          this.attributesVectorProperty.value = new Vector2( 0, parentAttributes.y );
          break;
        }
        case ComponentStyles.PARALLELOGRAM: {
          // start from the tail, and go Vertically to the tip Y
          this.tailPositionProperty.value = parentTailPosition;
          this.attributesVectorProperty.value = new Vector2( 0, parentAttributes.y );
          break;
        }
        case ComponentStyles.ON_AXIS: {        
          // start from the tail y, but on the y-axis, and go vertically to the tip y
          this.tailPositionProperty.value = new Vector2( 0, parentTailPosition.y );
          this.attributesVectorProperty.value = new Vector2( 0, parentAttributes.y );
          break;
        }
        default: {
          throw new Error( `invalid componentStyle: ${componentStyle}` );
        }
      }
    }
  }

  return vectorAddition.register( 'YVectorComponent', YVectorComponent );
} );