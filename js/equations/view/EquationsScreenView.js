// Copyright 2019, University of Colorado Boulder

/**
 * EquationsScreenView is the view for the 'Equations' screen.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const EquationsGraphControlPanel = require( 'VECTOR_ADDITION/equations/view/EquationsGraphControlPanel' );
  const EquationsModel = require( 'VECTOR_ADDITION/equations/model/EquationsModel' );
  const EquationsSceneNode = require( 'VECTOR_ADDITION/equations/view/EquationsSceneNode' );
  const EquationsViewProperties = require( 'VECTOR_ADDITION/equations/view/EquationsViewProperties' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );

  class EquationsScreenView extends VectorAdditionScreenView {

    /**
     * @param {EquationsModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {

      assert && assert( model instanceof EquationsModel, `invalid model: ${model}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( model, tandem );

      // @private view-specific Properties
      this.viewProperties = new EquationsViewProperties();

      // Controls for the graph, at upper right
      const graphControlPanel = new EquationsGraphControlPanel(
        model.cartesianGraph.vectorSet,
        model.polarGraph.vectorSet,
        model.componentStyleProperty,
        this.viewProperties, {
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      // Coordinate Snap radio buttons, at lower right
      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        this.viewProperties.coordinateSnapModeProperty,
        model.cartesianVectorColorPalette,
        model.polarVectorColorPalette, {
          left: graphControlPanel.left,
          bottom: this.resetAllButton.bottom
        } );

      // Used to make all of the radio button in the Equation toggle box the same effective size.
      const equationButtonsAlignGroup = new AlignGroup( {
        matchHorizontal: true,
        matchVertical: true
      } );

      // Used to make all of the interactive equations in the Equation toggle box the same effective size.
      const equationsAlignGroup = new AlignGroup( {
        matchHorizontal: true,
        matchVertical: true
      } );

      const polarScene = new EquationsSceneNode(
        model.polarGraph,
        this.viewProperties,
        model.componentStyleProperty,
        graphControlPanel.bottom,
        equationButtonsAlignGroup,
        equationsAlignGroup
      );

      const cartesianScene = new EquationsSceneNode(
        model.cartesianGraph,
        this.viewProperties,
        model.componentStyleProperty,
        graphControlPanel.bottom,
        equationButtonsAlignGroup,
        equationsAlignGroup
      );

      // Switch between scenes to match coordinate snap mode.
      // unlink is unnecessary, exists for the lifetime of the sim.
      this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        this.interruptSubtreeInput(); // cancel interactions when switching scenes
        polarScene.visible = ( coordinateSnapMode === CoordinateSnapModes.POLAR );
        cartesianScene.visible = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN );
      } );

      this.addChild( graphControlPanel );
      this.addChild( coordinateSnapRadioButtonGroup );
      this.addChild( polarScene );
      this.addChild( cartesianScene );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'EquationsScreenView', EquationsScreenView );
} );