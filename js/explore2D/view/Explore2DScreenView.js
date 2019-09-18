// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Explore 2D' screen.
 *
 * Extends VectorAdditionScreenView but adds:
 *  - Coordinate Snap Radio Button Group
 *  - Explore 2D Graph Control Panel
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
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const Explore2DGraphControlPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DGraphControlPanel' );
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
  const Explore2DVectorCreatorPanel = require( 'VECTOR_ADDITION/explore2D/view/Explore2DVectorCreatorPanel' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  class Explore2DScreenView extends VectorAdditionScreenView {

    /**
     * @param {Explore2DModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      assert && assert( model instanceof Explore2DModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( model, tandem );

      // @private view-specific Properties
      this.viewProperties = new VectorAdditionViewProperties();

      // Control for the graph, at upper right
      const graphControlPanel = new Explore2DGraphControlPanel(
        model.cartesianGraph.vectorSet,
        model.polarGraph.vectorSet,
        this.viewProperties.coordinateSnapModeProperty,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.anglesVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        model.componentStyleProperty, {
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );
      this.addChild( graphControlPanel );

      // Coordinate Snap radio buttons, at lower right
      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        this.viewProperties.coordinateSnapModeProperty,
        model.cartesianVectorColorPalette,
        model.polarVectorColorPalette, {
          left: graphControlPanel.left,
          bottom: this.resetAllButton.bottom
        } );
      this.addChild( coordinateSnapRadioButtonGroup );

      // Create and add the Scene Nodes and Vector Creator Panels for each graph
      [ model.polarGraph, model.cartesianGraph ].forEach( graph => {

        // Create the scene node
        const sceneNode = new SceneNode( graph, this.viewProperties, model.componentStyleProperty );

        // Vector symbols depend on whether snap mode is Cartesian or Polar
        const vectorSymbols = ( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) ?
                              VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_1 :
                              VectorAdditionConstants.VECTOR_SYMBOLS_GROUP_2;

        // Add the vector creator panel
        sceneNode.addVectorCreatorPanel( new Explore2DVectorCreatorPanel(
          graph,
          sceneNode,
          vectorSymbols, {
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

  return vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );
} );