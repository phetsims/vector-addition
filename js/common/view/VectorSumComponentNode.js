// Copyright 2019, University of Colorado Boulder

/**
 * View for a the component of the sum vector.
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
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );

  class VectorSumComponentNode extends VectorComponentNode {
    /**
     * @constructor
     * @param {VectorComponent} vectorComponent - the vector model for the component
     * @param {Graph} graph - the graph the component belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     */
    constructor( vectorComponent, graph, componentStyleProperty, valuesVisibleProperty, sumVisibleProperty, options ) {

      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        arrowOptions: null
      }, options );

      options.arrowOptions = _.extend( {
        tailWidth: 4.5,
        lineWidth: 0.2
      }, options.arrowOptions );

      //----------------------------------------------------------------------------------------

      super( vectorComponent, graph, componentStyleProperty, valuesVisibleProperty, options );

      // Create a new observer
      this.vectorObserver.dispose();
      
      // @private {Multilink} - observe when the sum visibility changes as well
      this.vectorObserver = Property.multilink(
        [ valuesVisibleProperty,
          vectorComponent.tailPositionProperty,
          vectorComponent.tipPositionProperty,
          componentStyleProperty,
          sumVisibleProperty ],
        ( valuesVisible ) => {
          
          // Update the appearance of the vector
          this.updateVector( vectorComponent,
            graph.modelViewTransformProperty.value,
            componentStyleProperty.value,
            sumVisibleProperty.value ); 
          
          // Update the appearance of the label
          this.updateLabelPositioning( vectorComponent, graph.modelViewTransformProperty.value, valuesVisible );
        } );
    }
    
    /**
     * Does the same as the super class, except handles the visibility based on the sum checkbox.
     * @param {VectorComponent} vectorComponent
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     * @param {boolean} sumVisible
     * @private
     */
    updateVector( vectorComponent, modelViewTransform, componentStyle, sumVisible ) {
      super.updateVector( vectorComponent, modelViewTransform, componentStyle );

      // SumVisible is not defined in superclass. Sum component is visible when both the sum is visible 
      // and component style isn't invisible
      this.visible = sumVisible ? sumVisible && componentStyle !== ComponentStyles.INVISIBLE : false;
    }

    /**
     * Double check to make sure vector sum components are never disposed
     * @public
     * @override
     */
    dispose() { assert && assert( false, 'Vector sum components are never disposed.' ); }
  }

  return vectorAddition.register( 'VectorSumComponentNode', VectorSumComponentNode );
} );