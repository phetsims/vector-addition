// Copyright 2019-2025, University of Colorado Boulder

/**
 * ResultantVectorNode is the view for a resultant vector.
 *
 * Extends VectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on resultantVectorVisibleProperty
 *  - disables the ability to take the resultant vector off of the graph
 *
 * @author Brandon Li
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';
import VectorNode, { VectorNodeOptions } from './VectorNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import affirm, { isAffirmEnabled } from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ResultantVector from '../model/ResultantVector.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector from '../model/Vector.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

export default class ResultantVectorNode extends VectorNode {

  public constructor( resultantVector: ResultantVector,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      selectedVectorProperty: Property<Vector | null>,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      angleVisibleProperty: TReadOnlyProperty<boolean>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      resultantVectorVisibleProperty: TReadOnlyProperty<boolean> ) {

    const options: VectorNodeOptions = {

      // VectorNodeOptions
      isDisposable: false,
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.RESULTANT_VECTOR_ARROW_OPTIONS, {
        fill: resultantVector.vectorColorPalette.sumFillProperty,
        stroke: resultantVector.vectorColorPalette.sumStrokeProperty
      } ),

      // Make the resultant vector visible only if it is defined, meaning that there is at least 1 vector on the graph.
      // See https://github.com/phetsims/vector-addition/issues/187
      visibleProperty: new DerivedProperty( [ resultantVectorVisibleProperty, resultantVector.isDefinedProperty ],
        ( resultantVectorVisible, isDefined ) => ( resultantVectorVisible && isDefined ) )
    };

    super( resultantVector, modelViewTransformProperty, selectedVectorProperty, valuesVisibleProperty, angleVisibleProperty,
      graphBoundsProperty, options );

    // Making a selected resultant vector invisible clears activeVectorProperty.
    // See https://github.com/phetsims/vector-addition/issues/112.
    resultantVectorVisibleProperty.link( resultantVectorVisible => {
      if ( !isSettingPhetioStateProperty.value ) {
        if ( !resultantVectorVisible && selectedVectorProperty.value === resultantVector ) {
          selectedVectorProperty.value = null;
        }
      }
    } );

    // Double check that the vector node never animates back to the toolbox.
    isAffirmEnabled() && resultantVector.animateBackProperty.link( animateBack => {
      if ( animateBack ) {
        affirm( false, 'ResultantVectorNode instances never animated back' );
      }
    } );

    this.addLinkedElement( resultantVector );
  }
}

vectorAddition.register( 'ResultantVectorNode', ResultantVectorNode );