// Copyright 2019, University of Colorado Boulder

/**
 * Top level view for the 'Equation' screen.
 *
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CoordinateSnapRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/CoordinateSnapRadioButtonGroup' );
  const EquationGraphControlPanel = require( 'VECTOR_ADDITION/equation/view/EquationGraphControlPanel' );
  const EquationModel = require( 'VECTOR_ADDITION/equation/model/EquationModel' );
  const EquationSceneNode = require( 'VECTOR_ADDITION/equation/view/EquationSceneNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
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


      const polarScene = new EquationSceneNode( equationModel.polarGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        equationModel.componentStyleProperty );

      const cartesianScene = new EquationSceneNode( equationModel.cartesianGraph,
        this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        equationModel.componentStyleProperty );

      this.addChild( polarScene );
      this.addChild( cartesianScene );

      //----------------------------------------------------------------------------------------
      // Toggle visibility of scenes based on which coordinate snap mode it is

      // Doesn't need to be unlinked since the scenes and equation scenes are never disposed.
      this.viewProperties.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarScene.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianScene.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );

      //----------------------------------------------------------------------------------------
      // Create the Coordinate snapping radio buttons

      this.addChild( new CoordinateSnapRadioButtonGroup( this.viewProperties.coordinateSnapModeProperty ) );

      const equationGraphControlPanel = new EquationGraphControlPanel( this.viewProperties.valuesVisibleProperty,
        this.viewProperties.angleVisibleProperty,
        this.viewProperties.gridVisibleProperty,
        equationModel.componentStyleProperty, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( equationGraphControlPanel );

    }

    reset() {
      this.viewProperties.reset();
    }
  }

  return vectorAddition.register( 'EquationScreenView', EquationScreenView );
} );