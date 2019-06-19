// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vector panel.
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

  class Explore1DVectorCreatorPanels  {
    /**
     * @constructor
     * @param {VectorSet} horizontalVectorSet
     * @param {Property.<ModelViewTransform2>} horizontalModelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {VectorSet} verticalVectorSet -
     * @param {Property.<ModelViewTransform2>} verticalModelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( horizontalVectorSet,
                 horizontalModelViewTransformProperty,
                 verticalVectorSet,
                 verticalModelViewTransformProperty ) {

      this.horizontalVectorCreatorPanel = new HorizontalVectorCreatorPanel(
      horizontalModelViewTransformProperty, horizontalVectorSet );

      this.verticalVectorCreatorPanel = new VerticalVectorCreatorPanel( 
      verticalModelViewTransformProperty, verticalVectorSet );
    }
  }

  /*---------------------------------------------------------------------------*
   * Creator Panels
   *---------------------------------------------------------------------------*/
  class HorizontalVectorCreatorPanel extends VectorCreatorPanel {
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
        panelSlots.push( new HorizontalVectorCreatorPanelSlot( modelViewTransformProperty, vectorSet, label ) );
      } );

      super( panelSlots, VectorAdditionConstants.VECTOR_CREATOR_PANEL_OPTIONS );
    }
  }

  //----------------------------------------------------------------------------------------

  class VerticalVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectorArray - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( modelViewTransformProperty, vectorSet ) {

      const labels = [ 'd', 'e', 'f' ];

      const panelSlots = [];

      labels.forEach( ( label ) => {
        panelSlots.push( new VerticalVectorCreatorPanelSlot( modelViewTransformProperty, vectorSet, label ) );
      } );

      super( panelSlots, VectorAdditionConstants.VECTOR_CREATOR_PANEL_OPTIONS );
    }
  }

  //----------------------------------------------------------------------------------------
  /*---------------------------------------------------------------------------*
   * Panel Slots
   *---------------------------------------------------------------------------*/
 
  class HorizontalVectorCreatorPanelSlot extends VectorCreatorPanelSlot {
    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {VectorSet} vectorSet - the vectorSet that the slot adds vectors to.
     * @param {string} label
     */
    constructor( modelViewTransformProperty, vectorSet, label ) {
      super( 
        new ArrowNode( 0, 0, 30, 0, ICON_ARROW_OPTIONS ),
        new ArrowNode( 0, 0, 12.5 * 5, 0 ), // TODO: should this be in the constants file
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
      return this.vectorSet.addVector( droppedPosition, 5, 0, {
        label: this.label
      } );
    }
  }
    
  //----------------------------------------------------------------------------------------
  class VerticalVectorCreatorPanelSlot extends VectorCreatorPanelSlot {
    /**
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {VectorSet} vectorSet - the vectorSet that the slot adds vectors to.
     * @param {string} label
     */
    constructor( modelViewTransformProperty, vectorSet, label ) {

      super( 
        new ArrowNode( 0, 0, 0, 30, ICON_ARROW_OPTIONS ),
        new ArrowNode( 0, 0, 0, 12.5 * 5 ), // TODO: should this be in the constants file
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
      return this.vectorSet.addVector( droppedPosition, 0, 5, {
        label: this.label
      } );
    }
  }

  return vectorAddition.register( 'Explore1DVectorCreatorPanels', Explore1DVectorCreatorPanels );
} );
