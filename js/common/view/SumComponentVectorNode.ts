// Copyright 2019-2024, University of Colorado Boulder

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

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVector from '../model/ComponentVector.js';
import ComponentVectorStyles from '../model/ComponentVectorStyles.js';
import Graph from '../model/Graph.js';
import SumVector from '../model/SumVector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorNode, { ComponentVectorNodeOptions } from './ComponentVectorNode.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';

type SelfOptions = EmptySelfOptions;
type SumComponentVectorNodeOptions = SelfOptions & ComponentVectorNodeOptions;

export default class SumComponentVectorNode extends ComponentVectorNode {

  private readonly sumVisibleProperty: TReadOnlyProperty<boolean>;

  public constructor( componentVector: ComponentVector,
                      graph: Graph,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      sumVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: SumComponentVectorNodeOptions ) {

    const options = optionize<SumComponentVectorNodeOptions, SelfOptions, ComponentVectorNodeOptions>()( {

      // ComponentVectorNodeOptions
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.SUM_COMPONENT_VECTOR_ARROW_OPTIONS, {
        fill: componentVector.vectorColorPalette.sumComponentFill
      } )
    }, providedOptions );

    super( componentVector, graph, componentStyleProperty, valuesVisibleProperty, options );

    this.sumVisibleProperty = sumVisibleProperty;

    const sumVector = componentVector.parentVector as SumVector;
    assert && assert( sumVector instanceof SumVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

    // Update when the sum becomes visible or defined.
    // unlink is unnecessary, exists for the lifetime of the sim.
    Multilink.multilink(
      [ sumVisibleProperty, sumVector.isDefinedProperty ],
      () => this.updateComponentVector( componentVector,
        graph.modelViewTransformProperty.value,
        componentStyleProperty.value,
        componentVector.isParentVectorActiveProperty.value )
    );
  }

  /**
   * Handles visibility of sum component vectors.
   */
  protected override updateComponentVector( componentVector: ComponentVector, modelViewTransform: ModelViewTransform2,
                                            componentStyle: ComponentVectorStyles, isParentActive: boolean ): void {
    super.updateComponentVector( componentVector, modelViewTransform, componentStyle, isParentActive );

    const sumVector = componentVector.parentVector as SumVector;
    assert && assert( sumVector instanceof SumVector ); // eslint-disable-line phet/no-simple-type-checking-assertions

    this.visible = (
      // components are visible
      ( componentStyle !== ComponentVectorStyles.INVISIBLE ) &&
      // sum is visible
      ( !!this.sumVisibleProperty && this.sumVisibleProperty.value ) &&
      // sum is defined
      sumVector.isDefinedProperty.value
    );
  }
}

vectorAddition.register( 'SumComponentVectorNode', SumComponentVectorNode );