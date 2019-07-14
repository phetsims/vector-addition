// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen for Lab.
 *
 * Characteristics of the vector creator panel on the lab screen are;
 *  - 2 slots per panel
 *  - Slots are infinite
 *  - Each slot goes to the different vector sets.
 *  - Vectors don't have labels
 *  - One vector creator panel per scene (cartesian and polar)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const LabModel = require( 'VECTOR_ADDITION/lab/model/LabModel' );
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
  const VECTOR_CREATOR_PANEL_SLOT_OPTIONS = {
    iconOptions: {
      arrowLength: 40
    },
    isInfinite: true
  };
  const VECTOR_CREATOR_PANEL_OPTIONS = {
    contentHeight: 110
  };

  class LabVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @param {LabModel} labModel
     * @param {Graph} graph
     * @param {VectorSet} firstSlotVectorSet - the vector set that the first slot adds vectors to. In lab, each slot
     *                                         adds to a unique vector set
     * @param {VectorSet} secondSlotVectorSet - the vector set that the second slot adds vectors to.
     * @param {Node} vectorContainer - container for the vector nodes to go into
     * @param {VectorAdditionScreenView} labScreenView
     * @constructor
     */
    constructor( labModel, graph, firstSlotVectorSet, secondSlotVectorSet, vectorContainer, labScreenView ) {

      assert && assert( labModel instanceof LabModel, `invalid labModel: ${labModel}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( firstSlotVectorSet instanceof VectorSet, `invalid firstSlotVectorSet: ${firstSlotVectorSet}` );
      assert && assert( vectorContainer instanceof Node, `invalid vectorContainer: ${vectorContainer}` );
      assert && assert( labScreenView instanceof VectorAdditionScreenView, `invalid labScreenView: ${labScreenView}` );

      //----------------------------------------------------------------------------------------
      // Create the two vector slots.

      const vectorCreatorSlotOne = new VectorCreatorPanelSlot( labModel,
        DEFAULT_VECTOR,
        graph,
        firstSlotVectorSet,
        vectorContainer,
        labScreenView,
        VECTOR_CREATOR_PANEL_SLOT_OPTIONS );

      const vectorCreatorSlotTwo = new VectorCreatorPanelSlot( labModel,
        DEFAULT_VECTOR,
        graph,
        secondSlotVectorSet,
        vectorContainer,
        labScreenView,
        VECTOR_CREATOR_PANEL_SLOT_OPTIONS );

      const panelSlots = [ vectorCreatorSlotOne, vectorCreatorSlotTwo ];

      super( panelSlots, VECTOR_CREATOR_PANEL_OPTIONS );
    }
  }

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );