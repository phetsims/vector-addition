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
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants
  const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;
  const DEFAULT_VECTOR = new Vector2( DEFAULT_VECTOR_LENGTH, DEFAULT_VECTOR_LENGTH );
  const VECTOR_CREATOR_PANEL_SLOT_OPTIONS = {
    iconArrowSize: 40,
    isInfinite: true
  };
  const VECTOR_CREATOR_PANEL_OPTIONS = {
    contentHeight: 110
  };

  class LabVectorCreatorPanel extends VectorCreatorPanel {

    /**
     * @param {LabGraph} labGraph
     * @param {SceneNode} sceneNode
     */
    constructor( labGraph, sceneNode ) {

      assert && assert( labGraph instanceof LabGraph, `invalid labGraph: ${labGraph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );

      //----------------------------------------------------------------------------------------
      // Create the two vector slots.

      const vectorCreatorSlotOne = new VectorCreatorPanelSlot( labGraph,
        labGraph.vectorSetGroup1,
        sceneNode,
        DEFAULT_VECTOR,
        VECTOR_CREATOR_PANEL_SLOT_OPTIONS );

      const vectorCreatorSlotTwo = new VectorCreatorPanelSlot( labGraph,
        labGraph.vectorSetGroup2,
        sceneNode,
        DEFAULT_VECTOR,
        VECTOR_CREATOR_PANEL_SLOT_OPTIONS );

      const panelSlots = [ vectorCreatorSlotOne, vectorCreatorSlotTwo ];

      super( panelSlots, VECTOR_CREATOR_PANEL_OPTIONS );
    }
  }

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );