// Copyright 2019, University of Colorado Boulder

/**
 * Model for a X Vector Component.
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


  class XVectorComponent extends VectorComponent {
    /**
     * Update the tail, and attributes vector (which will update the tip and magnitude)
     * @override
     * @param {VectorModel} parentVector - a vectorComponent is a component of a parentVector
     * @param {ComponentStyles} componentStyle 
     */
    updateComponent( parentVector, componentStyle ) {

       // convenience variables for the tail and tip positions of the parent
      const parentTailPosition = parentVector.tailPositionProperty.value;

      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {
          // start from the tail, and go horizontally to the tip
          this.tailPositionProperty.value = parentTailPosition;
          this.xMagnitude = parentVector.xMagnitude;
          break;
        }
        case ComponentStyles.PARALLELOGRAM: {
          // start from the tail, and go horizontally to the tip
          this.tailPositionProperty.value = parentTailPosition;
          this.xMagnitude = parentVector.xMagnitude;
          break;
        }
        case ComponentStyles.ON_AXIS: {        
          // start from the tail, but on the x-axis, and go horizontally to the tip
          this.tailPositionProperty.value = new Vector2( parentTailPosition.x, 0 );
          this.xMagnitude = parentVector.xMagnitude;
          break;
        }
        default: {
          throw new Error( `invalid componentStyle: ${componentStyle}` );
        }
      }
    }
  }

  return vectorAddition.register( 'XVectorComponent', XVectorComponent );
} );