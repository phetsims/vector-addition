// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag into the screen. This class extends the common abstract vector panel.
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

  const VERTICAL_CREATOR_PANEL_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_CREATOR_PANEL_OPTIONS, {
    xMargin: 4,
    yMargin: 5,
    slotSpacing: 10
  } );

  class Explore1DVectorCreatorPanels {
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
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the modelViewTransform
     * @param {VectorSet} vectorSet - the observable array to add the vector's to.
     */
    constructor( modelViewTransformProperty, vectorSet ) {

      // create labels for each vector slot
      const labels = [ 'a', 'b', 'c' ];

      const panelSlots = [];

      // create a horizontal vector pointing along positive x
      const initialVector = new Vector2( INITIAL_ARROW_SIDE_LENGTH, 0 );

      labels.forEach( ( label ) => {
        panelSlots.push( new VectorCreatorPanelSlot( initialVector, modelViewTransformProperty, vectorSet,
          { label: label } ) );
      } );

      super( panelSlots, VectorAdditionConstants.VECTOR_CREATOR_PANEL_OPTIONS );
    }
  }

  //----------------------------------------------------------------------------------------

  class VerticalVectorCreatorPanel extends VectorCreatorPanel {
    /**
     * @abstract
     * @constructor
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty - the property of the model - view coordinate transformation
     * @param {VectorSet} vectorSet
     */
    constructor( modelViewTransformProperty, vectorSet ) {

      // create labels for each vector slot
      const labels = [ 'd', 'e', 'f' ];

      const panelSlots = [];

      // create a vertical vector pointing along positive y
      const initialVerticalVector = new Vector2( 0, INITIAL_ARROW_SIDE_LENGTH );

      labels.forEach( ( label ) => {
        panelSlots.push( new VectorCreatorPanelSlot( initialVerticalVector, modelViewTransformProperty, vectorSet,
          { label: label } ) );
      } );

      super( panelSlots, VERTICAL_CREATOR_PANEL_OPTIONS );
    }
  }


  return vectorAddition.register( 'Explore1DVectorCreatorPanels', Explore1DVectorCreatorPanels );
} );
