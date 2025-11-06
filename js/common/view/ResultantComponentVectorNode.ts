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

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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

  public constructor( componentVector: ComponentVector,
                      resultantVector: ResultantVector,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      resultantVectorVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: SumComponentVectorNodeOptions ) {

    affirm( componentVector.parentVector === resultantVector, 'componentVector does not belong to resultantVector.' );

    const options = optionize<SumComponentVectorNodeOptions, SelfOptions, ComponentVectorNodeOptions>()( {

      // ComponentVectorNodeOptions
      isDisposable: false,
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.RESULTANT_COMPONENT_VECTOR_ARROW_OPTIONS, {
        fill: componentVector.vectorColorPalette.sumComponentFillProperty
      } ),
      visibleProperty: new DerivedProperty(
        [ componentVectorStyleProperty, resultantVectorVisibleProperty, resultantVector.isDefinedProperty ],
        ( componentVectorStyle, visible, isDefined ) => ( componentVectorStyle !== 'invisible' ) && visible && isDefined )
    }, providedOptions );

    super( componentVector, modelViewTransformProperty, selectedVectorProperty, componentVectorStyleProperty, valuesVisibleProperty, options );
  }
}

vectorAddition.register( 'ResultantComponentVectorNode', ResultantComponentVectorNode );