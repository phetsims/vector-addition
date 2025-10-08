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
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';
import VectorNode, { VectorNodeOptions } from './VectorNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import affirm, { isAffirmEnabled } from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ResultantVector from '../model/ResultantVector.js';

type SelfOptions = EmptySelfOptions;
type SumVectorNodeOptions = SelfOptions & WithRequired<VectorNodeOptions, 'tandem'>;

export default class ResultantVectorNode extends VectorNode {

  public constructor( resultantVector: ResultantVector,
                      scene: VectorAdditionScene,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      resultantVectorVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: SumVectorNodeOptions ) {

    const options = optionize<SumVectorNodeOptions, SelfOptions, VectorNodeOptions>()( {

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
    }, providedOptions );

    super( resultantVector, scene, valuesVisibleProperty, anglesVisibleProperty, options );

    // Making a selected resultant vector invisible clears activeVectorProperty.
    // See https://github.com/phetsims/vector-addition/issues/112.
    resultantVectorVisibleProperty.link( resultantVectorVisible => {
      if ( !resultantVectorVisible && scene.selectedVectorProperty.value === resultantVector ) {
        scene.selectedVectorProperty.value = null;
      }
    } );

    // Double check that the vector node never is animated back
    isAffirmEnabled() && resultantVector.animateBackProperty.link( animateBack => {
      if ( animateBack ) {
        affirm( false, 'ResultantVectorNode instances never animated back' );
      }
    } );

    this.addLinkedElement( resultantVector );
  }
}

vectorAddition.register( 'ResultantVectorNode', ResultantVectorNode );