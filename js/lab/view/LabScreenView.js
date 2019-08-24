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
 * Screen Views are never disposed.
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
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );


  class LabScreenView extends VectorAdditionScreenView {

    /**
     * @param {LabModel} labModel
     * @param {Tandem} tandem
     */
    constructor( labModel, tandem ) {

      assert && assert( labModel instanceof LabModel, `invalid labModel: ${labModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( labModel, tandem );

      // @private {VectorAdditionViewProperties} viewProperties - viewProperties for the 'Lab' screen
      this.viewProperties = new VectorAdditionViewProperties();

      //========================================================================================
      // Add the children of the screen view
      //========================================================================================

      // Create and add the Graph Control Panel
      const graphControlPanel = new LabGraphControlPanel(
        labModel.cartesianGraph,
        labModel.polarGraph,
        this.viewProperties,
        labModel.componentStyleProperty );
      this.addChild( graphControlPanel );

      // Create and add the coordinate snap mode radio buttons
      const sceneRadioButtons = new CoordinateSnapRadioButtonGroup( this.viewProperties.coordinateSnapModeProperty, {
        right: this.layoutBounds.maxX - 45,
        bottom: this.resetAllButton.top - 30
      } );
      this.addChild( sceneRadioButtons );

      //----------------------------------------------------------------------------------------
      // Create and add the Scene Nodes and Vector Creator Panels for each graph
      [ labModel.polarGraph, labModel.cartesianGraph ].forEach( labGraph => {

        const sceneNode = new SceneNode( labGraph,
          this.viewProperties.valuesVisibleProperty,
          this.viewProperties.angleVisibleProperty,
          this.viewProperties.gridVisibleProperty,
          labModel.componentStyleProperty );

        sceneNode.addVectorCreatorPanel( new LabVectorCreatorPanel( labGraph, sceneNode, {
          left: sceneRadioButtons.left,
          bottom: sceneRadioButtons.top - 20
        } ) );

        // Toggle visibility of the SceneNode. Should only be visible if the coordinateSnapMode matches the
        // labGraph's coordinateSnapMode. Is never unlinked since the screen view is never disposed.
        this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
          sceneNode.visible = coordinateSnapMode === labGraph.coordinateSnapMode;
        } );

        // Add the scene node
        this.addChild( sceneNode );

      } );
    }

    /**
     * Resets the Lab Screen View
     * @public
     *
     * @override
     */
    reset() {
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'LabScreenView', LabScreenView );
} );