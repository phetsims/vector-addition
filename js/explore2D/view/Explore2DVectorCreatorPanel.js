// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vectorCreator panel.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const INITIAL_ARROW_SIDE_LENGTH = VectorAdditionConstants.INITIAL_ARROW_SIDE_LENGTH;

  const CREATOR_PANEL_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_CREATOR_PANEL_OPTIONS, {
    xMargin: 10,
    yMargin: 6,
    slotSpacing: 14
  } );

  class Explore2DVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {VectorSet} vectorSet
     */
    constructor( modelViewTransformProperty, vectorSet ) {

      const labels = [ 'a', 'b', 'c' ];

      const panelSlots = [];

      labels.forEach( ( label ) => {
        panelSlots.push( new Explore2DVectorCreatorPanelSlot( modelViewTransformProperty, vectorSet, label ) );
      } );

      super( panelSlots, CREATOR_PANEL_OPTIONS );
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
        new Vector2( INITIAL_ARROW_SIDE_LENGTH, INITIAL_ARROW_SIDE_LENGTH ),
        modelViewTransformProperty,
        vectorSet, {
          label: label
        } );
    }

    /**
     * Called when the vectorRepresentation is dropped. This should add the vector to the model.
     * @public
     * @override
     * @param {Vector2} droppedPosition  in model coordinates
     * @returns {VectorModel} the vector model added
     */
    addVectorToModel( droppedPosition ) {
      return this.vectorSet.addVector( droppedPosition, INITIAL_ARROW_SIDE_LENGTH, INITIAL_ARROW_SIDE_LENGTH, {
        label: this.label
      } );
    }

  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );

