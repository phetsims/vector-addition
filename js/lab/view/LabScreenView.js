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

      const vectorCreatorPanel = new LabVectorCreatorPanel(
        labModel.graph.group1VectorSet,
        labModel.graph.group2VectorSet,
        labModel.graph.modelViewTransformProperty );

      this.addChild( vectorCreatorPanel );

      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        labModel.coordinateSnapModeProperty );
      this.addChild( coordinateSnapRadioButtonGroup );
    }

  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );