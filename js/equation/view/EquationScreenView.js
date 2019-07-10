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
  const EquationModel = require( 'VECTOR_ADDITION/equation/model/EquationModel' );
  const EquationSceneNode = require( 'VECTOR_ADDITION/equation/view/EquationSceneNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const EquationGraphControlPanel = require( 'VECTOR_ADDITION/equation/view/EquationGraphControlPanel' );

  // constants
  const SCREEN_VIEW_X_MARGIN = VectorAdditionConstants.SCREEN_VIEW_X_MARGIN;
  const SCREEN_VIEW_Y_MARGIN = VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

  class EquationScreenView extends ScreenView {
    /**
     * @param {EquationModel} equationModel
     * @param {Tandem} tandem
     */
    constructor( equationModel, tandem ) {

      assert && assert( equationModel instanceof EquationModel, `invalid equationModel: ${equationModel}` );
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super();

      const polarScene = new EquationSceneNode( equationModel,
        equationModel.polarScene );

      const cartesianScene = new EquationSceneNode( equationModel,
        equationModel.cartesianScene );

      this.addChild( polarScene );
      this.addChild( cartesianScene );

      //----------------------------------------------------------------------------------------
      // Toggle visibility of scenes based on which coordinate snap mode it is

      // Doesn't need to be unlinked since the scenes and equation scenes are never disposed.
      equationModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarScene.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianScene.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );

      //----------------------------------------------------------------------------------------
      // Create the Coordinate snapping radio buttons

      this.addChild( new CoordinateSnapRadioButtonGroup( equationModel.coordinateSnapModeProperty ) );

      const equationGraphControlPanel = new EquationGraphControlPanel( equationModel.valuesVisibleProperty,
        equationModel.angleVisibleProperty,
        equationModel.gridVisibleProperty,
        equationModel.componentStyleProperty, {
          right: this.layoutBounds.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: this.layoutBounds.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN
        } );

      this.addChild( equationGraphControlPanel );
      //----------------------------------------------------------------------------------------
      // Add the reset button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          equationModel.reset();

          cartesianScene.reset();
          polarScene.reset();
        },
        right: this.layoutBounds.maxX - SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'resetAllButton' )
      } );
      this.addChild( resetAllButton );
    }
  }

  return vectorAddition.register( 'EquationScreenView', EquationScreenView );
} );