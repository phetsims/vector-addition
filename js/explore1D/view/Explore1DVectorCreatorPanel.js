// Copyright 2019-2023, University of Colorado Boulder

/**
 * Explore1DVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Explore 1D' screen.
 *
 * @author Brandon Li
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorCreatorPanel from '../../common/view/VectorCreatorPanel.js';
import VectorCreatorPanelSlot from '../../common/view/VectorCreatorPanelSlot.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DGraph from '../model/Explore1DGraph.js';

export default class Explore1DVectorCreatorPanel extends VectorCreatorPanel {

  /**
   * @param {Explore1DGraph} graph
   * @param {SceneNode} sceneNode
   * @param {string[]} symbols - the symbols corresponding to each slot
   * @param {Object} [options]
   */
  constructor( graph, sceneNode, symbols, options ) {

    assert && assert( graph instanceof Explore1DGraph, `invalid graph: ${graph}` );
    assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
    assert && assert( _.every( symbols, symbol => typeof symbol === 'string' ), `invalid symbols: ${symbols}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {
      slotSpacing: ( graph.orientation === GraphOrientations.VERTICAL ) ? 18 : 32
    }, options );

    // Create the initial vector components, they are the same for every symbol.
    // See https://github.com/phetsims/vector-addition/issues/227
    const isHorizontal = ( graph.orientation === GraphOrientations.HORIZONTAL );
    const initialVectorComponents = isHorizontal ? new Vector2( 5, 0 ) : new Vector2( 0, 5 );

    // Create a slot for each symbol
    const panelSlots = [];
    symbols.forEach( symbol => {
      panelSlots.push( new VectorCreatorPanelSlot( graph, graph.vectorSet, sceneNode, initialVectorComponents, {
        symbol: symbol,
        iconArrowMagnitude: 35,

        // pointer area dilation for icons, identical for mouseArea and touchArea,
        // see https://github.com/phetsims/vector-addition/issues/250
        iconPointerAreaXDilation: isHorizontal ? 10 : 20,
        iconPointerAreaYDilation: isHorizontal ? 15 : 5
      } ) );
    } );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );