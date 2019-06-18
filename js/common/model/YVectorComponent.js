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

      // In all cases, the yComponent is always matching the parent and the xComponent is 0
      this.yComponent = parentVector.yComponent;
      this.xComponent = 0;

      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {
          this.setTailXY( parentVector.tipX, parentVector.tailY );
          break;
        }
        case ComponentStyles.PARALLELOGRAM: {

          // shared tail position
          this.tail = parentVector.tail;
          break;
        }
        case ComponentStyles.ON_AXIS: {

          // same tail y, however its x value is 0 since it is on the y-axis
          this.tailY = parentVector.tailY;
          this.tailX = 0;
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

  return vectorAddition.register( 'YVectorComponent', YVectorComponent );
} );