// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vectorCreator panel.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants
  const ICON_ARROW_OPTIONS = _.extend(
    VectorAdditionConstants.VECTOR_CREATOR_PANEL_ARROW_OPTIONS, {
      fill: 'black' // TODO: move this to colors
    } );

  class Explore2DVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectorArray - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( modelViewTransformProperty, vectorSet ) {

      const labels = [ 'a', 'b', 'c' ];

      const panelSlots = [];

      labels.forEach( ( label ) => {
        panelSlots.push( new Explore2DVectorCreatorPanelSlot( modelViewTransformProperty, vectorSet, label ) );
      } );

      super( panelSlots, VectorAdditionConstants.VECTOR_CREATOR_PANEL_OPTIONS );
    }

  }
  //----------------------------------------------------------------------------------------
  /*---------------------------------------------------------------------------*
   * Panel Slot
   *---------------------------------------------------------------------------*/
 

  class Explore2DVectorCreatorPanelSlot extends VectorCreatorPanelSlot {
    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {VectorSet} vectorSet - the vectorSet that the slot adds vectors to.
     * @param {string} label
     */
    constructor( modelViewTransformProperty, vectorSet, label ) {

      super( 
        new ArrowNode( 0, 0, 30, -30, ICON_ARROW_OPTIONS ),
        new ArrowNode( 0, 0, 12.5 * 5, -12.5 * 5 ),
        modelViewTransformProperty,
        vectorSet, {
          label: label
        } );
    }
    /**
     * Called when the vectorRepresentation is dropped. This should add the vector to the model.
     * @public
     * @override
     * @param {Vector2} - droppedPosition (model coordinates)
     * @returns {VectorModel} - the model added
     */
    addVectorToModel( droppedPosition ) { 
      return this.vectorSet.addVector( droppedPosition, 5, 5, {
        label: this.label
      } );
    }
    
  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );

