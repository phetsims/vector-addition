// Copyright 2025, University of Colorado Boulder

/**
 * BaseVectorNode is the view for a base vector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VectorNode, { VectorNodeOptions } from './VectorNode.js';
import vectorAddition from '../../vectorAddition.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import BaseVector from '../model/BaseVector.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';

type SelfOptions = EmptySelfOptions;

type BaseVectorNodeOptions = SelfOptions & VectorNodeOptions;

export default class BaseVectorNode extends VectorNode {

  public constructor( baseVector: BaseVector,
                      vectorColorPalette: VectorColorPalette,
                      scene: VectorAdditionScene,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: BaseVectorNodeOptions ) {

    const options = optionize<BaseVectorNodeOptions, SelfOptions, VectorNodeOptions>()( {

      // VectorNodeOptions
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS, {
        fill: vectorColorPalette.baseVectorFillProperty,
        stroke: vectorColorPalette.baseVectorStrokeProperty
      } ),
      tandemNameSuffix: 'BaseVectorNode'
    }, providedOptions );

    super( baseVector, scene, valuesVisibleProperty, anglesVisibleProperty, options );

    this.addLinkedElement( baseVector );
  }
}

vectorAddition.register( 'BaseVectorNode', BaseVectorNode );