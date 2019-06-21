// Copyright 2019, University of Colorado Boulder

/**
 * A node for a scene. Explore1D has 2 scenes.
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

  // constants
  const VECTOR_DISPLAY_PANEL_LOCATION_LEFT = 195;
  const VECTOR_DISPLAY_PANEL_LOCATION_TOP = 12;

  class SceneNode extends Node {
    /**
     * @constructor
     * @param {Scene} scene
     * @param {VectorAdditionModel} model
     * @param {VectorTypes} vectorType
     * options
     */
    constructor( scene, model, vectorType ) {

      super();

      // @public (read-only) {scene}
      this.scene = scene;

      // @public (read-only) {GraphNode} Create the Graph Node
      this.graphNode = new GraphNode( scene.graph, model.gridVisibleProperty );

      // @private {InspectVectorPanel} Create the vector display panel
      this.inspectVectorPanel = new InspectVectorPanel( scene.vectorSets );

      // set the panel in the correct location
      this.inspectVectorPanel.left = VECTOR_DISPLAY_PANEL_LOCATION_LEFT;
      this.inspectVectorPanel.top = VECTOR_DISPLAY_PANEL_LOCATION_TOP;

      // create the vector layer
      const vectorLayer = new Node();
      // create the vector sum layer
      const vectorSumLayer = new Node();

      scene.vectorSets.forEach( ( vectorSet ) => {

        // create a scenery node for the sum vector
        const vectorSumNode = new VectorSumNode(
          vectorSet.vectorSum,
          scene.graph.graphModelBounds,
          model.componentStyleProperty,
          model.angleVisibleProperty,
          model.vectorOrientationProperty.value,
          scene.graph.modelViewTransformProperty,
          model.valuesVisibleProperty
        );

        // link the visibility of the Vector Sum node with the status of the checkbox
        vectorSet.sumVisibleProperty.linkAttribute( vectorSumNode, 'visible' );

        vectorSumLayer.addChild( vectorSumNode );

        // on the vector set, add a listener to the vectors attribute to add the vector to the scene
        vectorSet.vectors.addItemAddedListener( ( addedVector ) => {
          const vectorNode = new VectorNode(
            addedVector,
            scene.graph.graphModelBounds,
            model.componentStyleProperty,
            model.angleVisibleProperty,
            model.vectorOrientationProperty.value,
            scene.graph.modelViewTransformProperty,
            model.valuesVisibleProperty
          );

          vectorLayer.addChild( vectorNode );

          // Add the removal listener in case this vector is removed.
          const removalListener = removedVector => {
            if ( removedVector === addedVector ) {

              removedVector.isActiveProperty.value = false;

              // remove its node from the view
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
          scene.resetVectorSets();
        },
        left: this.graphNode.right,
        bottom: this.graphNode.bottom
      } );

      this.setChildren( [
        this.graphNode,
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
      this.scene.reset();
      this.inspectVectorPanel.reset();
    }
  }

  return vectorAddition.register( 'SceneNode', SceneNode );
} );