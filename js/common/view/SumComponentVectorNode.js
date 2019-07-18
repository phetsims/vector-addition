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
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  class SumComponentVectorNode extends ComponentVectorNode {
    /**
     * @param {VectorComponent} vectorComponentModel - the vector model for the component
     * @param {Graph} graph - the graph the component belongs to
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} sumVisibleProperty
     * @param {Object} [options]
     */
    constructor( vectorComponentModel,
                 graph,
                 componentStyleProperty,
                 valuesVisibleProperty,
                 sumVisibleProperty,
                 options ) {

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

      super( vectorComponentModel, graph, componentStyleProperty, valuesVisibleProperty, options );

      // @private {BooleanProperty} sumVisibleProperty
      this.sumVisibleProperty = sumVisibleProperty;

      // Observe when the sum visibility to update the vector component.
      // Doesn't need to be unlinked since vector sums are never disposed.
      sumVisibleProperty.link( () => {

        this.updateVectorComponent( vectorComponentModel,
          graph.modelViewTransformProperty.value,
          componentStyleProperty.value );

      } );
    }

    /**
     * Handles visibility base on the sum visibility
     * @private
     *
     * @param {vectorComponentModel} vectorComponentModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ComponentStyles} componentStyle
     */
    updateVectorComponent( vectorComponentModel, modelViewTransform, componentStyle ) {
      super.updateVectorComponent( vectorComponentModel, modelViewTransform, componentStyle );

      // SumVisible is not defined in superclass. Sum component is visible when both the sum is visible
      // and component style isn't invisible
      this.visible = this.sumVisibleProperty ?
                     this.sumVisibleProperty.value && componentStyle !== ComponentStyles.INVISIBLE :
                     false;
    }

    /**
     * Double check to make sure vector sum components are never disposed
     * @public
     * @override
     */
    dispose() { assert && assert( false, 'Vector sum components are never disposed.' ); }
  }

  return vectorAddition.register( 'SumComponentVectorNode', SumComponentVectorNode );
} );