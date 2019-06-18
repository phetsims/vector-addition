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

      // In all cases, the xComponent is always matching the parent and the yComponent is 0
      this.xComponent = parentVector.xComponent;
      this.yComponent = 0;

      // switch case to update the tail position of the component based on component style
      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {

          // shared tail position
          this.tail = parentVector.tail;
          break;
        }
        case ComponentStyles.PARALLELOGRAM: {

          // shared tail position
          this.tail = parentVector.tail;
          break;
        }
        case ComponentStyles.ON_AXIS: {

          // same tail x, however its y value is 0 since it is on the x-axis
          this.tailX = parentVector.tailX;
          this.tailY = 0;
          break;
        }
        case ComponentStyles.INVISIBLE: {
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