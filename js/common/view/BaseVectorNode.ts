// Copyright 2025, University of Colorado Boulder

/**
 * BaseVectorNode is the view for a base vector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import BaseVector from '../../equations/model/BaseVector.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Vector from '../model/Vector.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';
import VectorNode, { VectorNodeOptions } from './VectorNode.js';

type SelfOptions = EmptySelfOptions;

type BaseVectorNodeOptions = SelfOptions & VectorNodeOptions;

export default class BaseVectorNode extends VectorNode {

  public constructor( baseVector: BaseVector,
                      vectorColorPalette: VectorColorPalette,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions: BaseVectorNodeOptions ) {

    const options = optionize<BaseVectorNodeOptions, SelfOptions, VectorNodeOptions>()( {

      // VectorNodeOptions
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS, {
        fill: vectorColorPalette.baseVectorFillProperty,
        stroke: vectorColorPalette.baseVectorStrokeProperty
      } ),
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.baseVectorNode.accessibleNameStringProperty, {
        symbol: baseVector.accessibleSymbolProperty
      } )
    }, providedOptions );

    super( baseVector, modelViewTransformProperty, selectedVectorProperty, valuesVisibleProperty, anglesVisibleProperty,
      graphBoundsProperty, options );

    this.addLinkedElement( baseVector );
  }
}

vectorAddition.register( 'BaseVectorNode', BaseVectorNode );