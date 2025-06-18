// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScreenView is the view for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import LabModel from '../model/LabModel.js';
import LabGraphControlPanel from './LabGraphControlPanel.js';
import LabSceneNode from './LabSceneNode.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import CartesianPolarSceneRadioButtonGroup from '../../common/view/CartesianPolarSceneRadioButtonGroup.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

export default class LabScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: VectorAdditionViewProperties;

  public constructor( model: LabModel, tandem: Tandem ) {

    const currentDetailsStringProperty = new PatternStringProperty( VectorAdditionStrings.a11y.labScreen.screenSummary.currentDetailsStringProperty, {
      numberOfBlueVectors: 'TODO', //TODO https://github.com/phetsims/vector-addition/issues/306
      numberOfOrangeVectors: 'TODO', //TODO https://github.com/phetsims/vector-addition/issues/306
      sceneName: 'sceneName' //TODO https://github.com/phetsims/vector-addition/issues/306
    } );


    super( model, {
      screenSummaryContent: new ScreenSummaryContent( {
        playAreaContent: VectorAdditionStrings.a11y.labScreen.screenSummary.playAreaStringProperty,
        controlAreaContent: VectorAdditionStrings.a11y.labScreen.screenSummary.controlAreaStringProperty,
        currentDetailsContent: currentDetailsStringProperty,
        interactionHintContent: VectorAdditionStrings.a11y.labScreen.screenSummary.interactionHintStringProperty
      } ),
      tandem: tandem
    } );

    this.viewProperties = new VectorAdditionViewProperties( {
      tandem: tandem.createTandem( 'viewProperties' )
    } );

    // Controls for the graph, at upper right
    const graphControlPanel = new LabGraphControlPanel(
      model.sceneProperty,
      model.cartesianScene,
      model.polarScene,
      model.componentVectorStyleProperty,
      model.sum1VisibleProperty,
      model.sum2VisibleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // Radio buttons for selecting a scene, at lower right
    const sceneRadioButtonGroup = new CartesianPolarSceneRadioButtonGroup(
      model.sceneProperty,
      model.cartesianScene,
      model.cartesianScene.vectorSet1.vectorColorPalette,
      model.polarScene,
      model.polarScene.vectorSet1.vectorColorPalette, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'sceneRadioButtonGroup' )
      } );

    // Node for each scene.
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );
    const cartesianSceneNode = new LabSceneNode(
      model.cartesianScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      sceneRadioButtonGroup,
      sceneNodesTandem.createTandem( 'cartesianSceneNode' ) );

    const polarSceneNode = new LabSceneNode(
      model.polarScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      sceneRadioButtonGroup,
      sceneNodesTandem.createTandem( 'polarSceneNode' ) );

    // Cancel interactions when switching scenes.
    model.sceneProperty.link( () => this.interruptSubtreeInput() );

    const screenViewRootNode = new Node( {
      children: [
        graphControlPanel,
        sceneRadioButtonGroup,
        cartesianSceneNode,
        polarSceneNode,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    this.pdomPlayAreaNode.pdomOrder = [

      // Cartesian scene
      cartesianSceneNode.vectorCreatorPanel,
      cartesianSceneNode.vectorSetNodesParent,
      cartesianSceneNode.graphNode.originManipulator,
      cartesianSceneNode.eraserButton,
      cartesianSceneNode.vectorValuesAccordionBox,

      // polar scene
      polarSceneNode.vectorCreatorPanel,
      polarSceneNode.vectorSetNodesParent,
      polarSceneNode.graphNode.originManipulator,
      polarSceneNode.eraserButton,
      polarSceneNode.vectorValuesAccordionBox
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
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

vectorAddition.register( 'LabScreenView', LabScreenView );