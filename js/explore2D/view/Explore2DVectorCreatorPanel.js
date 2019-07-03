// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen for Explore2D.
 * 
 * Characteristics of the vector creator panel on Explore2D:
 *  - 3 slots per panel
 *  - Each slot goes to the same vector set. Or in other words, each creator panel represents one vector set.
 *  - One vector creator panel per scene (cartesian and polar)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;
  const DEFAULT_VECTOR = new Vector2( DEFAULT_VECTOR_LENGTH, DEFAULT_VECTOR_LENGTH );

  class Explore2DVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @param {Explore2DModel} explore2DModel
     * @param {Graph} graph
     * @param {VectorSet} the vector set that the explore 2d vector creator panel represents
     * @param {Node} vectorContainer - container for the vector nodes to go into
     * @param {VectorAdditionScreenView} explore2DScreenView
     * @param {array.<string>} tags - the tags corresponding to each slot
     * @constructor
     */
    constructor( explore2DModel, graph, vectorSet, vectorContainer, explore2DScreenView, tags ) {

      assert && assert( explore2DModel instanceof Explore2DModel, `invalid explore2DModel: ${explore2DModel}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( vectorContainer instanceof Node, `invalid vectorContainer: ${vectorContainer}` );
      assert && assert( explore2DScreenView instanceof VectorAdditionScreenView,
        `invalid explore2DScreenView: ${explore2DScreenView}` );
      assert && assert( tags.filter( tag => typeof tag === 'string' ).length === tags.length,
        `invalid tags: ${tags}` );

      const panelSlots = [];

      //----------------------------------------------------------------------------------------
      // Loop through each tag, creating a slot which corresponds with that tag
      tags.forEach( ( tag ) => {

        const panelSlot = new VectorCreatorPanelSlot( explore2DModel,
          DEFAULT_VECTOR,
          graph,
          vectorSet,
          vectorContainer,
          explore2DScreenView, {
            tag: tag
          } );

        panelSlots.push( panelSlot );
      } );

      super( panelSlots );
    }
  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );