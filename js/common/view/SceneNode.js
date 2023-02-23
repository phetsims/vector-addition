// Copyright 2019-2023, University of Colorado Boulder

/**
 * View for a scene node. Scene nodes allow screens to have multiple 'scenes'. For instance, 'Explore 2D' has a polar
 * and a Cartesian 'scene' and 'Explore 1D' has a horizontal and a vertical 'scene'.
 *
 * ## A 'Scene Node' contains:
 *  - a single GraphNode
 *  - a single VectorValuesToggleBox
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

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import { Node, SceneryEvent } from '../../../../scenery/js/imports.js';
import vectorAddition from '../../vectorAddition.js';
import Graph from '../model/Graph.js';
import Vector from '../model/Vector.js';
import VectorSet from '../model/VectorSet.js';
import GraphNode from './GraphNode.js';
import VectorAdditionViewProperties from './VectorAdditionViewProperties.js';
import VectorCreatorPanel from './VectorCreatorPanel.js';
import VectorSetNode from './VectorSetNode.js';
import VectorValuesToggleBox from './VectorValuesToggleBox.js';

export default class SceneNode extends Node {

  /**
   * @param {Graph} graph
   * @param {VectorAdditionViewProperties} viewProperties
   * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
   * @param {Object} [options] - all options are specific to this class, not passed to superclass
   */
  constructor( graph, viewProperties, componentStyleProperty, options ) {

    assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
    assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );
    assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    //========================================================================================

    options = merge( {

      // all options are specific to this class
      includeEraser: true, // {boolean} Indicates if an EraserButton should be included

      // {Object} Options passed to the VectorValuesToggleBox
      vectorValuesToggleBoxOptions: {
        expandedProperty: viewProperties.vectorValuesExpandedProperty,
        centerX: graph.graphViewBounds.centerX,
        top: 35 // determined empirically
      }
    }, options );

    super();

    //========================================================================================

    // Create one and only GraphNode
    const graphNode = new GraphNode( graph, viewProperties.gridVisibleProperty );

    // Create the one and only 'Vector Values' toggle box
    const vectorValuesToggleBox = new VectorValuesToggleBox( graph, options.vectorValuesToggleBoxOptions );

    //----------------------------------------------------------------------------------------
    // Create containers for each and every type of Vector to handle z-layering of all vector types.

    // @private {Node} parent for all VectorSetNodes
    this.vectorSetNodesParent = new Node();

    // Add the children in the correct z-order
    this.setChildren( [
      graphNode,
      vectorValuesToggleBox,
      this.vectorSetNodesParent
    ] );

    // Add an eraser button if necessary
    if ( options.includeEraser ) {

      const eraserButton = new EraserButton( {
        listener: () => {
          this.interruptSubtreeInput(); // cancel all interactions for the scene
          graph.erase();
        },
        right: graph.graphViewBounds.maxX,
        top: graph.graphViewBounds.maxY + 15,
        touchAreaXDilation: 7,
        touchAreaYDilation: 7
      } );
      this.addChild( eraserButton );
      eraserButton.moveToBack();

      // Disable the eraser button when the number of vectors on the graph is zero, that is, when all vector sets
      // contain no vectors. This is a bit more complicated than it should be, but it was added late in the
      // development process.
      // unmultilink is unnecessary, exists for the lifetime of the sim.
      const lengthProperties = _.map( graph.vectorSets, vectorSet => vectorSet.vectors.lengthProperty );
      Multilink.multilink( lengthProperties, () => {
        const numberOfVectors = _.sumBy( lengthProperties, lengthProperty => lengthProperty.value );
        eraserButton.enabled = ( numberOfVectors !== 0 );
      } );
    }

    // private {VectorSetNode[]} a layer for each VectorSet
    this.vectorSetNodes = [];
    graph.vectorSets.forEach( vectorSet => {
      const vectorSetNode = new VectorSetNode( graph, vectorSet,
        viewProperties.valuesVisibleProperty, viewProperties.anglesVisibleProperty, componentStyleProperty );
      this.vectorSetNodesParent.addChild( vectorSetNode );
      this.vectorSetNodes.push( vectorSetNode );
    } );

    // @protected for layout in subclasses
    this.vectorValuesToggleBox = vectorValuesToggleBox;

    // @private
    this.vectorSets = graph.vectorSets;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'SceneNode is not intended to be disposed' );
  }

  /**
   * Gets the VectorSetNode associated with a VectorSet.
   * @private
   * @param {VectorSet} vectorSet
   * @returns {VectorSetNode}
   */
  getVectorSetNode( vectorSet ) {
    const index = this.vectorSets.indexOf( vectorSet );
    assert && assert( index !== -1, `vectorSet not found: ${vectorSet}` );
    return this.vectorSetNodes[ index ];
  }

  /**
   * Registers a Vector, delegates to VectorSetNode.
   * @public
   * @param {Vector} vector - the vector model
   * @param {VectorSet} vectorSet - the VectorSet the vector belongs to
   * @param {SceneryEvent} [forwardingEvent] - see VectorSetNode
   */
  registerVector( vector, vectorSet, forwardingEvent ) {

    assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
    assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
    assert && assert( !forwardingEvent || forwardingEvent instanceof SceneryEvent, `invalid forwardingEvent: ${forwardingEvent}` );

    // Delegate registration to the VectorSetNode
    this.getVectorSetNode( vectorSet ).registerVector( vector, forwardingEvent );
  }

  /**
   * Adds a base vector to the scene.  Delegates to VectorSetNode.
   * @protected
   * @param {VectorSet} vectorSet
   * @param {BaseVector} baseVector
   * @param {Property.<boolean>} baseVectorsVisibleProperty
   */
  addBaseVector( vectorSet, baseVector, baseVectorsVisibleProperty ) {
    this.getVectorSetNode( vectorSet ).addBaseVector( baseVector, baseVectorsVisibleProperty );
  }

  /**
   * Adds a VectorCreatorPanel to the scene.
   * @public
   * @param {VectorCreatorPanel} vectorCreatorPanel
   */
  addVectorCreatorPanel( vectorCreatorPanel ) {
    assert && assert( vectorCreatorPanel instanceof VectorCreatorPanel, `invalid vectorCreatorPanel: ${vectorCreatorPanel}` );

    this.addChild( vectorCreatorPanel );
    vectorCreatorPanel.moveToBack();
  }
}

vectorAddition.register( 'SceneNode', SceneNode );