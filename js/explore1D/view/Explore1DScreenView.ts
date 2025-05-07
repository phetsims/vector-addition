// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DScreenView is the view for the 'Explore 1D' screen.
 *
 * @author Martin Veillette
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DModel from '../model/Explore1DModel.js';
import Explore1DGraphControlPanel from './Explore1DGraphControlPanel.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';
import Explore1DSceneNode from './Explore1DSceneNode.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import CoordinateSnapModeRadioButtonGroup from '../../common/view/CoordinateSnapModeRadioButtonGroup.js';

export default class Explore1DScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: Explore1DViewProperties;

  public constructor( model: Explore1DModel, tandem: Tandem ) {

    super( model, tandem );

    this.viewProperties = new Explore1DViewProperties( tandem.createTandem( 'viewProperties' ) );

    const graphViewBounds = model.verticalScene.graph.viewBounds;

    // Controls for the graph, at upper right
    const graphControlPanel = new Explore1DGraphControlPanel(
      model.horizontalScene.vectorSet,
      model.verticalScene.vectorSet,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: graphViewBounds.top,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // Radio buttons for selecting a scene, at lower right
    const sceneRadioButtonGroup = new CoordinateSnapModeRadioButtonGroup(
      model.sceneProperty,
      [ model.horizontalScene, model.verticalScene ],
      [ VectorAdditionIconFactory.createGraphOrientationIcon( 'horizontal' ),
        VectorAdditionIconFactory.createGraphOrientationIcon( 'vertical' )
      ],
      {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'sceneRadioButtonGroup' )
      } );

    // Node for each scene.
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );
    const horizonalSceneNode = new Explore1DSceneNode(
      model.horizontalScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      sceneRadioButtonGroup,
      sceneNodesTandem.createTandem( 'horizonalSceneNode' ) );

    const verticalSceneNode = new Explore1DSceneNode(
      model.verticalScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      sceneRadioButtonGroup,
      sceneNodesTandem.createTandem( 'verticalSceneNode' ) );

    // Cancel interactions when switching scenes.
    this.viewProperties.graphOrientationProperty.link( () => this.interruptSubtreeInput() );

    const screenViewRootNode = new Node( {
      children: [
        graphControlPanel,
        sceneRadioButtonGroup,
        horizonalSceneNode,
        verticalSceneNode,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    assert && assert( horizonalSceneNode.eraserButton );
    assert && assert( verticalSceneNode.eraserButton );
    this.pdomPlayAreaNode.pdomOrder = [

      // horizontal scene
      horizonalSceneNode.vectorCreatorPanel,
      horizonalSceneNode.vectorSetNodesParent,
      horizonalSceneNode.graphNode.originManipulator,
      horizonalSceneNode.eraserButton,

      // vertical scene
      verticalSceneNode.vectorCreatorPanel,
      verticalSceneNode.vectorSetNodesParent,
      verticalSceneNode.graphNode.originManipulator,
      verticalSceneNode.eraserButton
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      horizonalSceneNode.vectorValuesAccordionBox,
      verticalSceneNode.vectorValuesAccordionBox,
      graphControlPanel,
      sceneRadioButtonGroup,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    this.viewProperties.reset();
    super.reset();
  }
}

vectorAddition.register( 'Explore1DScreenView', Explore1DScreenView );