// Copyright 2019, University of Colorado Boulder

/**
 * A node for a scene.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const InspectVectorPanel = require( 'VECTOR_ADDITION/common/view/InspectVectorPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSumNode = require( 'VECTOR_ADDITION/common/view/VectorSumNode' );
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );

  // constants
  const VECTOR_DISPLAY_PANEL_LOCATION_LEFT = 195;
  const VECTOR_DISPLAY_PANEL_LOCATION_TOP = 12;

  class SceneNode extends Node {
    /**
     * @constructor
     * @param {Graph} graph
     * @param {VectorAdditionModel} model
     * @param {Object} [inspectVectorPanelOptions]
     */
    constructor( graph, model, inspectVectorPanelOptions ) {

      super();

      // @public (read-only) {graph}
      this.graph = graph;

      // @public (read-only) {GraphNode} Create the Graph Node
      this.graphNode = new GraphNode( graph, model.gridVisibleProperty );

      // @private {InspectVectorPanel} Create the vector display panel
      this.inspectVectorPanel = new InspectVectorPanel( graph.vectorSets, inspectVectorPanelOptions );

      // set the panel in the correct location
      this.inspectVectorPanel.left = VECTOR_DISPLAY_PANEL_LOCATION_LEFT;
      this.inspectVectorPanel.top = VECTOR_DISPLAY_PANEL_LOCATION_TOP;

      // create the vector layer
      const vectorLayer = new Node();
      // create the vector sum layer
      const vectorSumLayer = new Node();

      const vectorComponentLayer = new Node();

      const vectorComponentSumLayer = new Node();

      graph.vectorSets.forEach( ( vectorSet ) => {

        // create a scenery node for the sum vector
        const vectorSumNode = new VectorSumNode(
          vectorSet.vectorSum,
          graph,
          model.componentStyleProperty,
          model.angleVisibleProperty,
          model.valuesVisibleProperty,
          vectorSet.coordinateSnapMode
        );
        
        // create the xComponentNode for the projection of the vectors along the horizontal
        const xComponentSumNode = new VectorComponentNode( vectorSet.vectorSum.xVectorComponent, graph.modelViewTransformProperty, model.componentStyleProperty, model.valuesVisibleProperty );

        // create the yComponent for the projection of the vector along the vertical
        const yComponentSumNode = new VectorComponentNode( vectorSet.vectorSum.yVectorComponent, graph.modelViewTransformProperty, model.componentStyleProperty, model.valuesVisibleProperty );

        vectorComponentSumLayer.addChild( xComponentSumNode );
        vectorComponentSumLayer.addChild( yComponentSumNode );

        vectorSet.sumVisibleProperty.linkAttribute( vectorSumNode, 'visible' );

        // TODO, this should be passed to the node and the node handles visibility
        vectorSet.sumVisibleProperty.link( visible => {
          vectorSumNode.visible = visible;
          xComponentSumNode.visible = visible;
          yComponentSumNode.visible = visible;
        });


        vectorSumLayer.addChild( vectorSumNode );

        // on the vector set, add a listener to the vectors attribute to add the vector to the scene
        vectorSet.vectors.addItemAddedListener( ( addedVector ) => {
          const vectorNode = new VectorNode(
            addedVector,
            graph,
            model.componentStyleProperty,
            model.angleVisibleProperty,
            model.valuesVisibleProperty,
            vectorSet.coordinateSnapMode
          );

          vectorLayer.addChild( vectorNode );
          
          // create the xComponentNode for the projection of the vectors along the horizontal
          const xComponentNode = new VectorComponentNode( addedVector.xVectorComponent, graph.modelViewTransformProperty, model.componentStyleProperty, model.valuesVisibleProperty );

          // create the yComponent for the projection of the vector along the vertical
          const yComponentNode = new VectorComponentNode( addedVector.yVectorComponent, graph.modelViewTransformProperty, model.componentStyleProperty, model.valuesVisibleProperty );

          vectorComponentLayer.addChild( xComponentNode );
          vectorComponentLayer.addChild( yComponentNode );

          // Add the removal listener in case this vector is removed.
          const removalListener = removedVector => {
            if ( removedVector === addedVector ) {

              removedVector.isActiveProperty.value = false;

              // remove its node from the view
              vectorLayer.removeChild( vectorNode );
              vectorNode.dispose();

              removedVector.dispose();

              // remove this listener to avoid leaking memory
              vectorSet.vectors.removeItemRemovedListener( removalListener );
            }
          };

          // link removalListener to the provided ObservableArray
          vectorSet.vectors.addItemRemovedListener( removalListener );
        } );

      } );

      const eraserButton = new EraserButton( {
        listener: () => {
          graph.erase();
          this.inspectVectorPanel.reset();
        },
        left: this.graphNode.right,
        bottom: this.graphNode.bottom
      } );

      this.setChildren( [
        this.graphNode,
        vectorComponentLayer,
        vectorComponentSumLayer,
        vectorLayer,
        vectorSumLayer,
        this.inspectVectorPanel,
        eraserButton ] );
    }

    /**
     * @public
     * reset the scene
     */
    reset() {
      this.graphNode.reset();
      this.graph.reset();
      this.inspectVectorPanel.reset();
    }
  }

  return vectorAddition.register( 'SceneNode', SceneNode );
} );