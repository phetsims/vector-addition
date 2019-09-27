// Copyright 2019, University of Colorado Boulder

/**
 * View for a the component of the sum vector.
 *
 * Extends ComponentVectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on the sumVisibleProperty
 *  - disables ability to take the sum vector node off of the graph
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const ComponentVectorNode = require( 'VECTOR_ADDITION/common/view/ComponentVectorNode' );
  const merge = require( 'PHET_CORE/merge' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  class SumComponentVectorNode extends ComponentVectorNode {

    /**
     * @param {ComponentVector} componentVector - the vector model for the component
     * @param {Graph} graph - the graph the component belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {Object} [options]
     */
    constructor( componentVector,
                 graph,
                 componentStyleProperty,
                 valuesVisibleProperty,
                 sumVisibleProperty,
                 options ) {

      assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = merge( {
        arrowOptions: _.extend( {}, VectorAdditionConstants.SUM_COMPONENT_VECTOR_ARROW_OPTIONS, {
          fill: componentVector.vectorColorPalette.sumComponentFill
        } )
      }, options );

      //----------------------------------------------------------------------------------------

      super( componentVector, graph, componentStyleProperty, valuesVisibleProperty, options );

      // @private {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = sumVisibleProperty;

      // Observe when the sum visibility to update the vector component.
      // Doesn't need to be unlinked since sum vectors are never disposed.
      sumVisibleProperty.link( () => {

        this.updateComponentVector( componentVector,
          graph.modelViewTransformProperty.value,
          componentStyleProperty.value,
          componentVector.isParentVectorActiveProperty );

      } );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'SumComponentVectorNode is not intended to be disposed.' );
    }

    /**
     * Handles visibility base on the sum visibility
     * @private
     *
     * @param {ComponentVector} componentVector
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     * @param {boolean} isParentActive
     */
    updateComponentVector( componentVector, modelViewTransform, componentStyle, isParentActive ) {
      super.updateComponentVector( componentVector, modelViewTransform, componentStyle, isParentActive );

      this.visible = (
        // components are visible
        ( componentStyle !== ComponentStyles.INVISIBLE ) &&
        // component magnitude is not 0
        ( componentVector.magnitude !== 0 ) &&
        // sum is visible
        ( !!this.sumVisibleProperty && this.sumVisibleProperty.value ) &&
        // sum is defined
        componentVector.parentVector.isDefinedProperty.value
      );
    }
  }

  return vectorAddition.register( 'SumComponentVectorNode', SumComponentVectorNode );
} );