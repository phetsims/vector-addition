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
      
      // @public (read-only)
      this.componentType = VectorComponent.Types.Y_COMPONENT;

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

  return vectorAddition.register( 'YVectorComponent', YVectorComponent );
} );