// Copyright 2019, University of Colorado Boulder

/**
 * View for a the component of the sum vector
 *
 * Listens to a SumVisibleProperty to determine visibility.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const Multilink = require( 'AXON/Multilink' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );

  class VectorSumComponentNode extends VectorComponentNode {
    /**
     * @constructor
     * @param {VectorComponent} vectorComponent - the vector model for the component
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     */
    constructor( vectorComponent,
      modelViewTransformProperty,
      componentStyleProperty,
      valuesVisibleProperty,
      sumVisibleProperty
    ) {

      // Type check unique arguments
      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );

      //----------------------------------------------------------------------------------------

      super( vectorComponent, modelViewTransformProperty, componentStyleProperty, valuesVisibleProperty, {
        arrowOptions: {
          tailWidth: 4.5,
          lineWidth: 0.5
        }
      } );
        
      // Create a new observer
      this.vectorObserver.dispose();
      
      // @private {Multilink}
      this.vectorObserver = new Multilink(
        [ valuesVisibleProperty,
          vectorComponent.tailPositionProperty,
          vectorComponent.tipPositionProperty,
          componentStyleProperty,
          sumVisibleProperty ],
        ( valuesVisible ) => {
          
          // Update the appearance of the vector
          this.updateVector( vectorComponent,
            modelViewTransformProperty.value,
            componentStyleProperty.value,
            sumVisibleProperty.value ); 
          
          // Update the appearance of the label
          this.updateLabelPositioning( vectorComponent, modelViewTransformProperty.value, valuesVisible );
        } );

    }
    
    /**
     * Does the same as the super class, except handles the visibility based on the sum checkbox
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     * @param {boolean} sumVisible
     * @private
     */
    updateVector( vectorComponent, modelViewTransform, componentStyle, sumVisible ) {
      super.updateVector( vectorComponent, modelViewTransform, componentStyle );

      if ( sumVisible ) {
        this.visible = true;

        if ( componentStyle === ComponentStyles.INVISIBLE ) {
          this.visible = false;
        }
      }
      else {
        this.visible = false;
      }
    }
  }

  return vectorAddition.register( 'VectorSumComponentNode', VectorSumComponentNode );
} );