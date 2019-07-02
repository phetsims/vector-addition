// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vectorCreator panel.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants
  const DEFAULT_VECTOR_LENGTH = VectorAdditionConstants.DEFAULT_VECTOR_LENGTH;

  const CREATOR_PANEL_OPTIONS = {
    contentHeight: 110 // {number} fixed height of the panel
  };

  const VECTOR_SLOT_OPTIONS = {
    iconOptions: {
      arrowSize: 40
    },
    isInfinite: true
  };

  class LabVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {VectorSet} vectorSetGroupOne - the observable array to add the vector's to.
     * @param {VectorSet} vectorSetGroupTwo - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( labModel, graph, vectorSetGroupOne, vectorSetGroupTwo, container, parentScreenView ) {

      // create a 45 degree vector2 representing the vector that will be dropped onto the graph
      const initialVector = new Vector2( DEFAULT_VECTOR_LENGTH, DEFAULT_VECTOR_LENGTH );

      const vectorGroupOneSlot = new VectorCreatorPanelSlot( labModel,
        initialVector,
        graph,
        vectorSetGroupOne,
        container,
        parentScreenView,
        VECTOR_SLOT_OPTIONS );

      const vectorGroupTwoSlot = new VectorCreatorPanelSlot( labModel,
        initialVector,
        graph,
        vectorSetGroupTwo,
        container,
        parentScreenView,
        VECTOR_SLOT_OPTIONS );

      const panelSlots = [ vectorGroupOneSlot, vectorGroupTwoSlot ];

      super( panelSlots, CREATOR_PANEL_OPTIONS );
    }
  }

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );


