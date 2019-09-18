// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Lab' screen.
 *
 * Extends VectorAdditionScreenView but adds:
 *  - Coordinate Snap Radio Button Group
 *  - Lab Graph Control Panel
 *  - Scene nodes for each graph
 *  - Vector Creator Panels for each graph
 *
 * ScreenViews are never disposed.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const LabGraphControlPanel = require( 'VECTOR_ADDITION/lab/view/LabGraphControlPanel' );
  const LabModel = require( 'VECTOR_ADDITION/lab/model/LabModel' );
  const LabVectorCreatorPanel = require( 'VECTOR_ADDITION/lab/view/LabVectorCreatorPanel' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  class LabScreenView extends VectorAdditionScreenView {

    /**
     * @param {LabModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      assert && assert( model instanceof LabModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( model, tandem );

      // @private view-specific Properties
      this.viewProperties = new VectorAdditionViewProperties();

      // Controls for the graph, at upper right
      const graphControlPanel = new LabGraphControlPanel(
        model.cartesianGraph,
        model.polarGraph,
        model.componentStyleProperty,
        model.sumVisibleProperty1,
        model.sumVisibleProperty2,
        this.viewProperties, {
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( graphControlPanel );

      // Coordinate Snap radio buttons, at lower right
      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        this.viewProperties.coordinateSnapModeProperty,
        model.cartesianVectorColorPalette1,
        model.polarVectorColorPalette1, {
          left: graphControlPanel.left,
          bottom: this.resetAllButton.bottom
        } );
      this.addChild( coordinateSnapRadioButtonGroup );

      // Create and add the Scene Nodes and Vector Creator Panels for each graph
      [ model.polarGraph, model.cartesianGraph ].forEach( graph => {

        const sceneNode = new SceneNode( graph, this.viewProperties, model.componentStyleProperty );

        // Add the vector creator panel
        sceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( graph, sceneNode, {
            left: coordinateSnapRadioButtonGroup.left,
            bottom: coordinateSnapRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING
          } )
        );

        // Toggle visibility of the SceneNode. Should only be visible if the coordinateSnapMode matches the
        // graph's coordinateSnapMode. Is never unlinked since the screen view is never disposed.
        this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
          sceneNode.visible = ( coordinateSnapMode === graph.coordinateSnapMode );
        } );

        // Add the scene node
        this.addChild( sceneNode );
      } );
    }

    /**
     * @public
     * @override
     */
    reset() {
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );