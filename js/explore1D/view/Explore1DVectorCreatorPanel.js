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
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Explore1DModel = require( 'VECTOR_ADDITION/explore1D/model/Explore1DModel' );
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
  const HORIZONTAL_DEFAULT_VECTOR = new Vector2( DEFAULT_VECTOR_LENGTH, 0 );
  const VERTICAL_DEFAULT_VECTOR = new Vector2( 0, DEFAULT_VECTOR_LENGTH );
  const VERTICAL_CREATOR_PANEL_OPTIONS = {
    slotSpacing: 10
  };

  class Explore1DVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @param {Explore1DModel} explore1DModel
     * @param {Graph} graph
     * @param {VectorSet} the vector set that the explore 1D vector creator panel represents
     * @param {Node} vectorContainer - container for the vector nodes to go into
     * @param {VectorAdditionScreenView} explore1DScreenView
     * @param {array.<string>} tags - the tags corresponding to each slot
     * @constructor
     */
    constructor( explore1DModel, graph, vectorSet, vectorContainer, explore1DScreenView, tags) {
      
      assert && assert( explore1DModel instanceof Explore1DModel, `invalid explore1DModel: ${explore1DModel}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( vectorContainer instanceof Node, `invalid vectorContainer: ${vectorContainer}` );
      assert && assert( explore1DScreenView instanceof VectorAdditionScreenView,
        `invalid explore1DScreenView: ${explore1DScreenView}` );
      assert && assert( tags.filter( tag => typeof tag === 'string' ).length === tags.length,
        `invalid tags: ${tags}` );

      const panelSlots = [];

      //----------------------------------------------------------------------------------------
      // Loop through each tag, creating a slot which corresponds with that tag
      tags.forEach( ( tag ) => {

        const panelSlot = new VectorCreatorPanelSlot( explore1DModel,
          graph.orientation === GraphOrientations.HORIZONTAL ? HORIZONTAL_DEFAULT_VECTOR : VERTICAL_DEFAULT_VECTOR,
          graph,
          vectorSet,
          vectorContainer,
          explore1DScreenView, {
            tag: tag
          } );

        panelSlots.push( panelSlot );
      } );

      super( panelSlots, graph.orientation === GraphOrientations.HORIZONTAL ? null : VERTICAL_CREATOR_PANEL_OPTIONS );
    }
  }

  return vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );
} );