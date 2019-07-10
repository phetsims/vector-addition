// Copyright 2019, University of Colorado Boulder

/**
 * View for a scene node (https://github.com/phetsims/vector-addition/issues/65#issuecomment-509493028)
 *
 * Scene nodes allow a screen to have multiple scenes. For instance, 'Explore1D' has a polar and a vertical.
 *
 * A scene node is a view that contains:
 *  - Graph Node
 *  - Inspect a Vector Panel
 *  - Handle z-layering of all vector types (see https://github.com/phetsims/vector-addition/issues/19)
 *  - eraser button (if include eraser option is true)
 *  - vector creator panel
 *  - options to provide a container for base vectors
 *  - Adds vector sum nodes (w/ component nodes) and vector nodes
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const InspectVectorPanel = require( 'VECTOR_ADDITION/common/view/InspectVectorPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSumComponentNode = require( 'VECTOR_ADDITION/common/view/VectorSumComponentNode' );
  const VectorSumNode = require( 'VECTOR_ADDITION/common/view/VectorSumNode' );


  class SceneNode extends Node {
    /**
     * @constructor
     *
     * @param {Graph} graph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options] - Various key-value pairs that control the appearance and behavior. All options are
     *                             specific to this class
     */
    constructor( graph,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 componentStyleProperty,
                 options
    ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty,
        `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on options: ${options}` );

      options = _.extend( {

        includeEraser: true, // {boolean} false means the eraser node won't be included

        includeBaseVectors: false, // {boolean} true means there will be a base vectors container

        inspectVectorPanelOptions: null, // {Object} options passed to the inspectVectorPanel

        sumNodeOptions: null
      }, options );

      super();

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes
      //----------------------------------------------------------------------------------------

      // Create the graph node, each scene has exactly one graph
      const graphNode = new GraphNode( graph, gridVisibleProperty );

      // Create the 'Inspect a Vector' panel
      const inspectVectorPanel = new InspectVectorPanel( graph, options.inspectVectorPanelOptions );

      // Keep an array reference of the children
      const children = [ graphNode, inspectVectorPanel ];

      // Handle z-layering of all vector types: (see https://github.com/phetsims/vector-addition/issues/19)
      // @private {Node}
      this.vectorContainer = new Node();
      const vectorSumContainer = new Node();
      const vectorComponentContainer = new Node();
      const vectorSumComponentContainer = new Node();

      // Add an eraser if necessary
      if ( options.includeEraser ) {
        children.push( new EraserButton( {
          listener: () => {
            graph.erase();
          },
          left: graphNode.right,
          bottom: graphNode.bottom
        } ) );
      }

      // Add the base vector container if necessary
      if ( options.includeBaseVectors ) {

        // @public {Node}
        this.baseVectorContainer = new Node();
        children.push( this.baseVectorContainer );
      }

      children.push( vectorComponentContainer, this.vectorContainer, vectorSumComponentContainer, vectorSumContainer );
      this.children = children;

      //----------------------------------------------------------------------------------------
      // A graph can have vector sets that are predefined (not made from a vector creator panel).
      // The scene must add the nodes to mirror this. However, these vectors should be non
      // removable since there are no listeners to dispose the vector nodes.
      //----------------------------------------------------------------------------------------

      // function to add predefined vectors of a vector set
      const addPredefinedVectors = vectorSet => {
        
        vectorSet.vectors.forEach( vector => {
          assert && assert( vector.isRemovable === false, 'Predefined vector must not be removable' );
          
          const vectorNode = new VectorNode( vector,
            graph,
            valuesVisibleProperty,
            angleVisibleProperty );

          const xComponentNode = new VectorComponentNode( vector.xVectorComponentModel,
            graph,
            componentStyleProperty,
            valuesVisibleProperty );

          const yComponentNode = new VectorComponentNode( vector.yVectorComponentModel,
            graph,
            componentStyleProperty,
            valuesVisibleProperty );

          vectorComponentContainer.addChild( xComponentNode );
          vectorComponentContainer.addChild( yComponentNode );
          this.vectorContainer.addChild( vectorNode );
        } );
      };

      graph.vectorSets.forEach( addPredefinedVectors );

      //----------------------------------------------------------------------------------------
      // Function to update the add the scenery nodes for the vector sum related to a vector set
      //----------------------------------------------------------------------------------------
      const addVectorSumNodes = ( vectorSet ) => {
        const vectorSumNode = new VectorSumNode( vectorSet.vectorSum,
          graph,
          valuesVisibleProperty,
          angleVisibleProperty,
          vectorSet.sumVisibleProperty,
          options.sumNodeOptions
        );
        const xComponentSumNode = new VectorSumComponentNode( vectorSet.vectorSum.xVectorComponentModel,
          graph,
          componentStyleProperty,
          valuesVisibleProperty,
          vectorSet.sumVisibleProperty );

        const yComponentSumNode = new VectorSumComponentNode( vectorSet.vectorSum.yVectorComponentModel,
          graph,
          componentStyleProperty,
          valuesVisibleProperty,
          vectorSet.sumVisibleProperty );

        vectorSumComponentContainer.addChild( xComponentSumNode );
        vectorSumComponentContainer.addChild( yComponentSumNode );
        vectorSumContainer.addChild( vectorSumNode );
      };

      /*---------------------------------------------------------------------------*
       * Loop through each vector set, updating the scene
       *---------------------------------------------------------------------------*/
      graph.vectorSets.forEach( vectorSet => {
        addVectorSumNodes( vectorSet );
      
        /*---------------------------------------------------------------------------*
         * Observe changes to the vector set. These are vectors that are created in the vector creator panel
         *---------------------------------------------------------------------------*/
        // There isn't a need to remove the addItemAddedListener since vectorSets are never disposed
        vectorSet.vectors.addItemAddedListener( ( addedVector ) => {
          // only add the components since the vector node is created in the vector creator panel
          const xComponentNode = new VectorComponentNode( addedVector.xVectorComponentModel,
            graph,
            componentStyleProperty,
            valuesVisibleProperty );

          const yComponentNode = new VectorComponentNode( addedVector.yVectorComponentModel,
            graph,
            componentStyleProperty,
            valuesVisibleProperty );
          vectorComponentContainer.addChild( xComponentNode );
          vectorComponentContainer.addChild( yComponentNode );

          //----------------------------------------------------------------------------------------
          // Add the removal listener for when the vector is removed
          const removalListener = removedVector => {
            if ( removedVector === addedVector ) {

              xComponentNode.dispose();
              yComponentNode.dispose();

              vectorSet.vectors.removeItemRemovedListener( removalListener );
            }
          };

          vectorSet.vectors.addItemRemovedListener( removalListener );
        } );
      } );
    }

    /**
     * Adds a Vector Creator Panel to the scene
     * @param {VectorCreatorPanel} vectorCreatorPanel
     */
    addVectorCreatorPanel( vectorCreatorPanel ) {

      assert && assert( vectorCreatorPanel instanceof VectorCreatorPanel,
        `invalid vectorCreatorPanel: ${vectorCreatorPanel}` );

      this.addChild( vectorCreatorPanel );
      vectorCreatorPanel.moveToBack();
    }
  }

  return vectorAddition.register( 'SceneNode', SceneNode );
} );