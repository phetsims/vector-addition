// Copyright 2019, University of Colorado Boulder

/**
 * View for a scene node. Scene nodes allow screens to have multiple 'scenes'. For instance, 'Explore 2D' has a polar
 * and a cartesian 'scene' and 'Explore 1D' has a horizontal and a vertical 'scene'.
 *
 * ## A 'Scene Node' contains:
 *  - a single Graph Node
 *  - a single Vector Values Panel
 *  - Handle z-layering of all vector types (see https://github.com/phetsims/vector-addition/issues/19)
 *  - An option to include an Eraser Button
 *  - A method to add a Vector Creator Panel
 *
 * ## API
 *  - Not required to tell the Scene Node to create the Vector Sum Nodes and their Components (does this automatically
 *    for each VectorSet in the Graph)
 *  - However, it is required to 'tell' the Scene Node when other Vectors are created (see registerVector()). Once this
 *    is called, the Vector Nodes/Components are made and deleted once the Vector is removed.
 *
 * NOTE: Scene Node will not toggle its visibility based on when the Graph Orientation or the Coordinate Snap Mode
 *       changes. This must be done externally.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const ComponentVectorNode = require( 'VECTOR_ADDITION/common/view/ComponentVectorNode' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const Event = require( 'SCENERY/input/Event' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumComponentVectorNode = require( 'VECTOR_ADDITION/common/view/SumComponentVectorNode' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const VectorSumNode = require( 'VECTOR_ADDITION/common/view/VectorSumNode' );
  const VectorValuesAccordionBox = require( 'VECTOR_ADDITION/common/view/VectorValuesAccordionBox' );

  class SceneNode extends Node {

    /**
     * @param {Graph} graph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options] - all options are specific to this class
     */
    constructor( graph,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 componentStyleProperty,
                 options
    ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( _.every( [ valuesVisibleProperty, angleVisibleProperty, gridVisibleProperty ] ), BooleanProperty );
      assert && assert( ComponentStyles.includes( componentStyleProperty.value ) );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      //========================================================================================

      options = _.extend( {

        // all options are specific to this class
        includeEraser: true, // {boolean} Indicates if an Eraser Button should be included
        vectorValuesAccordionBoxOptions: null, // {Object} Options passed to the VectorValuesAccordionBox
        sumNodeOptions: null // {Object} Options passed to the Sum Node
      }, options );

      super();

      //========================================================================================


      // Create one and only Graph Node
      const graphNode = new GraphNode( graph, gridVisibleProperty );

      // Create the one and only 'Vector Values' panel
      const vectorValuesAccordionBox = new VectorValuesAccordionBox( graph, options.vectorValuesAccordionBoxOptions );
      vectorValuesAccordionBox.centerX = graphNode.centerX;

      //----------------------------------------------------------------------------------------
      // Create containers for each and every type of Vector to handle z-layering of all vector types.

      // @protected {Node}
      this.baseVectorContainer = new Node();          // Container for the Base Vectors on the Equation Screen
      this.baseVectorComponentContainer = new Node(); // Container for the Component Nodes of Base Vectors

      // @private {Node}
      this.vectorContainer = new Node();              // Container for the Vector Nodes
      this.vectorComponentContainer = new Node();     // Container for the Vector Component Nodes

      const vectorSumContainer = new Node();          // Container for the Vector Sum Container
      const vectorSumComponentContainer = new Node(); // Container for the Component Nodes of Vector Sums

      // Add the children in the correct z-order
      this.setChildren( [
        graphNode,
        vectorValuesAccordionBox,
        this.baseVectorComponentContainer,
        this.baseVectorContainer,
        this.vectorComponentContainer,
        this.vectorContainer,
        vectorSumComponentContainer,
        vectorSumContainer
      ] );

      //========================================================================================
      // Add an eraser if necessary
      if ( options.includeEraser ) {

        const eraser = new EraserButton( {
          listener: () => graph.erase(),
          left: graphNode.right,
          bottom: graphNode.bottom
        } );
        this.addChild( eraser );

        eraser.moveToBack(); // move to back to keep the Vector Containers on top
      }

      //========================================================================================
      // Add the Vector Sum Node and its components for each Vector Set in the graph
      //========================================================================================
      graph.vectorSets.forEach( vectorSet => {
        const vectorSumNode = new VectorSumNode( vectorSet.vectorSum,
          graph,
          valuesVisibleProperty,
          angleVisibleProperty,
          vectorSet.sumVisibleProperty,
          options.sumNodeOptions
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

        vectorSumComponentContainer.addChild( xComponentSumNode );
        vectorSumComponentContainer.addChild( yComponentSumNode );
        vectorSumContainer.addChild( vectorSumNode );
      } );

      // @private - create private references to parameters
      this.componentStyleProperty = componentStyleProperty;
      this.graph = graph;
      this.valuesVisibleProperty = valuesVisibleProperty;
      this.angleVisibleProperty = angleVisibleProperty;
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
      assert && assert( !forwardingEvent || forwardingEvent instanceof Event );

      const xComponentNode = new ComponentVectorNode( vector.xComponentVector,
        this.graph,
        this.componentStyleProperty,
        this.valuesVisibleProperty );

      const yComponentNode = new ComponentVectorNode( vector.yComponentVector,
        this.graph,
        this.componentStyleProperty,
        this.valuesVisibleProperty );

      const vectorNode = new VectorNode( vector, this.graph, this.valuesVisibleProperty, this.angleVisibleProperty );

      this.vectorComponentContainer.addChild( xComponentNode );
      this.vectorComponentContainer.addChild( yComponentNode );
      this.vectorContainer.addChild( vectorNode );

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
     *
     * @param {VectorCreatorPanel}
     */
    addVectorCreatorPanel( vectorCreatorPanel ) {

      assert && assert( vectorCreatorPanel instanceof VectorCreatorPanel );

      this.addChild( vectorCreatorPanel );

      vectorCreatorPanel.moveToBack(); // move to back to ensure the Vector Containers are on top
    }
  }

  return vectorAddition.register( 'SceneNode', SceneNode );
} );