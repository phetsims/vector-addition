// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for the x-component or y-component of the resultant vector.
 *
 * Extends ComponentVectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on the sumVisibleProperty
 *  - disables the ability to take the resultant vector off of the graph
 *
 * @author Brandon Li
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVector from '../model/ComponentVector.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorNode, { ComponentVectorNodeOptions } from './ComponentVectorNode.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ResultantVector from '../model/ResultantVector.js';

type SelfOptions = EmptySelfOptions;
type SumComponentVectorNodeOptions = SelfOptions & ComponentVectorNodeOptions;

//TODO rename ResultantComponentVectorNode https://github.com/phetsims/vector-addition/issues/334
export default class ResultantComponentVectorNode extends ComponentVectorNode {

  private readonly sumVisibleProperty: TReadOnlyProperty<boolean>;

  public constructor( componentVector: ComponentVector,
                      scene: VectorAdditionScene,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      sumVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: SumComponentVectorNodeOptions ) {

    const options = optionize<SumComponentVectorNodeOptions, SelfOptions, ComponentVectorNodeOptions>()( {

      // ComponentVectorNodeOptions
      isDisposable: false,
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.RESULTANT_COMPONENT_VECTOR_ARROW_OPTIONS, {
        fill: componentVector.vectorColorPalette.sumComponentFillProperty
      } )
    }, providedOptions );

    super( componentVector, scene, componentVectorStyleProperty, valuesVisibleProperty, options );

    this.sumVisibleProperty = sumVisibleProperty;

    const resultantVector = componentVector.parentVector as ResultantVector;
    affirm( resultantVector instanceof ResultantVector );

    // Update when the resultant vector becomes visible or defined.
    Multilink.multilink(
      [ sumVisibleProperty, resultantVector.isDefinedProperty ],
      () => this.updateComponentVector( componentVector,
        scene.graph.modelViewTransformProperty.value,
        componentVectorStyleProperty.value,
        scene.selectedVectorProperty.value === componentVector.parentVector )
    );
  }

  /**
   * Handles visibility of xy-component vectors.
   */
  protected override updateComponentVector(
    componentVector: ComponentVector, modelViewTransform: ModelViewTransform2,
    componentVectorStyle: ComponentVectorStyle, isParentVectorSelected: boolean ): void {

    super.updateComponentVector( componentVector, modelViewTransform, componentVectorStyle, isParentVectorSelected );

    const resultantVector = componentVector.parentVector as ResultantVector;
    affirm( resultantVector instanceof ResultantVector );

    this.visible = (
      // components are visible
      ( componentVectorStyle !== 'invisible' ) &&
      // sum is visible
      ( !!this.sumVisibleProperty && this.sumVisibleProperty.value ) &&
      // resultant vector is defined
      resultantVector.isDefinedProperty.value
    );
  }
}

vectorAddition.register( 'ResultantComponentVectorNode', ResultantComponentVectorNode );