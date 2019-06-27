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
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSumComponentNode = require( 'VECTOR_ADDITION/common/view/VectorSumComponentNode' );
  const VectorSumNode = require( 'VECTOR_ADDITION/common/view/VectorSumNode' );

  class SceneNode extends Node {
    /**
     * @constructor
     * @param {Graph} graph
     * @param {BooleanProperty} gridVisibleProperty,
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {BooleanProperty} angleVisibleProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {Object} [options]
     */
    constructor( graph,
      gridVisibleProperty,
      componentStyleProperty,
      angleVisibleProperty,
      valuesVisibleProperty,
      options
    ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty, `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( angleVisibleProperty instanceof BooleanProperty, `invalid angleVisibleProperty: ${angleVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------
     
      options = _.extend( {
        inspectVectorPanelLocation: null, // {object|null}
        inspectVectorPanelOptions: null // {object|null}
      }, options );

      options.inspectVectorPanelLocation = _.extend( {
        left: 195,
        top: 12
      }, options.inspectVectorPanelLocation );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes

      const graphNode = new GraphNode( graph, gridVisibleProperty );

      const inspectVectorPanel = new InspectVectorPanel( graph.vectorSets, options.inspectVectorPanelOptions );

      const eraserButton = new EraserButton( {
        listener: () => {
          graph.erase();
          inspectVectorPanel.reset();
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
          new Node( _.extend( {
            children: [ inspectVectorPanel ]
          }, options.inspectVectorPanelLocation ) ),
          eraserButton,
          vectorComponentContainer,
          vectorSumComponentContainer,
          vectorContainer,
          vectorSumContainer
        ]
      } );

      /*---------------------------------------------------------------------------*
       * Loop through each vector set, observing changes and updating the scene
       *---------------------------------------------------------------------------*/
      graph.vectorSets.forEach( ( vectorSet ) => {

        // Create the node for the one and only sum node per vector set and its components
        const vectorSumNode = new VectorSumNode( vectorSet.vectorSum,
          graph,
          componentStyleProperty,
          angleVisibleProperty,
          valuesVisibleProperty,
          vectorSet.coordinateSnapMode,
          vectorSet.sumVisibleProperty
        );

        const xComponentSumNode = new VectorSumComponentNode( vectorSet.vectorSum.xVectorComponent,
          graph.modelViewTransformProperty,
          componentStyleProperty,
          valuesVisibleProperty,
          vectorSet.sumVisibleProperty );

        const yComponentSumNode = new VectorSumComponentNode( vectorSet.vectorSum.yVectorComponent,
          graph.modelViewTransformProperty,
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
          
          // Create the node for the newly added model vector and its components
          const vectorNode = new VectorNode( addedVector,
            graph,
            componentStyleProperty,
            angleVisibleProperty,
            valuesVisibleProperty,
            vectorSet.coordinateSnapMode
          );

          const xComponentNode = new VectorComponentNode( addedVector.xVectorComponent,
            graph.modelViewTransformProperty,
            componentStyleProperty,
            valuesVisibleProperty );

          const yComponentNode = new VectorComponentNode( addedVector.yVectorComponent,
            graph.modelViewTransformProperty,
            componentStyleProperty,
            valuesVisibleProperty );

          vectorContainer.addChild( vectorNode );
          vectorComponentContainer.addChild( xComponentNode );
          vectorComponentContainer.addChild( yComponentNode );

          //----------------------------------------------------------------------------------------
          // Add the removal listener for when the vector is removed
          const removalListener = removedVector => {
            if ( removedVector === addedVector ) {

              // deactivate
              removedVector.isActiveProperty.value = false;

              // Dispose of the vector and its model
              vectorNode.dispose();
              xComponentNode.dispose();
              yComponentNode.dispose();
              removedVector.dispose();

              vectorSet.vectors.removeItemRemovedListener( removalListener );
            }
          };

          vectorSet.vectors.addItemRemovedListener( removalListener );
        } );
      } );

      // @private, {function} function to reset the scene
      this.resetScene = () => {
        graphNode.reset();
        graph.reset();
        inspectVectorPanel.reset();
      };
    }

    /**
     * Resets the scene
     * @public
     */
    reset() {
      this.resetScene();
    }
  }

  return vectorAddition.register( 'SceneNode', SceneNode );
} );