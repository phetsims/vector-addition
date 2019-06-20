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

  class LabVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {VectorSet} vectorSetGroupOne - the observable array to add the vector's to.
     * @param {VectorSet} vectorSetGroupTwo - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( vectorSetGroupOne, vectorSetGroupTwo, modelViewTransformProperty ) {


      const panelSlots = [];

      panelSlots.push( new LabVectorCreatorPanelSlot( modelViewTransformProperty, vectorSetGroupOne ) );
      panelSlots.push( new LabVectorCreatorPanelSlot( modelViewTransformProperty, vectorSetGroupTwo ) );


      super( panelSlots, VectorAdditionConstants.VECTOR_CREATOR_PANEL_OPTIONS );
    }

  }

  //----------------------------------------------------------------------------------------
  /*---------------------------------------------------------------------------*
   * Panel Slots
   *---------------------------------------------------------------------------*/


  class LabVectorCreatorPanelSlot extends VectorCreatorPanelSlot {
    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {VectorSet} vectorSet - the vectorSet that the slot adds vectors to.
     * @param {Object} [options]
     */
    constructor( modelViewTransformProperty, vectorSet, options ) {

      super(
        new Vector2( INITIAL_ARROW_SIDE_LENGTH, INITIAL_ARROW_SIDE_LENGTH ),
        modelViewTransformProperty,
        vectorSet, {
          isInfinite: true
        } );
    }

    /**
     * Called when the vectorRepresentation is dropped. This should add the vector to the model.
     * @public
     * @override
     * @param {Vector2} droppedPosition (model coordinates)
     * @returns {VectorModel} - the model added
     */
    addVectorToModel( droppedPosition ) {
      return this.vectorSet.addVector( droppedPosition, INITIAL_ARROW_SIDE_LENGTH, INITIAL_ARROW_SIDE_LENGTH );
    }

  }

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );



