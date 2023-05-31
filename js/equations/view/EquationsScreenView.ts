// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationsScreenView is the view for the 'Equations' screen.
 *
 * @author Martin Veillette
 */

import { AlignGroup } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CoordinateSnapRadioButtonGroup from '../../common/view/CoordinateSnapRadioButtonGroup.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsModel from '../model/EquationsModel.js';
import EquationsGraphControlPanel from './EquationsGraphControlPanel.js';
import EquationsSceneNode from './EquationsSceneNode.js';
import EquationsViewProperties from './EquationsViewProperties.js';

export default class EquationsScreenView extends VectorAdditionScreenView {

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

vectorAddition.register( 'EquationsScreenView', EquationsScreenView );