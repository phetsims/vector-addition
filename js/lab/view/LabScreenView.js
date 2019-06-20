// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const LabGraphControlPanel = require( 'VECTOR_ADDITION/lab/view/LabGraphControlPanel' );
  const LabVectorCreatorPanel = require( 'VECTOR_ADDITION/lab/view/LabVectorCreatorPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );


  class LabScreenView extends VectorAdditionScreenView {

    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      super( labModel, tandem );

      const graphControlPanel = new LabGraphControlPanel(
        labModel.sumGroup1VisibleProperty,
        labModel.sumGroup2VisibleProperty,
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
        labModel.scene.groupOneVectorSet,
        labModel.scene.groupTwoVectorSet,
        labModel.scene.graph.modelViewTransformProperty );

      this.addChild( vectorCreatorPanel );
    }

  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );