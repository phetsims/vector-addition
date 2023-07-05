// Copyright 2019-2023, University of Colorado Boulder

/**
 * SumVectorNode is the view for a sum vector.
 *
 * Extends VectorNode but adds the following functionality:
 *  - a distinct appearance
 *  - toggle visibility based on the sumVisibleProperty
 *  - disables ability to take the sum vector node off of the graph
 *
 * @author Brandon Li
 */

import Multilink from '../../../../axon/js/Multilink.js';
import vectorAddition from '../../vectorAddition.js';
import Graph from '../model/Graph.js';
import SumVector from '../model/SumVector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorNode, { VectorNodeOptions } from './VectorNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { RootVectorArrowNodeOptions } from './RootVectorNode.js';

type SelfOptions = EmptySelfOptions;
type SumVectorNodeOptions = SelfOptions & VectorNodeOptions;

export default class SumVectorNode extends VectorNode {

  public constructor( sumVector: SumVector, graph: Graph, valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      anglesVisibleProperty: TReadOnlyProperty<boolean>, sumVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: SumVectorNodeOptions ) {

    const options = optionize<SumVectorNodeOptions, SelfOptions, VectorNodeOptions>()( {

      // VectorNodeOptions
      arrowOptions: combineOptions<RootVectorArrowNodeOptions>( {}, VectorAdditionConstants.SUM_VECTOR_ARROW_OPTIONS, {
        fill: sumVector.vectorColorPalette.sumFill,
        stroke: sumVector.vectorColorPalette.sumStroke
      } )
    }, providedOptions );

    super( sumVector, graph, valuesVisibleProperty, anglesVisibleProperty, options );

    // Make the sum vector visible only if it is defined, meaning that there is at least 1 vector on the graph.
    // See https://github.com/phetsims/vector-addition/issues/187
    // unmultilink is unnecessary, exists for the lifetime of the sim.
    Multilink.multilink(
      [ sumVisibleProperty, sumVector.isDefinedProperty ],
      ( sumVisible, isDefined ) => {
        this.visible = ( sumVisible && isDefined );
      } );

    // Making an active sum vector invisible clears activeVectorProperty. See #112.
    // unlink is unnecessary, exists for the lifetime of the sim.
    sumVisibleProperty.link( sumVisible => {
      if ( !sumVisible && graph.activeVectorProperty.value === sumVector ) {
        graph.activeVectorProperty.value = null;
      }
    } );

    // When the sum vector becomes invisible, interrupt interactions.
    // See https://github.com/phetsims/vector-addition/issues/201
    this.visibleProperty.lazyLink( () => {
      if ( !this.visible ) {
        this.interruptSubtreeInput();
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