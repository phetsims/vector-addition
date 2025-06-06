// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for the component of the sum vector.
 *
 * Extends ComponentVectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on the sumVisibleProperty
 *  - disables the ability to take the sum vector off of the graph
 *
 * @author Brandon Li
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVector from '../model/ComponentVector.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import SumVector from '../model/SumVector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorNode, { ComponentVectorNodeOptions } from './ComponentVectorNode.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';

type SelfOptions = EmptySelfOptions;
type SumComponentVectorNodeOptions = SelfOptions & ComponentVectorNodeOptions;

export default class SumComponentVectorNode extends ComponentVectorNode {

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
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.SUM_COMPONENT_VECTOR_ARROW_OPTIONS, {
        fill: componentVector.vectorColorPalette.sumComponentFill
      } )
    }, providedOptions );

    super( componentVector, scene, componentVectorStyleProperty, valuesVisibleProperty, options );

    this.sumVisibleProperty = sumVisibleProperty;

    const sumVector = componentVector.parentVector as SumVector;
    assert && assert( sumVector instanceof SumVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

    // Update when the sum becomes visible or defined.
    Multilink.multilink(
      [ sumVisibleProperty, sumVector.isDefinedProperty ],
      () => this.updateComponentVector( componentVector,
        scene.graph.modelViewTransformProperty.value,
        componentVectorStyleProperty.value,
        componentVector.isParentVectorActiveProperty.value )
    );
  }

  /**
   * Handles visibility of sum component vectors.
   */
  protected override updateComponentVector( componentVector: ComponentVector, modelViewTransform: ModelViewTransform2,
                                            componentVectorStyle: ComponentVectorStyle, isParentActive: boolean ): void {
    super.updateComponentVector( componentVector, modelViewTransform, componentVectorStyle, isParentActive );

    const sumVector = componentVector.parentVector as SumVector;
    assert && assert( sumVector instanceof SumVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

    this.visible = (
      // components are visible
      ( componentVectorStyle !== 'invisible' ) &&
      // sum is visible
      ( !!this.sumVisibleProperty && this.sumVisibleProperty.value ) &&
      // sum is defined
      sumVector.isDefinedProperty.value
    );
  }
}

vectorAddition.register( 'SumComponentVectorNode', SumComponentVectorNode );