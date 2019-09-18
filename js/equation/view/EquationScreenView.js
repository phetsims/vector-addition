// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Equation' screen.
 * ScreenViews are never disposed.
 *
 * @author Martin Veillette
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const EquationGraphControlPanel = require( 'VECTOR_ADDITION/equation/view/EquationGraphControlPanel' );
  const EquationModel = require( 'VECTOR_ADDITION/equation/model/EquationModel' );
  const EquationSceneNode = require( 'VECTOR_ADDITION/equation/view/EquationSceneNode' );
  const EquationViewProperties = require( 'VECTOR_ADDITION/equation/view/EquationViewProperties' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );

  class EquationScreenView extends VectorAdditionScreenView {

    /**
     * @param {EquationModel} equationModel
     * @param {Tandem} tandem
     */
    constructor( equationModel, tandem ) {

      assert && assert( equationModel instanceof EquationModel, `invalid equationModel: ${equationModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( equationModel, tandem );

      // @private view-specific Properties
      this.viewProperties = new EquationViewProperties();

      // Controls for the graph, at upper right
      const graphControlPanel = new EquationGraphControlPanel(
        equationModel.cartesianGraph.vectorSet,
        equationModel.polarGraph.vectorSet,
        this.viewProperties.coordinateSnapModeProperty,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.anglesVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        equationModel.componentStyleProperty, {
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        }
      );

      // Coordinate Snap radio buttons, at lower right
      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        this.viewProperties.coordinateSnapModeProperty,
        equationModel.cartesianVectorColorPalette,
        equationModel.polarVectorColorPalette, {
          left: graphControlPanel.left,
          bottom: this.resetAllButton.bottom
        } );

      const polarScene = new EquationSceneNode(
        equationModel.polarGraph,
        this.viewProperties,
        equationModel.componentStyleProperty,
        graphControlPanel.bottom
      );

      const cartesianScene = new EquationSceneNode(
        equationModel.cartesianGraph,
        this.viewProperties,
        equationModel.componentStyleProperty,
        graphControlPanel.bottom
      );

      // Toggle visibility of scenes based on which coordinate snap mode it is.
      // Doesn't need to be unlinked since the scenes and equation scenes are never disposed.
      this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
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
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'EquationScreenView', EquationScreenView );
} );