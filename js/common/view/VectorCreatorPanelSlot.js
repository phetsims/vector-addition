// Copyright 2019, University of Colorado Boulder

/**
 * View for a single 'slot' on the VectorCreatorPanel (./VectorCreatorPanel.js).
 *
 * A slot creates a Vector when the icon is clicked.
 *
 * ## Slots can differ in:
 *  - Icon colors and sizes
 *  - Infinite slot versus only one vector per slot
 *  - Having symbols versus not having symbols
 *  - Icon components and initial vector components (e.g. on Explore 1D the initial vectors are horizontal/vertical
 *    while on Explore 2D the vectors are 45 degrees)
 *
 * ## Implementation of creation of Vectors:
 *  1. Once the icon is clicked, a Vector is made.
 *  2. A call to the SceneNode is made, passing the created Vector. The Scene Node then creates the subsequent views
 *     for the Vector (VectorNode and VectorComponentNode), layering the views correctly and forwarding the event.
 *  3. Once the Vector indicates the Vector was dropped outside the Graph, the slot will then animate the Vector and
 *     dispose the vector, signaling to the SceneNode to dispose of the views.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const ArrowOverSymbolNode = require( 'VECTOR_ADDITION/common/view/ArrowOverSymbolNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const VECTOR_MOUSE_AREA_OFFSET = 8;
  const VECTOR_TOUCH_AREA_OFFSET = 8;

  // The fixed-width of the parent of the icon. The Icon is placed in an alignBox to ensure the Icon
  // contains the same local width regardless of the initial vector components. This ensures that
  // the label of the slot is in the same place regardless of the icon size.
  const ARROW_ICON_CONTAINER_WIDTH = 35;


  class VectorCreatorPanelSlot extends HBox {

    /**
     * @param {Graph} graph - the graph to drop the vector onto
     * @param {VectorSet} vectorSet - the VectorSet that the slot adds Vectors to
     * @param {SceneNode} sceneNode - the SceneNode that this slot appears in
     * @param {Vector2} initialVectorComponents - the initial vector components to pass to created vectors
     * @param {Object} [options]
     */
    constructor( graph, vectorSet, sceneNode, initialVectorComponents, options ) {

      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( initialVectorComponents instanceof Vector2, `invalid initialVectorComponents: ${initialVectorComponents}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {

        symbol: null,       // {string|null} the symbol to pass to created vectors
        isInfinite: false,  // {boolean} indicates if the slot regenerates vectors once clicked
        iconArrowSize: 30   // {number} indicates the magnitude of the icon in view coordinates

      }, options );

      super( { spacing: 5 } );

      // convenience reference
      const modelViewTransform = graph.modelViewTransformProperty.value;

      //----------------------------------------------------------------------------------------
      // Create the icon
      //----------------------------------------------------------------------------------------

      // Get the components in view coordinates.
      const iconViewComponents = modelViewTransform.viewToModelDelta( initialVectorComponents );

      // Create the icon.
      const iconNode = VectorAdditionIconFactory.createVectorCreatorPanelIcon( iconViewComponents,
        vectorSet.vectorColorPalette, options.iconArrowSize );

      // Make the iconNode easier to grab
      iconNode.mouseArea = iconNode.shape.getOffsetShape( VECTOR_MOUSE_AREA_OFFSET );
      iconNode.touchArea = iconNode.shape.getOffsetShape( VECTOR_TOUCH_AREA_OFFSET );

      // Get the components in model coordinates of the icon. Used to animate the vector to the icon components.
      const iconComponents = modelViewTransform.viewToModelDelta( iconViewComponents
        .normalized().timesScalar( options.iconArrowSize ) );

      // Create a fixed-size box for the icon. The Icon is placed in an alignBox to ensure the Icon
      // contains the same local width regardless of the initial vector components. This ensures that
      // the label of the slot is in the same place regardless of the icon size.
      this.addChild( new AlignBox( iconNode, {
        alignBounds: new Bounds2( 0, 0, ARROW_ICON_CONTAINER_WIDTH, iconNode.height )
      } ) );

      //----------------------------------------------------------------------------------------
      // Create the label of the slot
      //----------------------------------------------------------------------------------------

      if ( options.symbol ) {
        this.addChild( new ArrowOverSymbolNode( options.symbol ) );
      }

      //----------------------------------------------------------------------------------------
      // Creation of Vectors (See ## Implementation of creation of Vectors above)
      //----------------------------------------------------------------------------------------

      // removeInputListener is unnecessary, exists for the lifetime of the sim.
      iconNode.addInputListener( DragListener.createForwardingListener( event => {

        //----------------------------------------------------------------------------------------
        // Step 1: When the icon is clicked, create a new Vector
        //----------------------------------------------------------------------------------------

        // Find where the icon was clicked relative to the scene node (view coordinates)
        const vectorCenterLocation = sceneNode.globalToLocalPoint( event.pointer.point );

        // Convert the view coordinates of where the icon was clicked into model coordinates
        const vectorCenterPosition = graph.modelViewTransformProperty.value.viewToModelPosition( vectorCenterLocation );

        // Calculate where the tail position is relative to the scene node
        const vectorTailPosition = vectorCenterPosition.minus( initialVectorComponents.timesScalar( 0.5 ) );

        // Create the new Vector Model
        const vector = new Vector( vectorTailPosition, initialVectorComponents, graph, vectorSet, options.symbol );

        vectorSet.vectors.push( vector );

        //----------------------------------------------------------------------------------------
        // Step 2: A call to the Scene Node is made, passing the created Vector to create the subsequent views
        //----------------------------------------------------------------------------------------

        sceneNode.registerVector( vector, vectorSet, event );

        // Change the visibility to allow or not allow infinite slots
        iconNode.visible = options.isInfinite;

        //----------------------------------------------------------------------------------------
        // Step 3: Once the Vector indicates the Vector was dropped outside the Graph, animate and
        // dispose the Vector, signaling to the SceneNode to dispose of the views.
        //----------------------------------------------------------------------------------------

        const animateVectorBackListener = animateBack => {

          // Get the position of the icon node relative to the scene. Used to animate the vector to the icon position.
          const iconPosition = graph.modelViewTransformProperty.value.viewToModelBounds( sceneNode.boundsOf( iconNode ) ).center;
          animateBack && vector.animateToPoint( iconPosition, iconComponents, () => {
            iconNode.visible = true;

            // Remove the vector model
            vectorSet.vectors.remove( vector );
            vector.dispose();

          } );
        };
        vector.animateBackProperty.link( animateVectorBackListener ); // unlink required when vector is removed

        //----------------------------------------------------------------------------------------
        // Observe when the vector is removed to unlink listeners
        const removeVectorListener = removedVector => {
          if ( removedVector === vector ) {
            iconNode.visible = true;
            vector.animateBackProperty.unlink( animateVectorBackListener );
            vectorSet.vectors.removeItemRemovedListener( removeVectorListener );
          }
        };
        vectorSet.vectors.addItemRemovedListener( removeVectorListener );
      } ) );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'VectorCreatorPanelSlot is not intended to be disposed' );
    }
  }

  return vectorAddition.register( 'VectorCreatorPanelSlot', VectorCreatorPanelSlot );
} );