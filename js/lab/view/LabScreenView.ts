// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabScreenView is the view for the 'Lab' screen.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import CartesianPolarSceneRadioButtonGroup from '../../common/view/CartesianPolarSceneRadioButtonGroup.js';
import VectorAdditionScreenView from '../../common/view/VectorAdditionScreenView.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import LabModel from '../model/LabModel.js';
import LabGraphControlPanel from './LabGraphControlPanel.js';
import LabSceneNode from './LabSceneNode.js';
import LabScreenSummaryContent from './LabScreenSummaryContent.js';
import LabViewProperties from './LabViewProperties.js';

export default class LabScreenView extends VectorAdditionScreenView {

  // Properties that are specific to the view.
  private readonly viewProperties: LabViewProperties;

  public constructor( model: LabModel, tandem: Tandem ) {

    const viewProperties = new LabViewProperties( tandem.createTandem( 'viewProperties' ) );

    super( model.sceneProperty, {
      resetModel: () => model.reset(),
      screenSummaryContent: new LabScreenSummaryContent( model.sceneProperty,
        viewProperties.sum1VisibleProperty, viewProperties.sum2VisibleProperty ),
      tandem: tandem
    } );

    this.viewProperties = viewProperties;

    // Controls for the graph, at upper right
    const graphControlPanel = new LabGraphControlPanel(
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
      model.cartesianScene.vectorSet1.vectorColorPalette,
      model.polarScene,
      model.polarScene.vectorSet1.vectorColorPalette, {
        left: graphControlPanel.left,
        bottom: this.resetAllButton.bottom,
        tandem: tandem.createTandem( 'sceneRadioButtonGroup' )
      } );

    // Group scenes under a parent tandem.
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

    // Graph Area heading for the Cartesian scene.
    const cartesianGraphAreaHeading = new Node( {
      visibleProperty: cartesianSceneNode.visibleProperty,
      pdomOrder: [
        cartesianSceneNode.graphNode,
        cartesianSceneNode.vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      accessibleParagraph: new PatternStringProperty( VectorAdditionStrings.a11y.graphArea.accessibleParagraphLabStringProperty, {
        vectorSet1Size: new DerivedProperty( [
            viewProperties.sum1VisibleProperty,
            model.cartesianScene.vectorSet1.resultantVector.isDefinedProperty,
            model.cartesianScene.vectorSet1.numberOfVectorsOnGraphProperty
          ],
          ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
        ),
        vectorSet1Symbol: model.cartesianScene.vectorSet1.accessibleSymbolProperty,
        vectorSet2Size: new DerivedProperty( [
            viewProperties.sum2VisibleProperty,
            model.cartesianScene.vectorSet2.resultantVector.isDefinedProperty,
            model.cartesianScene.vectorSet2.numberOfVectorsOnGraphProperty
          ],
          ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
        ),
        vectorSet2Symbol: model.cartesianScene.vectorSet2.accessibleSymbolProperty
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
      accessibleParagraph: new PatternStringProperty( VectorAdditionStrings.a11y.graphArea.accessibleParagraphLabStringProperty, {
        vectorSet1Size: new DerivedProperty( [
            viewProperties.sum1VisibleProperty,
            model.polarScene.vectorSet1.resultantVector.isDefinedProperty,
            model.polarScene.vectorSet1.numberOfVectorsOnGraphProperty
          ],
          ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
        ),
        vectorSet1Symbol: model.polarScene.vectorSet1.accessibleSymbolProperty,
        vectorSet2Size: new DerivedProperty( [
            viewProperties.sum2VisibleProperty,
            model.polarScene.vectorSet2.resultantVector.isDefinedProperty,
            model.polarScene.vectorSet2.numberOfVectorsOnGraphProperty
          ],
          ( sumVisible, resultantIsDefined, numberOfVectors ) => ( sumVisible && resultantIsDefined ) ? numberOfVectors + 1 : numberOfVectors
        ),
        vectorSet2Symbol: model.polarScene.vectorSet2.accessibleSymbolProperty
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
      sceneRadioButtonGroup,
      cartesianSceneNode.originManipulator,
      polarSceneNode.originManipulator,
      this.resetAllButton
    ];
  }

  public override reset(): void {
    this.viewProperties.reset();
    super.reset();
  }
}

vectorAddition.register( 'LabScreenView', LabScreenView );