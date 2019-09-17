// Copyright 2019, University of Colorado Boulder

/**
 * View for a scene node. Scene nodes allow screens to have multiple 'scenes'. For instance, 'Explore 2D' has a polar
 * and a cartesian 'scene' and 'Explore 1D' has a horizontal and a vertical 'scene'.
 *
 * ## A 'Scene Node' contains:
 *  - a single GraphNode
 *  - a single VectorValuesToggleBox
 *  - Handle z-layering of all vector types (see https://github.com/phetsims/vector-addition/issues/19)
 *  - An option to include an EraserButton
 *  - A method to add a VectorCreatorPanel
 *
 * ## API
 *  - Not required to tell the Scene Node to create the Vector Sum Nodes and their Components (does this automatically
 *    for each VectorSet in the Graph)
 *  - However, it is required to 'tell' the Scene Node when other Vectors are created (see registerVector()). Once this
 *    is called, the Vector Nodes/Components are made and deleted once the Vector is removed.
 *
 * NOTE: SceneNode will not toggle its visibility based on when the GraphOrientation or the CoordinateSnapMode
 *       changes. This must be done externally.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ComponentVectorNode = require( 'VECTOR_ADDITION/common/view/ComponentVectorNode' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const Event = require( 'SCENERY/input/Event' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const SumComponentVectorNode = require( 'VECTOR_ADDITION/common/view/SumComponentVectorNode' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const VectorSumNode = require( 'VECTOR_ADDITION/common/view/VectorSumNode' );
  const VectorValuesToggleBox = require( 'VECTOR_ADDITION/common/view/VectorValuesToggleBox' );

  class SceneNode extends Node {

    /**
     * @param {Graph} graph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} anglesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {BooleanProperty} vectorValuesExpandedProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options] - all options are specific to this class
     */
    constructor( graph,
                 valuesVisibleProperty,
                 anglesVisibleProperty,
                 gridVisibleProperty,
                 vectorValuesExpandedProperty,
                 componentStyleProperty,
                 options
    ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty,
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on options: ${options}` );

      //========================================================================================

      options = _.extend( {

        // all options are specific to this class
        includeEraser: true, // {boolean} Indicates if an Eraser Button should be included
        vectorValuesToggleBoxOptions: null // {Object} Options passed to the VectorValuesToggleBox
      }, options );

      super();

      //========================================================================================

      // Create one and only Graph Node
      const graphNode = new GraphNode( graph, gridVisibleProperty );

      const graphViewBounds = graph.graphViewBounds;

      // Create the one and only 'Vector Values' toggle box
      const vectorValuesToggleBox = new VectorValuesToggleBox( graph, _.extend( {
        expandedProperty: vectorValuesExpandedProperty,
        centerX: graphViewBounds.centerX,
        top: 35 // determined empirically
      }, options.vectorValuesToggleBoxOptions ) );

      //----------------------------------------------------------------------------------------
      // Create containers for each and every type of Vector to handle z-layering of all vector types.

      // @private {Node}
      this.vectorContainer = new Node();              // Container for the Vector Nodes
      this.vectorComponentContainer = new Node();     // Container for the Vector Component Nodes
      this.vectorSumContainer = new Node();          // Container for the Vector Sum Container
      this.vectorSumComponentContainer = new Node(); // Container for the Component Nodes of Vector Sums
      this.baseVectorContainer = new Node();          // Container for the Base Vectors on the Equation Screen

      // Add the children in the correct z-order
      this.setChildren( [
        graphNode,
        vectorValuesToggleBox,
        this.baseVectorContainer,
        this.vectorComponentContainer,
        this.vectorContainer,
        this.vectorSumComponentContainer,
        this.vectorSumContainer
      ] );

      //========================================================================================
      // Add an eraser if necessary
      if ( options.includeEraser ) {

        const eraserButton = new EraserButton( {
          listener: () => graph.erase(),
          right: graphViewBounds.maxX,
          top: graphViewBounds.maxY + 15
        } );
        this.addChild( eraserButton );

        eraserButton.moveToBack(); // move to back to keep the Vector Containers on top

        // Disable the eraser button when the number of vectors on the graph is zero, that is, when all vector sets
        // contain no vectors. This is a bit more complicated than it should be, but it was added late in the
        // development process.
        const lengthProperties = _.map( graph.vectorSets, vectorSet => vectorSet.vectors.lengthProperty );
        Property.multilink( lengthProperties, () => {
          const numberOfVectors = _.sumBy( lengthProperties, lengthProperty => lengthProperty.value );
          eraserButton.enabled = ( numberOfVectors !== 0 );
        } );
      }

      //========================================================================================
      // Add the Vector Sum Node and its components for each Vector Set in the graph
      //========================================================================================
      graph.vectorSets.forEach( vectorSet => {

        const vectorSumNode = new VectorSumNode( vectorSet.vectorSum,
          graph,
          valuesVisibleProperty,
          anglesVisibleProperty,
          vectorSet.sumVisibleProperty
        );

        const xComponentSumNode = new SumComponentVectorNode( vectorSet.vectorSum.xComponentVector,
          graph,
          componentStyleProperty,
          valuesVisibleProperty,
          vectorSet.sumVisibleProperty );

        const yComponentSumNode = new SumComponentVectorNode( vectorSet.vectorSum.yComponentVector,
          graph,
          componentStyleProperty,
          valuesVisibleProperty,
          vectorSet.sumVisibleProperty );

        this.addVectorSumNode( vectorSumNode );
        this.addVectorSumComponentNode( xComponentSumNode );
        this.addVectorSumComponentNode( yComponentSumNode );
      } );

      // @protected for layout in subclasses
      this.vectorValuesToggleBox = vectorValuesToggleBox;

      // @private
      this.vectorValuesToggleBox = vectorValuesToggleBox;
      this.componentStyleProperty = componentStyleProperty;
      this.graph = graph;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.anglesVisibleProperty = anglesVisibleProperty;
    }

    /**
     * 'Registers a Vector' by creating the Vector Node and the Component Nodes for a newly created Vector. The Nodes
     * are deleted if Vector is ever removed from its Vector Set.
     * @public
     *
     * @param {Vector} vector - the Vector Model
     * @param {VectorSet} vectorSet - the Vector Set the vector belongs to
     * @param {Event} [forwardingEvent] - if provided, if will forward this event to the Vector body drag listener.
     *                                    This is used to forward the click event from the Vector Creator Panel to the
     *                                    Vector Node. If not provided, not event is forwarded.
     */
    registerVector( vector, vectorSet, forwardingEvent ) {

      assert && assert( vector instanceof Vector, `invalid vector: ${vector}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( !forwardingEvent || forwardingEvent instanceof Event, `invalid forwardingEvent: ${forwardingEvent}` );

      const vectorNode = new VectorNode( vector, this.graph, this.valuesVisibleProperty, this.anglesVisibleProperty );

      const xComponentNode = new ComponentVectorNode( vector.xComponentVector,
        this.graph,
        this.componentStyleProperty,
        this.valuesVisibleProperty );

      const yComponentNode = new ComponentVectorNode( vector.yComponentVector,
        this.graph,
        this.componentStyleProperty,
        this.valuesVisibleProperty );

      this.addVectorNode( vectorNode );
      this.addVectorComponentNode( xComponentNode );
      this.addVectorComponentNode( yComponentNode );

      if ( forwardingEvent ) {
        vectorNode.bodyDragListener.press( forwardingEvent, vectorNode );
      }

      //----------------------------------------------------------------------------------------
      // If the Vector could be removed, observe when the Vector Set deletes the Vector to dispose
      // the Nodes
      if ( vector.isRemovable ) {

        const removalListener = removedVector => {
          if ( removedVector === vector ) {

            xComponentNode.dispose();
            yComponentNode.dispose();
            vectorNode.dispose();

            // remove the listener
            vectorSet.vectors.removeItemRemovedListener( removalListener );
          }
        };

        vectorSet.vectors.addItemRemovedListener( removalListener );
      }
    }

    /**
     * Adds a Vector Creator Panel to the scene.
     * @public
     * @param {VectorCreatorPanel} vectorCreatorPanel
     */
    addVectorCreatorPanel( vectorCreatorPanel ) {
      assert && assert( vectorCreatorPanel instanceof VectorCreatorPanel, `invalid vectorCreatorPanel: ${vectorCreatorPanel}` );

      this.addChild( vectorCreatorPanel );
      vectorCreatorPanel.moveToBack(); // move to back to ensure the Vector Containers are on top
    }

    /**
     * Adds a main vector to the scene.
     * @param {VectorNode} node
     * @private
     */
    addVectorNode( node ) {
      this.vectorContainer.addChild( node );
    }

    /**
     * Adds a main component vector to the scene.
     * @param {VectorNode} node
     * @private
     */
    addVectorComponentNode( node ) {
      this.vectorComponentContainer.addChild( node );
    }

    /**
     * Adds a sum vector to the scene.
     * @param {VectorNode} node
     * @private
     */
    addVectorSumNode( node ) {
      this.vectorSumContainer.addChild( node );
    }

    /**
     * Adds a sum component vector to the scene.
     * @param {VectorNode} node
     * @private
     */
    addVectorSumComponentNode( node ) {
      this.vectorSumComponentContainer.addChild( node );
    }

    /**
     * Adds a base vector to the scene.
     * @protected
     * @param {VectorNode} node
     */
    addBaseVectorNode( node ) {
      this.baseVectorContainer.addChild( node );
    }
  }

  return vectorAddition.register( 'SceneNode', SceneNode );
} );