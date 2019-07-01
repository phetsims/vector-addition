// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const LabGraphControlPanel = require( 'VECTOR_ADDITION/lab/view/LabGraphControlPanel' );
  const LabVectorCreatorPanel = require( 'VECTOR_ADDITION/lab/view/LabVectorCreatorPanel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );

  class LabScreenView extends VectorAdditionScreenView {

    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      const polarSceneNode = new SceneNode( labModel.polarGraph,
        labModel.valuesVisibleProperty,
        labModel.angleVisibleProperty,
        labModel.gridVisibleProperty,
        labModel.componentStyleProperty, {
          isExpandedInitially: true
        } );
      const cartesianSceneNode = new SceneNode( labModel.cartesianGraph,
        labModel.valuesVisibleProperty,
        labModel.angleVisibleProperty,
        labModel.gridVisibleProperty,
        labModel.componentStyleProperty, {
          isExpandedInitially: true
        } );

      super( labModel, [ polarSceneNode, cartesianSceneNode ], tandem );

      //----------------------------------------------------------------------------------------
      // Create the vector creator panels

      polarSceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( labModel,
        labModel.polarGraph,
        labModel.polarGraph.group3VectorSet,
        labModel.polarGraph.group4VectorSet,
        polarSceneNode.vectorContainer,
        this ) );

      cartesianSceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( labModel,
        labModel.cartesianGraph,
        labModel.cartesianGraph.group1VectorSet,
        labModel.cartesianGraph.group2VectorSet,
        cartesianSceneNode.vectorContainer,
        this ) );



      //----------------------------------------------------------------------------------------
      // toggle visible
      labModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
          polarSceneNode.visible = false;
          cartesianSceneNode.visible = true;
        }

        if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
          polarSceneNode.visible = true;
          cartesianSceneNode.visible = false;
        }
      } );


      //----------------------------------------------------------------------------------------
      const graphControlPanel = new LabGraphControlPanel(
        labModel,
        labModel.cartesianGraph.group1VectorSet,
        labModel.cartesianGraph.group2VectorSet,
        labModel.polarGraph.group3VectorSet,
        labModel.polarGraph.group4VectorSet, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( graphControlPanel );

      //----------------------------------------------------------------------------------------



      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        labModel.coordinateSnapModeProperty );
      this.addChild( coordinateSnapRadioButtonGroup );
    }
  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );