// Copyright 2019-2023, University of Colorado Boulder

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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyles from '../model/ComponentVectorStyles.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorNode from './ComponentVectorNode.js';

export default class SumComponentVectorNode extends ComponentVectorNode {

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
    Multilink.multilink(
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
   * Handles visibility of sum component vectors.
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
      // sum is visible
      ( !!this.sumVisibleProperty && this.sumVisibleProperty.value ) &&
      // sum is defined
      componentVector.parentVector.isDefinedProperty.value
    );
  }
}

vectorAddition.register( 'SumComponentVectorNode', SumComponentVectorNode );