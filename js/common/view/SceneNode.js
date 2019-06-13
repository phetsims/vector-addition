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
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const InspectVectorPanel = require( 'VECTOR_ADDITION/common/view/InspectVectorPanel' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  // constants
  const VECTOR_DISPLAY_PANEL_LOCATION_LEFT = VectorAdditionConstants.VECTOR_DISPLAY_PANEL_LOCATION.left;
  const VECTOR_DISPLAY_PANEL_LOCATION_TOP = VectorAdditionConstants.VECTOR_DISPLAY_PANEL_LOCATION.top;
  const VECTOR_OPTIONS = VectorAdditionConstants.VECTOR_ARROW_OPTIONS;
  const VECTOR_SUM_OPTIONS = VectorAdditionConstants.VECTOR_SUM_ARROW_OPTIONS;

  class SceneNode extends Node {
    /**
     * @constructor
     * @param {Scene} scene
     * @param {CommonModel} model
     */
    constructor( scene, model ) {

      super();

      // @public (read-only) {scene}
      this.scene = scene;
      
      // @public (read-only) {GraphNode} Create the Graph Node
      this.graphNode = new GraphNode( scene.graph );

      // Create the vector display panel
      const inspectVectorPanel = new InspectVectorPanel( scene.vectorSets );

      // set the panel in the correct location
      inspectVectorPanel.left = VECTOR_DISPLAY_PANEL_LOCATION_LEFT;
      inspectVectorPanel.top = VECTOR_DISPLAY_PANEL_LOCATION_TOP;

      // create the vector layer
      const vectorLayer = new Node();
      // create the vector sum layer
      const vectorSumLayer = new Node();

      // loop through each vector set
      for ( let i = 0; i < scene.vectorSets.length; i++ ) {

        const currentVectorSet = scene.vectorSets[ i ];

        // on the vector set, add a listener to the vectors attribute to add the vector to the scene
        currentVectorSet.vectors.addItemAddedListener( ( addedVector ) => {
          const vectorNode = new VectorNode(
            addedVector,
            scene.graph.graphModelBounds,
            model.componentStyleProperty,
            model.angleVisibleProperty,
            model.vectorOrientationProperty.value,
            scene.graph.modelViewTransformProperty,
            VECTOR_OPTIONS
          );
          vectorLayer.addChild( vectorNode );

          // Add the removal listener in case this vector is removed.
          const removalListener = removedVector => {
            if ( removedVector === addedVector ) {

              // remove its node from the view
              vectorNode.dispose();
              removedVector.dispose();

              // remove this listener to avoid leaking memory
              currentVectorSet.vectors.removeItemRemovedListener( removalListener );
            }
          };

          // link removalListener to the provided ObservableArray
          currentVectorSet.vectors.addItemRemovedListener( removalListener );
        } );

        // create a scenery node for the sum vector
        const vectorSumNode = new VectorNode( 
          currentVectorSet.vectorSum,
          scene.graph.graphModelBounds,
          model.componentStyleProperty,
          model.angleVisibleProperty,
          model.vectorOrientationProperty.value,
          scene.graph.modelViewTransformProperty,
          VECTOR_SUM_OPTIONS
        );
        vectorSumLayer.addChild( vectorSumNode );

        // link the visibility of the Vector Sum node with the status of the checkbox
        model.sumVisibleProperty.linkAttribute( vectorSumNode, 'visible' );
      }

      const eraserButton = new EraserButton({
        listener: () => {
          scene.resetVectorSets();
        },
        left: this.graphNode.right,
        bottom: this.graphNode.bottom
      });

      this.setChildren([
        this.graphNode,
        vectorSumLayer,
        vectorLayer,
        inspectVectorPanel,
        eraserButton ]);
    }

    /**
     * @public 
     * reset the scene
     */
    reset() {
      this.graphNode.reset();
      this.scene.reset();
    }
  }

  return vectorAddition.register( 'SceneNode', SceneNode );
} );