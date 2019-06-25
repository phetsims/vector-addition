// Copyright 2019, University of Colorado Boulder

/**
 * Model for a vector's x component, which is also a vector.
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
     * @override
     * Updates the tail, and attributes vector (which will update the tip and magnitude) when the component style changes
     * or the parent's tail/tip changes
     * @param {ComponentStyles} componentStyle
     * @private
     */
    updateComponent( componentStyle ) {

      switch( componentStyle ) {
        case ComponentStyles.TRIANGLE: {

          // Shared tail position as parent
          this.tail = this.parentVector.tail;
          this.setTipXY( this.parentVector.tip.x, this.parentVector.tailY );
          break;
        }
        case ComponentStyles.PARALLELOGRAM: {

          // Shared tail position as parent
          this.tail = this.parentVector.tail;
          this.setTipXY( this.parentVector.tip.x, this.parentVector.tailY );
          break;
        }
        case ComponentStyles.ON_AXIS: {

          // Same tailX, however its y value is 0 since it is on the x-axis
          this.setTailXY( this.parentVector.tailX, 0 );
          this.setTipXY( this.parentVector.tip.x, 0 );
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