// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DScreenView is the view for the 'Explore 2D' screen.
 *
 * @author Martin Veillette
 */

import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CartesianPolarSceneRadioButtonGroup from '../../common/view/CartesianPolarSceneRadioButtonGroup.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Explore2DModel from '../model/Explore2DModel.js';
import Explore2DGraphControlPanel from './Explore2DGraphControlPanel.js';
import Explore2DSceneNode from './Explore2DSceneNode.js';
import Explore2DScreenSummaryContent from './Explore2DScreenSummaryContent.js';
import Explore2DViewProperties from './Explore2DViewProperties.js';

export default class Explore2DScreenView extends VectorAdditionScreenView {

  // view-specific Properties
  private readonly viewProperties: Explore2DViewProperties;

  public constructor( model: Explore2DModel, tandem: Tandem ) {

    super( model, {
      screenSummaryContent: new Explore2DScreenSummaryContent( model ),
      tandem: tandem
    } );

    // Cancel interactions when switching scenes.
    model.sceneProperty.link( () => this.interruptSubtreeInput() );

    this.viewProperties = new Explore2DViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Control for the graph, at upper right
    const graphControlPanel = new Explore2DGraphControlPanel(
      model.sceneProperty,
      model.cartesianScene,
      model.polarScene,
      model.componentVectorStyleProperty,
      this.viewProperties, {
        right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.right - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
        top: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.top + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'graphControlPanel' )
      } );

    // Radio buttons for selecting a scene, at lower right
    const sceneRadioButtonGroup = new CartesianPolarSceneRadioButtonGroup(
      model.sceneProperty,
      model.cartesianScene,
      model.cartesianScene.vectorSet.vectorColorPalette,
      model.polarScene,
      model.polarScene.vectorSet.vectorColorPalette, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'sceneRadioButtonGroup' )
      } );

    // Node for each scene.
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );
    const cartesianSceneNode = new Explore2DSceneNode(
      model.cartesianScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      sceneRadioButtonGroup,
      sceneNodesTandem.createTandem( 'cartesianSceneNode' ) );

    const polarSceneNode = new Explore2DSceneNode(
      model.polarScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      sceneRadioButtonGroup,
      sceneNodesTandem.createTandem( 'polarSceneNode' ) );

    // Graph Area heading for the Cartesian scene.
    const cartesianGraphAreaHeading = new Node( {
      pdomOrder: [
        cartesianSceneNode.graphNode,
        cartesianSceneNode.vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      visibleProperty: cartesianSceneNode.visibleProperty
    } );

    // Graph Area heading for the polar scene.
    const polarGraphAreaHeading = new Node( {
      pdomOrder: [
        polarSceneNode.graphNode,
        polarSceneNode.vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      visibleProperty: polarSceneNode.visibleProperty
    } );

    const screenViewRootNode = new Node( {
      children: [
        // Accessible headings can be put anywhere in rendering order because they have no children. Put them all first.
        cartesianGraphAreaHeading,
        polarGraphAreaHeading,

        graphControlPanel,
        sceneRadioButtonGroup,
        cartesianSceneNode,
        polarSceneNode,
        this.resetAllButton
      ]
    } );
    this.addChild( screenViewRootNode );

    // Play Area focus order
    affirm( cartesianSceneNode.eraserButton, 'Expected cartesianSceneNode.eraserButton to be defined.' );
    affirm( polarSceneNode.eraserButton, 'Expected polarSceneNode.eraserButton to be defined.' );
    this.pdomPlayAreaNode.pdomOrder = [

      // Cartesian scene
      cartesianSceneNode.vectorToolbox,
      cartesianGraphAreaHeading,
      cartesianSceneNode.eraserButton,
      cartesianSceneNode.vectorValuesAccordionBox,

      // polar scene
      polarSceneNode.vectorToolbox,
      polarGraphAreaHeading,
      polarSceneNode.eraserButton,
      polarSceneNode.vectorValuesAccordionBox
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      graphControlPanel,
      cartesianSceneNode.originManipulator,
      polarSceneNode.originManipulator,
      sceneRadioButtonGroup,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    this.viewProperties.reset();
    super.reset();
  }
}

vectorAddition.register( 'Explore2DScreenView', Explore2DScreenView );