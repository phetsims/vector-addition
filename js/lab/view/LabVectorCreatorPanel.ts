// Copyright 2019-2023, University of Colorado Boulder

/**
 * LabVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Lab' screen.
 *
 * @author Brandon Li
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorCreatorPanel from '../../common/view/VectorCreatorPanel.js';
import VectorCreatorPanelSlot from '../../common/view/VectorCreatorPanelSlot.js';
import vectorAddition from '../../vectorAddition.js';
import LabGraph from '../model/LabGraph.js';

export default class LabVectorCreatorPanel extends VectorCreatorPanel {

  /**
   * @param {LabGraph} graph
   * @param {SceneNode} sceneNode
   * @param {Object} [options]
   */
  constructor( graph, sceneNode, options ) {

    assert && assert( graph instanceof LabGraph, `invalid graph: ${graph}` );
    assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {
      slotSpacing: 40
    }, options );

    // Create the initial vector components, the same for all vectors in a set.
    // See https://github.com/phetsims/vector-addition/issues/227
    const initialVectorComponents = ( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) ?
                                    new Vector2( 8, 6 ) :
                                    Vector2.createPolar( 8, Utils.toRadians( 45 ) );

    // Create a slot for each VectorSet
    const slots = [];
    graph.vectorSets.forEach( vectorSet => {
      slots.push( new VectorCreatorPanelSlot( graph, vectorSet, sceneNode, initialVectorComponents, {
        iconArrowMagnitude: 57,
        numberOfVectors: 10 // Each slot can create 10 vectors
      } ) );
    } );

    super( slots, options );
  }
}

vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );