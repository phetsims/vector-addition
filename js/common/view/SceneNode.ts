// Copyright 2019-2025, University of Colorado Boulder

/**
 * View for a scene node. Scene nodes allow screens to have multiple 'scenes'. For instance, 'Explore 2D' has a polar
 * and a Cartesian 'scene' and 'Explore 1D' has a horizontal and a vertical 'scene'.
 *
 * ## A 'Scene Node' contains:
 *  - a single GraphNode
 *  - a single VectorValuesAccordionBox
 *  - Handle z-layering of all vector types (see https://github.com/phetsims/vector-addition/issues/19)
 *  - An option to include an EraserButton
 *  - A method to add a VectorCreatorPanel
 *
 * ## API
 *  - Not required to tell the Scene Node to create the SumVectorNodes and their Components (does this automatically
 *    for each VectorSet in the Graph)
 *  - However, it is required to 'tell' the Scene Node when other Vectors are created (see registerVector()). Once this
 *    is called, the Vector Nodes/Components are made and deleted once the Vector is removed.
 *
 * NOTE: SceneNode will not toggle its visibility based on when the GraphOrientation or the CoordinateSnapMode
 *       changes. This must be done externally.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import BaseVector from '../model/BaseVector.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import Graph from '../model/Graph.js';
import Vector from '../model/Vector.js';
import VectorSet from '../model/VectorSet.js';
import GraphNode from './GraphNode.js';
import VectorAdditionViewProperties from './VectorAdditionViewProperties.js';
import VectorCreatorPanel from './VectorCreatorPanel.js';
import VectorSetNode from './VectorSetNode.js';
import VectorValuesAccordionBox from './VectorValuesAccordionBox.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  includeEraser?: boolean; // Indicates if an EraserButton should be included
};

export type SceneNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class SceneNode extends Node {

  // Public for pdomOrder at ScreenView level.
  public readonly graphNode: GraphNode;
  public readonly vectorSetNodesParent: Node;
  public readonly vectorValuesAccordionBox: Node;
  public vectorCreatorPanel: Node | null;
  public eraserButton: Node | null;

  // a layer for each VectorSet
  private readonly vectorSetNodes: VectorSetNode[];

  private readonly vectorSets: VectorSet[];

  public constructor( graph: Graph,
                      viewProperties: VectorAdditionViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      providedOptions: SceneNodeOptions ) {

    const options = optionize<SceneNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      includeEraser: true,

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    //========================================================================================

    // Create one and only GraphNode
    this.graphNode = new GraphNode( graph, viewProperties.gridVisibleProperty, options.tandem.createTandem( 'graphNode' ) );

    // Create the one and only 'Vector Values' accordion box
    this.vectorValuesAccordionBox = new VectorValuesAccordionBox( graph, {
      expandedProperty: viewProperties.vectorValuesAccordionBoxExpandedProperty,
      centerX: graph.viewBounds.centerX,
      top: 35, // determined empirically
      tandem: options.tandem.createTandem( 'vectorValuesAccordionBox' )
    } );

    //----------------------------------------------------------------------------------------
    // Create containers for each and every type of Vector to handle z-layering of all vector types.

    this.vectorSetNodesParent = new Node();

    // Add the children in the correct z-order
    this.setChildren( [
      this.graphNode,
      this.vectorValuesAccordionBox,
      this.vectorSetNodesParent
    ] );

    // Add an eraser button if necessary
    this.eraserButton = null;
    if ( options.includeEraser ) {

      this.eraserButton = new EraserButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel all interactions for the scene
          graph.erase();
        },
        right: graph.viewBounds.maxX,
        top: graph.viewBounds.maxY + 15,
        touchAreaXDilation: 7,
        touchAreaYDilation: 7,
        tandem: options.tandem.createTandem( 'eraserButton' ),
        phetioEnabledPropertyInstrumented: false // sim controls this.
      } );
      this.addChild( this.eraserButton );
      this.eraserButton.moveToBack();

      // Disable the eraser button when the number of vectors on the graph is zero, that is, when all vector sets
      // contain no vectors. This is a bit more complicated than it should be, but it was added late in the
      // development process.
      // unmultilink is unnecessary, exists for the lifetime of the sim.
      const lengthProperties = _.map( graph.vectorSets, vectorSet => vectorSet.vectors.lengthProperty );
      Multilink.multilinkAny( lengthProperties, () => {
        const numberOfVectors = _.sumBy( lengthProperties, lengthProperty => lengthProperty.value );
        this.eraserButton!.enabled = ( numberOfVectors !== 0 );
      } );
    }

    // a layer for each VectorSet
    this.vectorSetNodes = [];
    graph.vectorSets.forEach( vectorSet => {
      const vectorSetNode = new VectorSetNode( graph, vectorSet,
        viewProperties.valuesVisibleProperty, viewProperties.anglesVisibleProperty, componentVectorStyleProperty );
      this.vectorSetNodesParent.addChild( vectorSetNode );
      this.vectorSetNodes.push( vectorSetNode );
    } );

    this.vectorSets = graph.vectorSets;
    this.vectorCreatorPanel = null;
  }

  /**
   * Gets the VectorSetNode associated with a VectorSet.
   */
  private getVectorSetNode( vectorSet: VectorSet ): VectorSetNode {
    const index = this.vectorSets.indexOf( vectorSet );
    assert && assert( index !== -1, 'vectorSet not found' );
    return this.vectorSetNodes[ index ];
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
   * Adds a base vector Node to the scene.  Delegates to VectorSetNode.
   */
  protected addBaseVectorNode( vectorSet: VectorSet, baseVector: BaseVector, baseVectorsVisibleProperty: Property<boolean> ): void {
    this.getVectorSetNode( vectorSet ).addBaseVectorNode( baseVector, baseVectorsVisibleProperty, vectorSet.vectorColorPalette );
  }

  /**
   * Adds a VectorCreatorPanel to the scene.
   */
  public addVectorCreatorPanel( vectorCreatorPanel: VectorCreatorPanel ): void {
    assert && assert( !this.vectorCreatorPanel, 'addVectorCreatorPanel can only be called once.' );
    this.vectorCreatorPanel = vectorCreatorPanel;
    this.addChild( this.vectorCreatorPanel );
    this.vectorCreatorPanel.moveToBack();
  }
}

vectorAddition.register( 'SceneNode', SceneNode );