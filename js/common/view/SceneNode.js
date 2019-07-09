// Copyright 2019, University of Colorado Boulder

/**
 * A node for a scene. A scene represents one graph and its vectors. Screens can have multiple
 * scenes (e.g. explore 1D has a horizontal scene and a vertical scene)
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
  const VectorSumComponentNode = require( 'VECTOR_ADDITION/common/view/VectorSumComponentNode' );
  const VectorSumNode = require( 'VECTOR_ADDITION/common/view/VectorSumNode' );

  class SceneNode extends Node {
    /**
     * @constructor
     * @param {Graph} graph
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [inspectPanelOptions] - options passed to inspect vector panel
     */
    constructor( graph,
                 valuesVisibleProperty,
                 angleVisibleProperty,
                 gridVisibleProperty,
                 componentStyleProperty,
                 inspectPanelOptions
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
      assert && assert( !inspectPanelOptions || Object.getPrototypeOf( inspectPanelOptions ) === Object.prototype,
        `Extra prototype on inspectPanelOptions: ${inspectPanelOptions}` );


      inspectPanelOptions = _.extend( {
        panelOptions: null // {object|null}
      }, inspectPanelOptions );

      inspectPanelOptions.panelOptions = _.extend( {
        left: 195,
        top: 12
      }, inspectPanelOptions.panelOptions );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes

      const graphNode = new GraphNode( graph, gridVisibleProperty );

      const inspectVectorPanel = new InspectVectorPanel( graph, inspectPanelOptions );

      const eraserButton = new EraserButton( {
        listener: () => {
          graph.erase();
        },
        left: graphNode.right,
        bottom: graphNode.bottom
      } );

      // Create the containers for each vector type
      const vectorContainer = new Node();
      const vectorSumContainer = new Node();
      const vectorComponentContainer = new Node();
      const vectorSumComponentContainer = new Node();

      super( {
        children: [
          graphNode,
          inspectVectorPanel,
          eraserButton,
          vectorComponentContainer,
          vectorSumComponentContainer,
          vectorContainer,
          vectorSumContainer
        ]
      } );

      // @public (read-only)
      this.vectorContainer = vectorContainer;

      /*---------------------------------------------------------------------------*
       * Loop through each vector set, observing changes and updating the scene
       *---------------------------------------------------------------------------*/
      graph.vectorSets.forEach( ( vectorSet ) => {

        // Create the node for the one and only sum node per vector set and its components
        const vectorSumNode = new VectorSumNode( vectorSet.vectorSum,
          graph,
          valuesVisibleProperty,
          angleVisibleProperty,
          vectorSet.sumVisibleProperty
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


        /*---------------------------------------------------------------------------*
         * Observe changes to the vector set, and update the scene
         *---------------------------------------------------------------------------*/
        vectorSet.vectors.addItemAddedListener( ( addedVector ) => {
          // There isn't a need to remove the addItemAddedListener since vectorSets are never disposed
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