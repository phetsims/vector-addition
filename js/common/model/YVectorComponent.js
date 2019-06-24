// Copyright 2019, University of Colorado Boulder

/**
 * Model for a vector's y component, which is also a vector.
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
     * @override
     * Updates the tail, and attributes vector (which will update the tip and magnitude) when the component style changes
     * or the parent's tail/tip changes
     * @param {ComponentStyles} componentStyle
     * @private
     */
    updateComponent( componentStyle ) {

      // In all cases, the yComponent is always matching the parent and the xComponent is 0
      this.yComponent = this.parentVector.yComponent;
      this.xComponent = 0;

      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {

          // Creates the triangle, tipX to tailY
          this.setTailXY( this.parentVector.tipX, this.parentVector.tailY );
          break;
        }
        case ComponentStyles.PARALLELOGRAM: {

          // Shared tail position as parent
          this.tail = this.parentVector.tail;
          break;
        }
        case ComponentStyles.ON_AXIS: {

          // Same tailY, however its x value is 0 since it is on the y-axis
          this.tailY = this.parentVector.tailY;
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