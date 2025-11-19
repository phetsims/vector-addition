// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsScreenView is the view for the 'Equations' screen.
 *
 * @author Martin Veillette
 */

import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CartesianPolarSceneRadioButtonGroup from '../../common/view/CartesianPolarSceneRadioButtonGroup.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsModel from '../model/EquationsModel.js';
import EquationsGraphControlPanel from './EquationsGraphControlPanel.js';
import EquationsSceneNode from './EquationsSceneNode.js';
import EquationsScreenSummaryContent from './EquationsScreenSummaryContent.js';
import EquationsViewProperties from './EquationsViewProperties.js';

export default class EquationsScreenView extends VectorAdditionScreenView {

  // Properties that are specific to the view.
  private readonly viewProperties: EquationsViewProperties;

  public constructor( model: EquationsModel, tandem: Tandem ) {

    super( model.sceneProperty, {
      resetModel: () => model.reset(),
      screenSummaryContent: new EquationsScreenSummaryContent( model.sceneProperty, model.scenes ),
      tandem: tandem
    } );

    this.viewProperties = new EquationsViewProperties( tandem.createTandem( 'viewProperties' ) );

    // Controls for the graph, at upper right
    const graphControlPanel = new EquationsGraphControlPanel(
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

    // Used to make all radio buttons in the Equation accordion box the same effective size.
    const equationButtonsAlignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: true
    } );

    // Used to make all interactive equations in the Equation accordion box the same effective size.
    const equationsAlignGroup = new AlignGroup( {
      matchHorizontal: true,
      matchVertical: true
    } );

    // Group scenes under a parent tandem.
    const sceneNodesTandem = tandem.createTandem( 'sceneNodes' );

    const cartesianSceneNode = new EquationsSceneNode(
      model.cartesianScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      graphControlPanel.bottom,
      equationButtonsAlignGroup,
      equationsAlignGroup,
      sceneNodesTandem.createTandem( 'cartesianSceneNode' ) );

    const polarSceneNode = new EquationsSceneNode(
      model.polarScene,
      model.sceneProperty,
      this.viewProperties,
      model.componentVectorStyleProperty,
      graphControlPanel.bottom,
      equationButtonsAlignGroup,
      equationsAlignGroup,
      sceneNodesTandem.createTandem( 'polarSceneNode' ) );

    // Graph Area heading for the Cartesian scene.
    // TODO: CM: Recommendation: It is acceptable to have this copied code, but perhaps good to call out with NOTE: this is duplicated with ..., see https://github.com/phetsims/vector-addition/issues/376
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
    this.pdomPlayAreaNode.pdomOrder = [

      // Cartesian scene
      cartesianSceneNode.equationAccordionBox,
      cartesianGraphAreaHeading,
      cartesianSceneNode.vectorValuesAccordionBox,

      // polar scene
      polarSceneNode.equationAccordionBox,
      polarGraphAreaHeading,
      polarSceneNode.vectorValuesAccordionBox
    ];

    // Control Area focus order
    this.pdomControlAreaNode.pdomOrder = [
      graphControlPanel,
      cartesianSceneNode.baseVectorsAccordionBox,
      polarSceneNode.baseVectorsAccordionBox,
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

vectorAddition.register( 'EquationsScreenView', EquationsScreenView );