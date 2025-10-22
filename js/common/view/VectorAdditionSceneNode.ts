// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorAdditionSceneNode is the base class for displaying a scene.
 *
 * Contains:
 *  - a single GraphNode
 *  - a single VectorValuesAccordionBox
 *  - Handle z-layering of all vector types (see https://github.com/phetsims/vector-addition/issues/19)
 *  - An option to include an EraserButton
 *  - A method to add a VectorToolbox
 *
 * API:
 *  - Not required to tell the Scene Node to create the SumVectorNodes and their Components (does this automatically
 *    for each VectorSet in the VectorAdditionScene)
 *  - However, it is required to 'tell' the Scene Node when other Vectors are created (see registerVector()). Once this
 *    is called, the Vector Nodes/Components are made and deleted once the Vector is removed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import Vector from '../model/Vector.js';
import VectorSet from '../model/VectorSet.js';
import GraphNode from './GraphNode.js';
import VectorAdditionViewProperties from './VectorAdditionViewProperties.js';
import VectorToolbox from './VectorToolbox.js';
import VectorSetNode from './VectorSetNode.js';
import VectorValuesAccordionBox from './VectorValuesAccordionBox.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionEraserButton from './VectorAdditionEraserButton.js';

type SelfOptions = {
  includeEraserButton?: boolean; // Indicates if an EraserButton should be included
};

export type SceneNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VectorAdditionSceneNode extends Node {

  // Public for pdomOrder at ScreenView level.
  public readonly graphNode: Node;
  public readonly originManipulator: Node;
  public readonly vectorSetNodesParent: Node;
  public readonly vectorValuesAccordionBox: Node;
  public vectorToolbox: Node | null;
  public eraserButton: Node | null;

  // a layer for each VectorSet
  private readonly vectorSetNodes: VectorSetNode[];

  private readonly vectorSets: VectorSet[];

  protected constructor( scene: VectorAdditionScene,
                         sceneProperty: TReadOnlyProperty<VectorAdditionScene>,
                         resultantVectorVisibleProperties: TReadOnlyProperty<boolean>[],
                         viewProperties: VectorAdditionViewProperties,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         providedOptions: SceneNodeOptions ) {

    const options = optionize<SceneNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      includeEraserButton: true,

      // NodeOptions
      isDisposable: false,
      visibleProperty: new DerivedProperty( [ sceneProperty ], value => value === scene )
    }, providedOptions );

    super( options );

    this.vectorSets = scene.vectorSets;
    this.vectorToolbox = null;

    // Graph
    const graphNode = new GraphNode( scene.graph, viewProperties.gridVisibleProperty, scene.selectedVectorProperty,
      options.tandem.createTandem( 'graphNode' ) );
    this.graphNode = graphNode;
    this.originManipulator = graphNode.originManipulator;

    // 'Vector Values' accordion box
    this.vectorValuesAccordionBox = new VectorValuesAccordionBox( scene.selectedVectorProperty, scene.graph.bounds, {
      expandedProperty: viewProperties.vectorValuesAccordionBoxExpandedProperty,
      centerX: scene.graph.viewBounds.centerX,
      top: 35, // determined empirically
      tandem: options.tandem.createTandem( 'vectorValuesAccordionBox' )
    } );

    // A layer for each VectorSet
    affirm( resultantVectorVisibleProperties.length === scene.vectorSets.length, 'resultantVectorVisibleProperties length mismatch.' );
    this.vectorSetNodesParent = new Node();
    this.vectorSetNodes = [];
    scene.vectorSets.forEach( ( vectorSet, index ) => {

      const vectorSetNode = new VectorSetNode(
        vectorSet,
        scene.graph.modelViewTransformProperty,
        scene.selectedVectorProperty,
        resultantVectorVisibleProperties[ index ],
        viewProperties.valuesVisibleProperty,
        viewProperties.anglesVisibleProperty,
        scene.graph.boundsProperty,
        componentVectorStyleProperty,
        // There is nothing interesting under here for PhET-iO, so we decided to uninstrument. If it needs to be
        // instrumented in the future, use options.tandem.createTandem( `${vectorSet.tandem.name}Node` ).
        Tandem.OPT_OUT );

      this.vectorSetNodesParent.addChild( vectorSetNode );
      this.vectorSetNodes.push( vectorSetNode );
    } );

    // Add the children in the correct z-order.
    this.setChildren( [
      this.graphNode,
      this.vectorValuesAccordionBox,
      this.vectorSetNodesParent
    ] );

    // Optional eraser button
    this.eraserButton = null;
    if ( options.includeEraserButton ) {
      console.log( 'includeEraserButton' );

      const numberOfVectorsOnGraphProperties = _.map( scene.vectorSets, vectorSet => vectorSet.numberOfVectorsOnGraphProperty );
      const numberOfVectorsOnGraphProperty = DerivedProperty.deriveAny( numberOfVectorsOnGraphProperties,
        () => _.sumBy( numberOfVectorsOnGraphProperties, numberOfVectorsOnGraphProperties => numberOfVectorsOnGraphProperties.value ) );

      this.eraserButton = new VectorAdditionEraserButton( numberOfVectorsOnGraphProperty, {
        listener: () => {
          this.interruptSubtreeInput(); // cancel all interactions for the scene
          scene.erase();
        },
        right: scene.graph.viewBounds.maxX,
        top: scene.graph.viewBounds.maxY + 15,
        tandem: options.tandem.createTandem( 'eraserButton' )
      } );
      this.addChild( this.eraserButton );
      this.eraserButton.moveToBack();
    }

    this.addLinkedElement( scene );
  }

  /**
   * Gets the VectorSetNode associated with a VectorSet.
   */
  protected getVectorSetNode( vectorSet: VectorSet ): VectorSetNode {

    affirm( this.vectorSets.length === this.vectorSetNodes.length, 'Expected a node for every vector set.' );
    const index = this.vectorSets.indexOf( vectorSet );
    affirm( index !== -1, 'vectorSet not found' );

    const vectorSetNode = this.vectorSetNodes[ index ];
    affirm( vectorSetNode.vectorSet === vectorSet, 'vectorSetNode mismatch.' );

    return vectorSetNode;
  }

  /**
   * Registers a Vector, delegates to VectorSetNode.
   * @param vector - the vector model
   * @param vectorSet - the VectorSet the vector belongs to
   * @param [forwardingEvent] - see VectorSetNode
   */
  public registerVector( vector: Vector, vectorSet: VectorSet, forwardingEvent?: PressListenerEvent ): void {
    this.getVectorSetNode( vectorSet ).registerVector( vector, forwardingEvent );
  }

  /**
   * Adds a VectorToolbox to the scene.
   */
  public addVectorToolbox( vectorCreatorPanel: VectorToolbox ): void {
    affirm( !this.vectorToolbox, 'addVectorToolbox can only be called once.' );
    this.vectorToolbox = vectorCreatorPanel;
    this.addChild( this.vectorToolbox );
    this.vectorToolbox.moveToBack();
  }
}

vectorAddition.register( 'VectorAdditionSceneNode', VectorAdditionSceneNode );