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
  const GROUP_ONE_ICON_ARROW_OPTIONS = _.extend(
    _.clone( VectorAdditionConstants.VECTOR_CREATOR_PANEL_ARROW_OPTIONS ), {
      fill: 'blue' // TODO: move this to colors
    } );
  const GROUP_TWO_ICON_ARROW_OPTIONS = _.extend(
    _.clone( VectorAdditionConstants.VECTOR_CREATOR_PANEL_ARROW_OPTIONS ), {
      fill: 'red' // TODO: move this to colors
    } );


  class LabVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {ObservableArray.<VectorModel>} vectorArray - the observable array to add the vector's to.
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     */
    constructor( vectorSetGroupOne, vectorSetGroupTwo, modelViewTransformProperty ) {


      const panelSlots = [];

      panelSlots.push( new LabVectorCreatorPanelSlot( modelViewTransformProperty, vectorSetGroupOne, GROUP_ONE_ICON_ARROW_OPTIONS ) );
      panelSlots.push( new LabVectorCreatorPanelSlot( modelViewTransformProperty, vectorSetGroupTwo, GROUP_TWO_ICON_ARROW_OPTIONS ) );


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
     */
    constructor( modelViewTransformProperty, vectorSet, arrowOptions ) {

      super( 
        new ArrowNode( 0, 0, 30, -30, arrowOptions ),
        new ArrowNode( 0, 0, 12.5 * 5, -12.5 * 5 ),
        modelViewTransformProperty,
        vectorSet );
    }
    /**
     * Called when the vectorRepresentation is dropped. This should add the vector to the model.
     * @public
     * @override
     * @param {Vector2} - droppedPosition (model coordinates)
     * @returns {VectorModel} - the model added
     */
    addVectorToModel( droppedPosition ) { 
      return this.vectorSet.addVector( droppedPosition, 5, 5 );
    }
    
  }

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );



