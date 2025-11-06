// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for the x-component or y-component of the resultant vector.
 *
 * Extends ComponentVectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on resultantVectorVisibleProperty
 *  - disables the ability to take the resultant vector off of the graph
 *
 * @author Brandon Li
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVector from '../model/ComponentVector.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import ResultantVector from '../model/ResultantVector.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorNode, { ComponentVectorNodeOptions } from './ComponentVectorNode.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';

type SelfOptions = EmptySelfOptions;
type SumComponentVectorNodeOptions = SelfOptions & ComponentVectorNodeOptions;

export default class ResultantComponentVectorNode extends ComponentVectorNode {

  private readonly resultantVectorVisibleProperty: TReadOnlyProperty<boolean>;

  public constructor( componentVector: ComponentVector,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      resultantVectorVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: SumComponentVectorNodeOptions ) {

    const options = optionize<SumComponentVectorNodeOptions, SelfOptions, ComponentVectorNodeOptions>()( {

      // ComponentVectorNodeOptions
      isDisposable: false,
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.RESULTANT_COMPONENT_VECTOR_ARROW_OPTIONS, {
        fill: componentVector.vectorColorPalette.sumComponentFillProperty
      } )
    }, providedOptions );

    super( componentVector, modelViewTransformProperty, selectedVectorProperty, componentVectorStyleProperty, valuesVisibleProperty, options );

    this.resultantVectorVisibleProperty = resultantVectorVisibleProperty;

    const resultantVector = componentVector.parentVector as ResultantVector;
    affirm( resultantVector instanceof ResultantVector, 'expected an instance of ResultantVector' );

    // Update when the resultant vector becomes visible or defined.
    Multilink.multilink(
      [ resultantVectorVisibleProperty, resultantVector.isDefinedProperty ],
      () => this.updateComponentVectorNode( componentVector, selectedVectorProperty.value,
        modelViewTransformProperty.value, componentVectorStyleProperty.value )
    );
  }

  /**
   * Overrides to handle visibility of the resultant vector's xy-component vectors.
   */
  protected override updateComponentVectorNode( componentVector: ComponentVector,
                                                selectedVector: Vector | null,
                                                modelViewTransform: ModelViewTransform2,
                                                componentVectorStyle: ComponentVectorStyle ): void {

    super.updateComponentVectorNode( componentVector, selectedVector, modelViewTransform, componentVectorStyle );

    const resultantVector = componentVector.parentVector as ResultantVector;
    affirm( resultantVector instanceof ResultantVector, 'expected an instance of ResultantVector' );

    this.visible = (
      // components are visible
      ( componentVectorStyle !== 'invisible' ) &&
      // resultant vector is visible
      ( !!this.resultantVectorVisibleProperty && this.resultantVectorVisibleProperty.value ) &&
      // resultant vector is defined
      resultantVector.isDefinedProperty.value
    );
  }
}

vectorAddition.register( 'ResultantComponentVectorNode', ResultantComponentVectorNode );