// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen for Explore1D.
 *
 * Characteristics of the vector creator panel on Explore1D:
 *  - 3 slots per panel
 *  - Each slot goes to the same vector set. Or in other words, each creator panel represents one vector set.
 *  - One vector creator panel per scene (horizontal and vertical)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Explore1DGraph = require( 'VECTOR_ADDITION/explore1D/model/Explore1DGraph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants
  const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;
  const HORIZONTAL_DEFAULT_VECTOR = new Vector2( DEFAULT_VECTOR_LENGTH, 0 );
  const VERTICAL_DEFAULT_VECTOR = new Vector2( 0, DEFAULT_VECTOR_LENGTH );
  const VERTICAL_CREATOR_PANEL_OPTIONS = {
    slotSpacing: 10
  };

  class Explore1DVectorCreatorPanel extends VectorCreatorPanel {

    /**
     * @param {Explore1DGraph} explore1DGraph
     * @param {SceneNode} sceneNode
     * @param {array.<string>} symbols - the symbols corresponding to each slot
     */
    constructor( explore1DGraph, sceneNode, symbols ) {

      assert && assert( explore1DGraph instanceof Explore1DGraph, `invalid explore1DGraph: ${explore1DGraph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
      assert && assert( _.every( symbols, symbol => typeof symbol === 'string' ), `invalid symbols: ${symbols}` );

      const panelSlots = [];

      //----------------------------------------------------------------------------------------
      // Loop through each symbol, creating a slot which corresponds with that symbol
      //----------------------------------------------------------------------------------------

      symbols.forEach( symbol => {

        const panelSlot = new VectorCreatorPanelSlot( explore1DGraph,
          explore1DGraph.vectorSet,
          sceneNode,
          explore1DGraph.orientation === GraphOrientations.HORIZONTAL ? HORIZONTAL_DEFAULT_VECTOR : VERTICAL_DEFAULT_VECTOR, {
            symbol: symbol
          } );

        panelSlots.push( panelSlot );

      } );

      super( panelSlots, explore1DGraph.orientation === GraphOrientations.HORIZONTAL ? null : VERTICAL_CREATOR_PANEL_OPTIONS );
    }
  }

  return vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );
} );