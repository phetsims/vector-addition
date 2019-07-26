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
  const Explore2DGraph = require( 'VECTOR_ADDITION/explore2D/model/Explore2DGraph' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants
  const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;
  const DEFAULT_VECTOR = new Vector2( DEFAULT_VECTOR_LENGTH, DEFAULT_VECTOR_LENGTH );

  class Explore2DVectorCreatorPanel extends VectorCreatorPanel {

    /**
     * @param {Explore2DGraph} explore2DGraph
     * @param {SceneNode} sceneNode
     * @param {array.<string>} symbols - the symbols corresponding to each slot
     */
    constructor( explore2DGraph, sceneNode, symbols ) {

      assert && assert( explore2DGraph instanceof Explore2DGraph, `invalid explore2DGraph: ${explore2DGraph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
      assert && assert( _.every( symbols, symbol => typeof symbol === 'string' ) , `invalid symbols: ${symbols}` );

      const panelSlots = [];

      //----------------------------------------------------------------------------------------
      // Loop through each symbol, creating a slot which corresponds with that symbol
      //----------------------------------------------------------------------------------------

      symbols.forEach( symbol => {

        const panelSlot = new VectorCreatorPanelSlot( explore2DGraph,
          explore2DGraph.vectorSet,
          sceneNode,
          DEFAULT_VECTOR, {
            symbol: symbol
          } );

        panelSlots.push( panelSlot );

      } );

      super( panelSlots );
    }
  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );