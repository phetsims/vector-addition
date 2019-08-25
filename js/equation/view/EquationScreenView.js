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
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionScreenView = require( 'VECTOR_ADDITION/common/view/VectorAdditionScreenView' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  class EquationScreenView extends VectorAdditionScreenView {

    /**
     * @param {EquationModel} equationModel
     * @param {Tandem} tandem
     */
    constructor( equationModel, tandem ) {

      assert && assert( equationModel instanceof EquationModel, `invalid equationModel: ${equationModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( equationModel, tandem );

      this.viewProperties = new VectorAdditionViewProperties();

      const polarScene = new EquationSceneNode(
        equationModel.polarGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        equationModel.componentStyleProperty
      );

      const cartesianScene = new EquationSceneNode(
        equationModel.cartesianGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        equationModel.componentStyleProperty
      );

      // Toggle visibility of scenes based on which coordinate snap mode it is.
      // Doesn't need to be unlinked since the scenes and equation scenes are never disposed.
      this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        polarScene.visible = ( coordinateSnapMode === CoordinateSnapModes.POLAR );
        cartesianScene.visible = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN );
      } );

      const equationGraphControlPanel = new EquationGraphControlPanel(
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        equationModel.componentStyleProperty
      );

      // Create the Coordinate snapping radio buttons
      const coordinateSnapRadioButtonGroup = new CoordinateSnapRadioButtonGroup(
        this.viewProperties.coordinateSnapModeProperty, {
          right: this.layoutBounds.maxX - 45,
          bottom: this.resetAllButton.top - 30
        } );

      this.addChild( equationGraphControlPanel );
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