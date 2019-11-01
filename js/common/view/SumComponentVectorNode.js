// Copyright 2019, University of Colorado Boulder

/**
 * View for the component of the sum vector.
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
  const ComponentVectorStyles = require( 'VECTOR_ADDITION/common/model/ComponentVectorStyles' );
  const ComponentVectorNode = require( 'VECTOR_ADDITION/common/view/ComponentVectorNode' );
  const merge = require( 'PHET_CORE/merge' );
  const Property = require( 'AXON/Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  class SumComponentVectorNode extends ComponentVectorNode {

    /**
     * @param {ComponentVector} componentVector - the vector model for the component
     * @param {Graph} graph - the graph the component belongs to
     * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
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

      options = merge( {
        arrowOptions: merge( {}, VectorAdditionConstants.SUM_COMPONENT_VECTOR_ARROW_OPTIONS, {
          fill: componentVector.vectorColorPalette.sumComponentFill
        } )
      }, options );

      super( componentVector, graph, componentStyleProperty, valuesVisibleProperty, options );

      // @private {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = sumVisibleProperty;

      // Update when the sum becomes visible or defined.
      // unlink is unnecessary, exists for the lifetime of the sim.
      Property.multilink(
        [ sumVisibleProperty, componentVector.parentVector.isDefinedProperty ],
        () => this.updateComponentVector( componentVector,
          graph.modelViewTransformProperty.value,
          componentStyleProperty.value,
          componentVector.isParentVectorActiveProperty.value )
      );
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
     * @param {ComponentVector} componentVector
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentVectorStyles} componentStyle
     * @param {boolean} isParentActive
     */
    updateComponentVector( componentVector, modelViewTransform, componentStyle, isParentActive ) {
      super.updateComponentVector( componentVector, modelViewTransform, componentStyle, isParentActive );

      this.visible = (
        // components are visible
        ( componentStyle !== ComponentVectorStyles.INVISIBLE ) &&
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