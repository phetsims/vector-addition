// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DScreenView is the view for the 'Explore 2D' screen.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CartesianPolarSceneRadioButtonGroup from '../../common/view/CartesianPolarSceneRadioButtonGroup.js';
import ExploreViewProperties from '../../common/view/ExploreViewProperties.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import Explore2DModel from '../model/Explore2DModel.js';
import Explore2DGraphControlPanel from './Explore2DGraphControlPanel.js';
import Explore2DSceneNode from './Explore2DSceneNode.js';
import Explore2DScreenSummaryContent from './Explore2DScreenSummaryContent.js';

export default class Explore2DScreenView extends VectorAdditionScreenView {

  // Properties that are specific to the view.
  private readonly viewProperties: ExploreViewProperties;

  public constructor( model: Explore2DModel, tandem: Tandem ) {

    const viewProperties = new ExploreViewProperties( {
      tandem: tandem.createTandem( 'viewProperties' )
    } );

    super( model.sceneProperty, {
      resetModel: () => model.reset(),
      screenSummaryContent: new Explore2DScreenSummaryContent( model.sceneProperty, viewProperties.sumVisibleProperty ),
      tandem: tandem
    } );

    this.viewProperties = viewProperties;

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

    // Group scenes under a parent tandem.
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
      visibleProperty: cartesianSceneNode.visibleProperty,
      pdomOrder: [
        cartesianSceneNode.graphNode,
        cartesianSceneNode.vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      accessibleParagraph: new PatternStringProperty( VectorAdditionStrings.a11y.graphArea.accessibleParagraphExploreStringProperty, {
        numberOfVectors: new DerivedProperty(
          [ viewProperties.sumVisibleProperty,
            model.cartesianScene.vectorSet.resultantVector.isDefinedProperty,
            model.cartesianScene.vectorSet.numberOfVectorsOnGraphProperty
          ],
          ( sumVisible, resultantVectorIsDefined, numberOfVectorsOnGraph ) =>
            ( sumVisible && resultantVectorIsDefined ) ? numberOfVectorsOnGraph + 1 : numberOfVectorsOnGraph )
      } )
    } );

    // Graph Area heading for the polar scene.
    const polarGraphAreaHeading = new Node( {
      visibleProperty: polarSceneNode.visibleProperty,
      pdomOrder: [
        polarSceneNode.graphNode,
        polarSceneNode.vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      accessibleParagraph: new PatternStringProperty( VectorAdditionStrings.a11y.graphArea.accessibleParagraphExploreStringProperty, {
        numberOfVectors: new DerivedProperty(
          [ viewProperties.sumVisibleProperty,
            model.polarScene.vectorSet.resultantVector.isDefinedProperty,
            model.polarScene.vectorSet.numberOfVectorsOnGraphProperty
          ],
          ( sumVisible, resultantVectorIsDefined, numberOfVectorsOnGraph ) =>
            ( sumVisible && resultantVectorIsDefined ) ? numberOfVectorsOnGraph + 1 : numberOfVectorsOnGraph )
      } )
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
      cartesianGraphAreaHeading,
      cartesianSceneNode.vectorToolbox,
      cartesianSceneNode.eraserButton,
      cartesianSceneNode.vectorValuesAccordionBox,

      // polar scene
      polarGraphAreaHeading,
      polarSceneNode.vectorToolbox,
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