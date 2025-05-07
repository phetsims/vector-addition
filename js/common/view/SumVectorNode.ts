// Copyright 2019-2025, University of Colorado Boulder

/**
 * SumVectorNode is the view for a sum vector.
 *
 * Extends VectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on the sumVisibleProperty
 *  - disables the ability to take the sum vector off of the graph
 *
 * @author Brandon Li
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import SumVector from '../model/SumVector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';
import VectorNode, { VectorNodeOptions } from './VectorNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
type SumVectorNodeOptions = SelfOptions & VectorNodeOptions;

export default class SumVectorNode extends VectorNode {

  public constructor( sumVector: SumVector,
                      scene: VectorAdditionScene,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>,
                      sumVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: SumVectorNodeOptions ) {

    const options = optionize<SumVectorNodeOptions, SelfOptions, VectorNodeOptions>()( {

      // VectorNodeOptions
      isDisposable: false,
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.SUM_VECTOR_ARROW_OPTIONS, {
        fill: sumVector.vectorColorPalette.sumFill,
        stroke: sumVector.vectorColorPalette.sumStroke
      } ),

      // Make the sum vector visible only if it is defined, meaning that there is at least 1 vector on the graph.
      // See https://github.com/phetsims/vector-addition/issues/187
      visibleProperty: new DerivedProperty( [ sumVisibleProperty, sumVector.isDefinedProperty ],
        ( sumVisible, isDefined ) => ( sumVisible && isDefined ) )
    }, providedOptions );

    super( sumVector, scene, valuesVisibleProperty, anglesVisibleProperty, options );

    // Making an active sum vector invisible clears activeVectorProperty.
    // See https://github.com/phetsims/vector-addition/issues/112.
    sumVisibleProperty.link( sumVisible => {
      if ( !sumVisible && scene.activeVectorProperty.value === sumVector ) {
        scene.activeVectorProperty.value = null;
      }
    } );

    // Double check that the vector node never is animated back
    // unlink is unnecessary, exists for the lifetime of the sim.
    assert && sumVector.animateBackProperty.link( animateBack => {
      if ( animateBack ) {
        assert && assert( false, 'SumVectorNode instances never animated back' );
      }
    } );
  }
}

vectorAddition.register( 'SumVectorNode', SumVectorNode );