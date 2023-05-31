// Copyright 2019-2023, University of Colorado Boulder

/**
 * Explore2DScreenView is the view for the 'Explore 2D' screen.
 *
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CoordinateSnapRadioButtonGroup from '../../common/view/CoordinateSnapRadioButtonGroup.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Explore2DModel from '../model/Explore2DModel.js';
import Explore2DGraphControlPanel from './Explore2DGraphControlPanel.js';
import Explore2DVectorCreatorPanel from './Explore2DVectorCreatorPanel.js';

export default class Explore2DScreenView extends VectorAdditionScreenView {

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
      model.componentStyleProperty,
      this.viewProperties, {
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

      // Switch between scenes to match coordinate snap mode.
      // unlink is unnecessary, exists for the lifetime of the sim.
      this.viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        this.interruptSubtreeInput(); // cancel interactions when switching scenes
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
    super.reset();
    this.viewProperties.reset();
  }
}

vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );