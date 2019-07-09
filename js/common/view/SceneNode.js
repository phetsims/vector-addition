// Copyright 2019, University of Colorado Boulder

/**
 * View for a scene node (https://github.com/phetsims/vector-addition/issues/65#issuecomment-509493028)
 *
 * A scene node is a view that contains:
 *  - Graph Node
 *  - Inspect a Vector Panel
 *  - Different containers for each and every type of vectors (handle z-layering,
 *      see https://github.com/phetsims/vector-addition/issues/19)
 *  - Ability to add a vector creator panel
 *
 * Scene nodes allow a screen to have multiple scenes. For instance, eplore1D has a polar and a vector scene.
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

        includeEraser: true, // {boolean} false means the eraser will not be included

        listenToVectorSet: true, // {boolean} performance flag. If true, this will listen to the vector set observable
        // array and update the scene. If false, this will not listen and will just add the vectors that are in the 
        // array upon initialization (all vectors must be not removable)

        inspectVectorPanelOptions: null, // {Object} options passed to the inspectVectorPanel
      }, options );

      super();

      //----------------------------------------------------------------------------------------
      const graphNode = new GraphNode( graph, gridVisibleProperty );

      const inspectVectorPanel = new InspectVectorPanel( graph, options.inspectVectorPanelOptions );

      // Create the containers for each vector type

      // @public {Node}
      this.vectorContainer = new Node();

      const vectorSumContainer = new Node();

      const vectorComponentContainer = new Node();

      const vectorSumComponentContainer = new Node();

      this.setChildren( [
        graphNode,
        inspectVectorPanel,
        vectorComponentContainer,
        this.vectorContainer,
        vectorSumComponentContainer,
        vectorSumContainer
      ] );

      if ( options.includeEraser ) {
        this.addChild( new EraserButton( {
          listener: () => {
            graph.erase();
          },
          left: graphNode.right,
          bottom: graphNode.bottom
        } ) );
      }

      /*---------------------------------------------------------------------------*
       * Loop through each vector set, updating the scene
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


        if ( options.listenToVectorSet ) {
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

            this.vectorComponentContainer.addChild( xComponentNode );
            this.vectorComponentContainer.addChild( yComponentNode );

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
        }
        else {
          // Double check that all vectors are not removable
          assert && assert( !vectorSet.vectors.some( vector => vector.isRemovable ) );

          // Add the non removable vectors
          vectorSet.vectors.forEach( vector => {
            const vectorNode = new VectorNode( vector,
              graph,
              valuesVisibleProperty,
              angleVisibleProperty );
            vectorComponentContainer.addChild( xComponentNode );
            vectorComponentContainer.addChild( yComponentNode );
            vectorContainer.addChild( vectorNode );
          } );
        }
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