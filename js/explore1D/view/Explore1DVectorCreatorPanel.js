// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vector panel.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants
  const INITIAL_ARROW_SIDE_LENGTH = VectorAdditionConstants.INITIAL_ARROW_SIDE_LENGTH;

  const VERTICAL_CREATOR_PANEL_OPTIONS = {
    slotSpacing: 10
  };


  class Explore1DVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {VectorSet} vectorSet
     */
    constructor( explore1DModel, graph, vectorSet, vectorContainer, explore1DModelScreenView, labels ) {
      // create labels for each vector slot

      const panelSlots = [];

      let initialVector;

      if ( graph.orientation === GraphOrientations.HORIZONTAL ) {
        initialVector = new Vector2( INITIAL_ARROW_SIDE_LENGTH, 0 );
      } 
      else if ( graph.orientation === GraphOrientations.VERTICAL ) {
        initialVector = new Vector2( 0, INITIAL_ARROW_SIDE_LENGTH );
      }
      labels.forEach( ( label ) => {

        panelSlots.push( new VectorCreatorPanelSlot( explore1DModel, initialVector, graph, vectorSet, vectorContainer, explore1DModelScreenView,
          { label: label } ) );
      } );

      super( panelSlots, graph.orientation === GraphOrientations.HORIZONTAL ? null : VERTICAL_CREATOR_PANEL_OPTIONS );
    }
  }
  return vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );
} );
