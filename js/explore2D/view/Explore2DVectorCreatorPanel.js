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
  const INITIAL_ARROW_SIDE_LENGTH = VectorAdditionConstants.INITIAL_ARROW_SIDE_LENGTH;

  class Explore2DVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {VectorSet} vectorSet
     */
    constructor( explore2DModel, graph, vectorSet, vectorContainer, explore2DModelScreenView, labels ) {

      // create labels for each vector slot

      const panelSlots = [];

      // create a 45 degree vector2 representing the vector that will be dropped onto the graph
      const initialVector = new Vector2( INITIAL_ARROW_SIDE_LENGTH, INITIAL_ARROW_SIDE_LENGTH );

      labels.forEach( ( label ) => {

        panelSlots.push( new VectorCreatorPanelSlot( explore2DModel, initialVector, graph, vectorSet, vectorContainer, explore2DModelScreenView,
          { tag: label } ) );
      } );

      super( panelSlots );
    }
  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );

