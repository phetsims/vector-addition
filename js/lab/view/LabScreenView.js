// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const LabGraphControlPanel = require( 'VECTOR_ADDITION/lab/view/LabGraphControlPanel' );
  const LabVectorCreatorPanel = require( 'VECTOR_ADDITION/lab/view/LabVectorCreatorPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );


  class LabScreenView extends VectorAdditionScreenView {

    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      super( labModel, tandem, {
        isExpandedInitially: true
      } );

      const graphControlPanel = new LabGraphControlPanel(
        labModel.group1SumVisibleProperty,
        labModel.group2SumVisibleProperty,
        labModel.valuesVisibleProperty,
        labModel.angleVisibleProperty,
        labModel.gridVisibleProperty,
        labModel.componentStyleProperty,
        {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( graphControlPanel );

      //----------------------------------------------------------------------------------------
      const polarVectorCreatorPanel = new LabVectorCreatorPanel(
        labModel.polarGraph.group1VectorSet,
        labModel.polarGraph.group2VectorSet,
        labModel.polarGraph.modelViewTransformProperty );

      this.addChild( polarVectorCreatorPanel );

      const cartesianVectorCreatorPanel = new LabVectorCreatorPanel(
        labModel.cartesianGraph.group1VectorSet,
        labModel.cartesianGraph.group2VectorSet,
        labModel.cartesianGraph.modelViewTransformProperty );

      this.addChild( cartesianVectorCreatorPanel );

      // toggle visible
      labModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
          polarVectorCreatorPanel.visible = false;
          cartesianVectorCreatorPanel.visible = true;
          labModel.polarGraph.sceneNode = false;
          labModel.cartesianGraph.sceneNode.visible = true;
        }


        if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
          polarVectorCreatorPanel.visible = true;
          cartesianVectorCreatorPanel.visible = false;
          labModel.polarGraph.sceneNode = true;
          labModel.cartesianGraph.sceneNode. visible = false;
        }
      } );


      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        labModel.coordinateSnapModeProperty );
      this.addChild( coordinateSnapRadioButtonGroup );
    }

  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );